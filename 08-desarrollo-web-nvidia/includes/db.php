<?php
$host = "localhost";
$user = "root";
$pass = ""; // En XAMPP, la contraseña suele estar vacía
$dbname = "nvidia_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
