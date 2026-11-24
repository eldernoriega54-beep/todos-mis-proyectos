const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const https = require('https');
const querystring = require('querystring');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Fallback: parse body as JSON even when Content-Type header is missing
app.use(express.text({ limit: '50mb', type: '*/*' }));
app.use((req, res, next) => {
    if (typeof req.body === 'string' && req.body.length > 0) {
        try { req.body = JSON.parse(req.body); } catch(e) {}
    }
    next();
});

const dbConfig = {
    host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER || '3uH1U51mPYMH2qZ.root',
    password: process.env.DB_PASSWORD || '6QHCXvGaFkPHhJpv',
    database: process.env.DB_NAME || 'chevez',
    ssl: { rejectUnauthorized: false }
};

const pool = mysql.createPool(dbConfig);

// =====================
// FACE++ BIOMETRIC CONFIG
// =====================
const FACEPP_KEY = process.env.FACEPP_KEY || 'gsWDaMDILdJpAx6G7GdolWaEptuKjdbE';
const FACEPP_SECRET = process.env.FACEPP_SECRET || 'yNE1C2xVfAYp7zKNoXZBPNGLtN5P-Gnq';
const FACESET_OUTER_ID = 'alumnos-iehc';

function faceppRequest(path, params) {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify({
            api_key: FACEPP_KEY,
            api_secret: FACEPP_SECRET,
            ...params
        });

        const req = https.request({
            hostname: 'api-us.faceplusplus.com',
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch(e) {
                    reject(new Error('Invalid JSON from Face++: ' + body));
                }
            });
        });

        req.on('error', err => reject(err));
        req.write(postData);
        req.end();
    });
}

const cleanBase64 = (base64) => {
    return base64.replace(/^data:image\/\w+;base64,/, "");
};

// =====================
// AUTH ADMIN
// =====================
app.post('/api/admin_auth.php', async (req, res) => {
    try {
        const { method, usuario, contrasena } = req.body;
        if (method === 'password') {
            const [rows] = await pool.query('SELECT * FROM administradores WHERE usuario = ?', [usuario]);
            if (rows.length === 0) return res.status(401).json({ status: 'error', message: 'Usuario no encontrado' });
            if (rows[0].contrasena !== contrasena) return res.status(401).json({ status: 'error', message: 'Contrasena incorrecta' });
            return res.json({ status: 'success', token: 'token_admin', usuario: usuario });
        }
        if (method === 'create') {
            if (!usuario || !contrasena) return res.status(400).json({ status: 'error', message: 'Faltan datos' });
            await pool.query('INSERT INTO administradores (usuario, contrasena) VALUES (?, ?)', [usuario, contrasena]);
            return res.json({ status: 'success', message: 'Administrador creado' });
        }
        res.status(400).json({ status: 'error', message: 'Metodo no soportado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// =====================
// FACE LOGIN (Face++ Direct Biometric Comparison)
// =====================
app.post('/api/face_login.php', async (req, res) => {
    try {
        const { imagen_base64 } = req.body;
        if (!imagen_base64) return res.status(400).json({ status: 'error', message: 'Faltan datos' });

        // 1. Detectar rostro actual en cámara
        const detectRes = await faceppRequest('/facepp/v3/detect', {
            image_base64: cleanBase64(imagen_base64)
        });

        if (!detectRes.faces || detectRes.faces.length === 0) {
            return res.json({ status: 'error', message: 'No se detecta un rostro claro frente a la cámara.' });
        }

        const currentFaceToken = detectRes.faces[0].face_token;

        // 2. Obtener usuarios registrados con biometría
        const [users] = await pool.query(
            'SELECT id, nombre, correo, face_id FROM usuarios WHERE face_id IS NOT NULL AND face_id NOT LIKE "%-%" ORDER BY id DESC'
        );

        if (users.length === 0) {
            return res.json({ status: 'error', message: 'No hay usuarios registrados con biometría todavía.' });
        }

        // 3. Comparar rostro con cada usuario registrado
        let bestMatch = null;
        let highestConfidence = 0;

        for (const user of users) {
            try {
                const compRes = await faceppRequest('/facepp/v3/compare', {
                    face_token1: currentFaceToken,
                    face_token2: user.face_id
                });

                if (compRes.confidence && compRes.confidence > highestConfidence) {
                    highestConfidence = compRes.confidence;
                    if (compRes.confidence >= 75) {
                        bestMatch = user;
                        break; // Coincidencia biométrica encontrada
                    }
                }
            } catch(e) {}
        }

        if (bestMatch) {
            const [votos] = await pool.query('SELECT id_eleccion FROM votos WHERE id_usuario = ?', [bestMatch.id]);
            bestMatch.voted_elections = votos.map(v => v.id_eleccion);
            return res.json({ status: 'success', user: bestMatch, confidence: highestConfidence });
        } else {
            return res.json({ status: 'error', message: 'Rostro no coincide con ningún votante registrado.' });
        }
    } catch (error) {
        return res.json({ status: 'error', message: error.message });
    }
});

// =====================
// FACE REGISTER (Face++)
// =====================
app.post('/api/face_register.php', async (req, res) => {
    try {
        const { nombre, email, imagen_base64 } = req.body;
        if (!email || !imagen_base64) return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios' });

        // 1. Detectar rostro
        const detectRes = await faceppRequest('/facepp/v3/detect', {
            image_base64: cleanBase64(imagen_base64)
        });

        if (!detectRes.faces || detectRes.faces.length === 0) {
            return res.json({ status: 'error', message: 'No se detectó un rostro claro frente a la cámara.' });
        }

        const faceToken = detectRes.faces[0].face_token;

        // 2. Agregar rostro a la colección biométrica alumnos-iehc
        await faceppRequest('/facepp/v3/faceset/addface', {
            outer_id: FACESET_OUTER_ID,
            face_tokens: faceToken
        });

        // 3. Guardar en TiDB
        await pool.query(
            'INSERT INTO usuarios (nombre, correo, face_id, collection_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE face_id = ?, nombre = ?',
            [nombre || 'Visitante', email, faceToken, FACESET_OUTER_ID, faceToken, nombre || 'Visitante']
        );

        res.json({ status: 'success', message: 'Rostro registrado con éxito en Face++' });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

// =====================
// VOTAR
// =====================
app.post('/api/votar.php', async (req, res) => {
    try {
        const { id_usuario, id_candidato, id_eleccion } = req.body;
        if (!id_usuario || !id_candidato) return res.status(400).json({ status: 'error', message: 'Faltan datos' });

        const eleccionId = id_eleccion || 1;
        const [existing] = await pool.query('SELECT id FROM votos WHERE id_usuario = ? AND id_eleccion = ?', [id_usuario, eleccionId]);
        if (existing.length > 0) return res.json({ status: 'error', message: 'Ya votaste en esta eleccion' });

        await pool.query('UPDATE usuarios SET ya_voto = 1 WHERE id = ?', [id_usuario]);
        await pool.query('INSERT INTO votos (id_usuario, id_eleccion, id_candidato) VALUES (?, ?, ?)', [id_usuario, eleccionId, id_candidato]);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// =====================
// Also handle 'vote.php' (alias used by votar.html)
app.post('/api/vote.php', async (req, res) => {
    try {
        const { id_usuario, id_candidato, id_eleccion } = req.body;
        if (!id_usuario || !id_candidato) return res.status(400).json({ status: 'error', message: 'Faltan datos' });

        const eleccionId = id_eleccion || 1;
        const [existing] = await pool.query('SELECT id FROM votos WHERE id_usuario = ? AND id_eleccion = ?', [id_usuario, eleccionId]);
        if (existing.length > 0) return res.json({ status: 'error', message: 'Ya votaste en esta eleccion' });

        await pool.query('UPDATE usuarios SET ya_voto = 1 WHERE id = ?', [id_usuario]);
        await pool.query('INSERT INTO votos (id_usuario, id_eleccion, id_candidato) VALUES (?, ?, ?)', [id_usuario, eleccionId, id_candidato]);
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Check voter status
app.get('/api/check_voter.php', async (req, res) => {
    try {
        const { id } = req.query;
        const [votos] = await pool.query('SELECT id_eleccion FROM votos WHERE id_usuario = ?', [id]);
        const votedElections = votos.map(v => v.id_eleccion);
        res.json({ status: 'success', voted_elections: votedElections });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});
// =====================
app.post('/api/email_login.php', async (req, res) => {
    try {
        const { email } = req.body;
        const [users] = await pool.query('SELECT * FROM usuarios WHERE correo = ? LIMIT 1', [email]);
        if (users.length > 0) {
            res.json({ status: 'success', user: users[0] });
        } else {
            res.status(400).json({ status: 'error', message: 'Correo no registrado.' });
        }
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// =====================
// ELECCIONES (GET + POST)
// =====================
app.get('/api/manage_elections.php', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM elecciones ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

app.post('/api/manage_elections.php', async (req, res) => {
    try {
        // Action can come from URL (?action=delete) OR from body
        const action = req.query.action || req.body.action;

        if (action === 'add') {
            const { titulo } = req.body;
            if (!titulo) return res.json({ status: 'error', message: 'Titulo requerido' });
            const [result] = await pool.query('INSERT INTO elecciones (titulo, estado) VALUES (?, ?)', [titulo, 'activa']);
            return res.json({ status: 'success', id: result.insertId });
        }

        if (action === 'toggle') {
            const { id, estado } = req.body;
            const nuevoEstado = (estado === 'activa' || estado === true || estado === 'true') ? 'activa' : 'inactiva';
            await pool.query('UPDATE elecciones SET estado = ? WHERE id = ?', [nuevoEstado, id]);
            return res.json({ status: 'success' });
        }

        if (action === 'delete') {
            const { id } = req.body;
            if (!id) return res.json({ status: 'error', message: 'ID requerido' });
            await pool.query('DELETE FROM votos WHERE id_eleccion = ?', [id]);
            await pool.query('DELETE FROM candidatos WHERE id_eleccion = ?', [id]);
            await pool.query('DELETE FROM elecciones WHERE id = ?', [id]);
            return res.json({ status: 'success' });
        }

        res.json({ status: 'error', message: 'Accion no reconocida: ' + action });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

// =====================
// CANDIDATOS (GET + POST)
// =====================
app.get('/api/manage_candidates.php', async (req, res) => {
    try {
        const { id_eleccion } = req.query;
        const [rows] = await pool.query('SELECT * FROM candidatos WHERE id_eleccion = ? ORDER BY id ASC', [id_eleccion || 0]);
        res.json({ status: 'success', data: rows });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

app.post('/api/manage_candidates.php', async (req, res) => {
    try {
        // Action can come from URL (?action=add) OR from body
        const action = req.query.action || req.body.action;

        if (action === 'get') {
            const { id_eleccion } = req.body;
            const [rows] = await pool.query('SELECT * FROM candidatos WHERE id_eleccion = ? ORDER BY id ASC', [id_eleccion || 0]);
            return res.json({ status: 'success', data: rows });
        }

        if (action === 'add') {
            const { id_eleccion, nombre, propuesta, foto } = req.body;
            if (!id_eleccion || !nombre) return res.json({ status: 'error', message: 'Faltan datos' });
            await pool.query('INSERT INTO candidatos (id_eleccion, nombre, propuesta, foto_url) VALUES (?, ?, ?, ?)',
                [id_eleccion, nombre, propuesta || '', foto || null]);
            return res.json({ status: 'success' });
        }

        if (action === 'delete') {
            const { id } = req.body;
            await pool.query('DELETE FROM votos WHERE id_candidato = ?', [id]);
            await pool.query('DELETE FROM candidatos WHERE id = ?', [id]);
            return res.json({ status: 'success' });
        }

        res.json({ status: 'error', message: 'Accion no reconocida' });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

// =====================
// USUARIOS (ADMIN)
// =====================
app.get('/api/get_users.php', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.*, COUNT(v.id) as total_votos 
            FROM usuarios u 
            LEFT JOIN votos v ON u.id = v.id_usuario 
            GROUP BY u.id 
            ORDER BY u.nombre ASC
        `);
        res.json({ status: 'success', data: rows });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

app.post('/api/add_user.php', async (req, res) => {
    try {
        const { nombre, correo, clave } = req.body;
        await pool.query('INSERT INTO usuarios (nombre, correo, clave) VALUES (?, ?, ?)', [nombre, correo, clave || null]);
        res.json({ status: 'success' });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

app.post('/api/edit_user.php', async (req, res) => {
    try {
        const { id, nombre, correo } = req.body;
        await pool.query('UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?', [nombre, correo, id]);
        res.json({ status: 'success' });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

app.post('/api/delete_vote.php', async (req, res) => {
    try {
        const { id_usuario } = req.body;
        await pool.query('DELETE FROM votos WHERE id_usuario = ?', [id_usuario]);
        await pool.query('UPDATE usuarios SET ya_voto = 0 WHERE id = ?', [id_usuario]);
        res.json({ status: 'success' });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

// =====================
// RESULTADOS
// =====================
app.get('/api/get_results.php', async (req, res) => {
    try {
        const id_eleccion = req.query.id_eleccion || 1;
        const [candidatos] = await pool.query('SELECT * FROM candidatos WHERE id_eleccion = ?', [id_eleccion]);
        const [votos] = await pool.query('SELECT id_candidato, COUNT(*) as total FROM votos WHERE id_eleccion = ? GROUP BY id_candidato', [id_eleccion]);
        const [votosTotal] = await pool.query('SELECT COUNT(*) as total FROM votos WHERE id_eleccion = ?', [id_eleccion]);

        const votosMap = {};
        votos.forEach(v => votosMap[v.id_candidato] = Number(v.total));
        const result = candidatos.map(c => ({
            id: c.id,
            nombre: c.nombre,
            propuesta: c.propuesta,
            foto_url: c.foto_url,
            total_votos: votosMap[c.id] || 0
        }));

        res.json({ status: 'success', data: result, total_general: Number(votosTotal[0].total) });
    } catch (e) { res.json({ status: 'error', message: e.message }); }
});

// Catch-all for remaining PHP routes
app.all('/api/*.php', (req, res) => {
    res.json({ status: 'success', data: [], message: 'OK' });
});

// Static files (must be LAST)
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor Node.js corriendo en puerto ' + PORT));
