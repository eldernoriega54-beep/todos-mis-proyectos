<?php
$host     = "localhost";
$port     = "3306";
$user     = "root";
$password = "";
$dbname   = "facial_votaciones";

try {
    // Conexión al servidor MySQL sin seleccionar BD todavía
    $conn = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crear la base de datos si no existe
    $conn->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Base de datos '$dbname' asegurada.<br>";

    // Usar la base de datos
    $conn->exec("USE `$dbname`");
    $conn->exec("SET FOREIGN_KEY_CHECKS=0;");

    // =========================
    // TABLA USUARIOS
    // =========================
    $conn->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        correo VARCHAR(255) NOT NULL UNIQUE,
        clave VARCHAR(255) NULL,
        ya_voto TINYINT(1) DEFAULT 0,
        estado VARCHAR(50) DEFAULT 'Activo',
        face_id VARCHAR(100) NULL,
        collection_id VARCHAR(100) NULL DEFAULT 'votantes-chevez'
    ) ENGINE=InnoDB;");
    echo "✅ Tabla 'usuarios' verificada.<br>";

    // =========================
    // TABLA ELECCIONES
    // =========================
    $conn->exec("CREATE TABLE IF NOT EXISTS elecciones (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        estado ENUM('activa','inactiva') DEFAULT 'activa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");
    echo "✅ Tabla 'elecciones' verificada.<br>";

    // =========================
    // TABLA CANDIDATOS
    // =========================
    $conn->exec("CREATE TABLE IF NOT EXISTS candidatos (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        id_eleccion INT(11) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        propuesta TEXT,
        foto_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_eleccion) REFERENCES elecciones(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;");
    echo "✅ Tabla 'candidatos' verificada.<br>";

    // =========================
    // TABLA VOTOS
    // =========================
    $conn->exec("CREATE TABLE IF NOT EXISTS votos (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT(11) NOT NULL,
        id_eleccion INT(11) NOT NULL,
        id_candidato INT(11) NOT NULL,
        fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_voto (id_usuario, id_eleccion),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (id_candidato) REFERENCES candidatos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;");
    echo "✅ Tabla 'votos' verificada.<br>";

    // =========================
    // TABLA ADMINISTRADORES
    // =========================
    $conn->exec("CREATE TABLE IF NOT EXISTS administradores (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");
    echo "✅ Tabla 'administradores' verificada.<br>";

    // Admin por defecto si no existe
    $stmt = $conn->prepare("SELECT id FROM administradores WHERE usuario = 'admin'");
    $stmt->execute();
    if (!$stmt->fetch()) {
        $hash = password_hash('admin123', PASSWORD_DEFAULT);
        $conn->exec("INSERT INTO administradores (usuario, contrasena) VALUES ('admin', '$hash')");
        echo "✅ Admin por defecto creado: usuario=<b>admin</b> / clave=<b>admin123</b><br>";
    }

    $conn->exec("SET FOREIGN_KEY_CHECKS=1;");

    echo "<br><h3 style='color:green'>🎉 ¡Base de datos configurada correctamente!</h3>";
    echo "<a href='index.html'>→ Ir al sistema de votación</a> &nbsp;|&nbsp; ";
    echo "<a href='admin_login.html'>→ Ir al admin</a>";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
$conn = null;
?>