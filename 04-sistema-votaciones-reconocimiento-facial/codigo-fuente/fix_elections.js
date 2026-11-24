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
    // Borrar la eleccion de robotica (id=1)
    await pool.query('DELETE FROM votos WHERE id_eleccion = 1');
    await pool.query('DELETE FROM candidatos WHERE id_eleccion = 1');
    await pool.query('DELETE FROM elecciones WHERE id = 1');
    console.log('Eleccion de robotica borrada!');

    const [elecs] = await pool.query('SELECT * FROM elecciones');
    console.log('Elecciones restantes:', elecs);
    process.exit(0);
}
fix();
