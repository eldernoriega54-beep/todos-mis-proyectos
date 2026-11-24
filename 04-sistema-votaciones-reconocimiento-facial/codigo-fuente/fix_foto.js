const mysql = require('mysql2/promise');
async function fix() {
    const pool = mysql.createPool({
        host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
        port: 4000,
        user: '3uH1U51mPYMH2qZ.root',
        password: '6QHCXvGaFkPHhJpv',
        database: 'chevez',
        ssl: { rejectUnauthorized: false }
    });
    // Ampliar la columna foto_url para que quepa base64
    await pool.query('ALTER TABLE candidatos MODIFY COLUMN foto_url LONGTEXT');
    console.log('Columna foto_url cambiada a LONGTEXT!');
    process.exit(0);
}
fix();
