const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ConfiguraciÃ³n de base de datos basada en JSON (100% nativa, sin errores de GLIBC)
const dbPath = path.join(__dirname, 'database.json');

function getDB() {
    if (!fs.existsSync(dbPath)) {
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return [];
    }
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'btpir_secreto_super_seguro_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// --- RUTAS ---

app.post('/procesar-contacto', (req, res) => {
    const { nombre, tutor, telefono, correo, escuela, grado, mensaje } = req.body;

    if (!nombre || !telefono) {
        return res.redirect('/contacto.html?status=incompleto');
    }

    const aspirantes = getDB();
    aspirantes.push({
        id: Date.now(), // ID Ãºnico basado en tiempo
        nombre_aspirante: nombre,
        nombre_tutor: tutor,
        telefono: telefono,
        correo: correo,
        escuela_origen: escuela,
        grado_aspira: grado || '10mo Grado',
        mensaje: mensaje,
        atendido: 0,
        fecha_registro: new Date().toISOString()
    });

    saveDB(aspirantes);
    res.redirect('/contacto.html?status=exito');
});

// --- PANEL DE ADMIN ---
const PASSWORD_ADMIN = 'admin123';

function requireAuth(req, res, next) {
    if (req.session && req.session.btpir_admin) {
        next();
    } else {
        res.render('login', { error: null });
    }
}

app.post('/admin/login', (req, res) => {
    if (req.body.admin_pass === PASSWORD_ADMIN) {
        req.session.btpir_admin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'ContraseÃ±a incorrecta' });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/contacto.html');
});

app.get('/admin', requireAuth, (req, res) => {
    const ok = req.query.ok === '1';
    
    // Obtener y ordenar filas (las mÃ¡s recientes primero)
    const filas = getDB().sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
    const pendientes = filas.filter(f => f.atendido === 0).length;
    const total = filas.length;

    res.render('admin', { filas, total, pendientes, ok });
});

app.get('/admin/atender/:id', requireAuth, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const aspirantes = getDB();
    
    const index = aspirantes.findIndex(a => a.id === id);
    if (index !== -1) {
        aspirantes[index].atendido = 1;
        saveDB(aspirantes);
    }
    
    res.redirect('/admin?ok=1');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});

