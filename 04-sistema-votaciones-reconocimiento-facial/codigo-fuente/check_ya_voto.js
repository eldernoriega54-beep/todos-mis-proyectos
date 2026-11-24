const mysql = require('mysql2/promise');
async function checkUsers() {
    const pool = mysql.createPool({
        host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
        port: 4000,
        user: '3uH1U51mPYMH2qZ.root',
        password: '6QHCXvGaFkPHhJpv',
        database: 'chevez',
        ssl: { rejectUnauthorized: false }
    });
    const [users] = await pool.query('SELECT id, nombre, ya_voto FROM usuarios WHERE id = 3706');
    console.log('USER:', users[0]);
    process.exit(0);
}
checkUsers();
