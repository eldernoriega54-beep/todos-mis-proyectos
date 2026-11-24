<?php
require_once 'includes/db.php';
$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $correo = $conn->real_escape_string($_POST['correo']);
    $telefono = $conn->real_escape_string($_POST['telefono']);
    $msg = $conn->real_escape_string($_POST['mensaje']);

    $sql = "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES ('$nombre', '$correo', '$telefono', '$msg')";
    
    if ($conn->query($sql) === TRUE) {
        $mensaje = "<div class='alert success'>¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</div>";
    } else {
        $mensaje = "<div class='alert error'>Error: " . $sql . "<br>" . $conn->error . "</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Contacto - NVIDIA</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { padding-top: 80px; }
        .container { max-width: 600px; margin: 40px auto; padding: 30px; background: #222; border-radius: 8px; border-top: 5px solid var(--nvidia-green); }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #444; background: #333; color: white; border-radius: 4px; }
        .btn-submit { background: var(--nvidia-green); color: black; border: none; padding: 12px 20px; font-weight: bold; font-size: 1.1rem; cursor: pointer; width: 100%; border-radius: 4px; }
        .btn-submit:hover { opacity: 0.9; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .success { background-color: #4CAF50; color: white; }
        .error { background-color: #f44336; color: white; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container">
        <h2>Contáctanos</h2>
        <p style="margin-bottom: 20px; color: #aaa;">Completa este formulario y guardaremos tus datos en nuestra base de datos para contactarte.</p>
        
        <?php echo $mensaje; ?>

        <form method="POST" action="contacto.php">
            <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre" required>
            </div>
            <div class="form-group">
                <label>Correo Electrónico</label>
                <input type="email" name="correo" required>
            </div>
            <div class="form-group">
                <label>Teléfono (Opcional)</label>
                <input type="text" name="telefono">
            </div>
            <div class="form-group">
                <label>Mensaje</label>
                <textarea name="mensaje" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn-submit">Enviar Mensaje</button>
        </form>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
