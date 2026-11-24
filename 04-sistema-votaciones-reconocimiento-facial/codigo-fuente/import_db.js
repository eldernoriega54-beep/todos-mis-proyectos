const mysql = require('mysql2/promise');
const fs = require('fs');

async function importDb() {
    try {
        const pool = mysql.createPool({
            host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
            port: 4000,
            user: '3uH1U51mPYMH2qZ.root',
            password: '6QHCXvGaFkPHhJpv',
            database: 'chevez',
            ssl: { rejectUnauthorized: false },
            multipleStatements: true
        });

        const sql = fs.readFileSync('C:\\Users\\ELDER NORIEGA\\OneDrive\\Desktop\\base_datos.sql', 'utf8');
        console.log('Ejecutando SQL...');
        await pool.query(sql);
        console.log('Base de datos importada exitosamente!');
        process.exit(0);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}
importDb();
