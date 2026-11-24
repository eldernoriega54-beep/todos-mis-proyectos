const mysql = require('mysql2/promise');
async function check() {
    const pool = mysql.createPool({
        host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
        port: 4000,
        user: '3uH1U51mPYMH2qZ.root',
        password: '6QHCXvGaFkPHhJpv',
        database: 'chevez',
        ssl: { rejectUnauthorized: false }
    });
    const [cols] = await pool.query('DESCRIBE candidatos');
    console.log('CANDIDATOS COLUMNS:', cols.map(c => c.Field));
    const [elecs] = await pool.query('SELECT * FROM elecciones');
    console.log('ELECCIONES:', elecs);
    process.exit(0);
}
check();
