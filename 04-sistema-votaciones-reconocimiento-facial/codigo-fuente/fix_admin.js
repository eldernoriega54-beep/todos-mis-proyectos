const mysql = require('mysql2/promise');

async function fixAdmin() {
    try {
        const pool = mysql.createPool({
            host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
            port: 4000,
            user: '3uH1U51mPYMH2qZ.root',
            password: '6QHCXvGaFkPHhJpv',
            database: 'chevez',
            ssl: { rejectUnauthorized: false }
        });

        await pool.query('UPDATE administradores SET contrasena = ? WHERE usuario = ?', ['admin123', 'admin']);
        console.log('Password updated to plaintext admin123');
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
fixAdmin();
