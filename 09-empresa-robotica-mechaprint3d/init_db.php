<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "mechapro_db";

$conn = new mysqli($host, $user, $password);

if ($conn->connect_error) {
    die("Error de conexion: " . $conn->connect_error);
}

// Crear DB
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Base de datos creada o ya existe.<br>";
} else {
    echo "Error creando base de datos: " . $conn->error;
}

$conn->select_db($dbname);

// Crear tablas
$sql = "CREATE TABLE IF NOT EXISTS productos (
    id INT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    archivo_stl TEXT NOT NULL,
    stock INT DEFAULT 10
)";
$conn->query($sql);

$sql = "CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
)";
$conn->query($sql);

// Insertar datos desde catalogo.json
$json_data = file_get_contents('catalogo.json');
if ($json_data !== false) {
    $productos = json_decode($json_data, true);
    if ($productos !== null) {
        $stmt = $conn->prepare("INSERT IGNORE INTO productos (id, nombre, categoria, precio, imagen, archivo_stl) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($productos as $item) {
            $stmt->bind_param("issdss", $item['id'], $item['nombre'], $item['categoria'], $item['precio_lempiras'], $item['imagen'], $item['archivo_stl']);
            $stmt->execute();
        }
        echo "Productos importados correctamente.<br>";
    }
} else {
    echo "No se encontro catalogo.json.<br>";
}

echo "Inicializacion completada.";
$conn->close();
?>
