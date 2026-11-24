const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// Parchear face_login
code = code.replace(
    /if \(users\.length > 0\) \{\s*return res\.json\(\{ status: 'success', user: users\[0\] \}\);\s*\}/g,
    if (users.length > 0) {
                const user = users[0];
                const [votos] = await pool.query('SELECT id_eleccion FROM votos WHERE id_usuario = ?', [user.id]);
                user.voted_elections = votos.map(v => v.id_eleccion);
                return res.json({ status: 'success', user });
            }
);

// Parchear email_login
code = code.replace(
    /if \(users\.length > 0\) \{\s*const validPassword = await bcrypt\.compare\(clave, users\[0\]\.clave\);\s*if \(validPassword\) \{\s*return res\.json\(\{ status: 'success', user: users\[0\] \}\);\s*\}/g,
    if (users.length > 0) {
            const validPassword = await bcrypt.compare(clave, users[0].clave);
            if (validPassword) {
                const user = users[0];
                const [votos] = await pool.query('SELECT id_eleccion FROM votos WHERE id_usuario = ?', [user.id]);
                user.voted_elections = votos.map(v => v.id_eleccion);
                return res.json({ status: 'success', user });
            }
);

fs.writeFileSync('server.js', code);
console.log('Fixed face_login and email_login successfully!');
