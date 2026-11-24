const mysql = require('mysql2/promise');
async function checkVotes() {
    const pool = mysql.createPool({
        host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
        port: 4000,
        user: '3uH1U51mPYMH2qZ.root',
        password: '6QHCXvGaFkPHhJpv',
        database: 'chevez',
        ssl: { rejectUnauthorized: false }
    });
    const [votos] = await pool.query('SELECT v.*, c.nombre as candidato FROM votos v LEFT JOIN candidatos c ON v.id_candidato = c.id ORDER BY v.id DESC LIMIT 10');
    console.log('VOTOS EN BD:', JSON.stringify(votos, null, 2));
    const [candidatos] = await pool.query('SELECT * FROM candidatos');
    console.log('CANDIDATOS:', JSON.stringify(candidatos, null, 2));
    process.exit(0);
}
checkVotes();
