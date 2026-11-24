const mysql = require('mysql2/promise');

async function checkAdmin() {
    const pool = mysql.createPool({
        host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
        port: 4000,
        user: '3uH1U51mPYMH2qZ.root',
        password: '6QHCXvGaFkPHhJpv',
        database: 'chevez',
        ssl: { rejectUnauthorized: false }
    });

    const [rows] = await pool.query('SELECT * FROM administradores');
    console.log(rows);
    process.exit(0);
}
checkAdmin();
