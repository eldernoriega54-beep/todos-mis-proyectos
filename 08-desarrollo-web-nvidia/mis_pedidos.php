<?php
require_once 'includes/db.php';

$pedido_info = null;
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['buscar_pedido'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $sql = "SELECT p.id, p.estado, p.fecha_pedido, pr.nombre as producto_nombre 
            FROM pedidos p JOIN productos pr ON p.producto_id = pr.id 
            WHERE p.cliente_correo = '$email' ORDER BY p.fecha_pedido DESC";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $pedido_info = $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mis Pedidos - NVIDIA</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { padding-top: 80px; }
        .container { max-width: 800px; margin: 40px auto; padding: 20px; background: #222; border-radius: 8px; }
        .form-buscar { display: flex; gap: 10px; margin-bottom: 30px; }
        .form-buscar input { flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #555; background: #333; color: white; }
        .form-buscar button { padding: 10px 20px; background: var(--nvidia-green); color: black; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; }
        .pedido-card { background: #1a1a1a; padding: 20px; margin-bottom: 20px; border-left: 5px solid var(--nvidia-green); }
        .estado { font-size: 1.2rem; font-weight: bold; color: var(--nvidia-green); margin-top: 10px; }
        .timeline { margin-top: 20px; display: flex; justify-content: space-between; position: relative; }
        .timeline::before { content: ''; position: absolute; top: 15px; left: 0; width: 100%; height: 2px; background: #444; z-index: 1; }
        .step { position: relative; z-index: 2; text-align: center; flex: 1; }
        .circle { width: 30px; height: 30px; background: #444; border-radius: 50%; margin: 0 auto 10px auto; line-height: 30px; }
        .step.active .circle { background: var(--nvidia-green); color: black; }
        .step.active ~ .step .circle { background: #444; }
        .step-label { font-size: 12px; color: #aaa; }
    </style>
</head>
<body>
    <?php 
    $hide_video = true;
    include 'includes/header.php'; 
    ?>

    <div class="container">
        <h2>Rastrear Mis Pedidos</h2>
        <p style="margin-bottom: 20px;">Ingresa tu correo electrónico para ver el estado de tus pedidos.</p>
        
        <form class="form-buscar" method="POST">
            <input type="email" name="email" placeholder="correo@ejemplo.com" required>
            <button type="submit" name="buscar_pedido">Buscar</button>
        </form>

        <?php if ($pedido_info !== null): ?>
            <h3>Resultados:</h3>
            <?php foreach($pedido_info as $ped): ?>
                <div class="pedido-card">
                    <h4>Pedido #<?php echo $ped['id']; ?> - <?php echo $ped['producto_nombre']; ?></h4>
                    <p>Fecha: <?php echo $ped['fecha_pedido']; ?></p>
                    <div class="estado">Estado actual: <?php echo $ped['estado']; ?></div>
                    
                    <?php 
                    $estados_orden = ['Recibido', 'En tránsito', 'En país de destino', 'En aduanas', 'En camino a ciudad', 'Entregado'];
                    $current_idx = array_search($ped['estado'], $estados_orden);
                    ?>
                    
                    <div class="timeline">
                        <?php foreach($estados_orden as $idx => $e): ?>
                            <div class="step <?php echo ($idx <= $current_idx) ? 'active' : ''; ?>">
                                <div class="circle"><i class="fas <?php echo ($idx <= $current_idx) ? 'fa-check' : 'fa-clock'; ?>"></i></div>
                                <div class="step-label"><?php echo $e; ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php elseif ($_SERVER["REQUEST_METHOD"] == "POST"): ?>
            <p style="color: red;">No se encontraron pedidos para este correo.</p>
        <?php endif; ?>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
