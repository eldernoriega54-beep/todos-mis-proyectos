<?php
require_once 'includes/db.php';

// Filtros básicos (simulados para la UI, pero listos para backend)
$where = "1=1";
if (isset($_GET['serie']) && !empty($_GET['serie'])) {
    $serie = $conn->real_escape_string($_GET['serie']);
    $where .= " AND serie = '$serie'";
}

$sql = "SELECT * FROM productos WHERE $where";
$result = $conn->query($sql);

$mensaje = "";
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['comprar_producto_id'])) {
    $producto_id = $_POST['comprar_producto_id'];
    $nombre = $conn->real_escape_string($_POST['nombre']);
    $correo = $conn->real_escape_string($_POST['correo']);
    
    $insert = "INSERT INTO pedidos (cliente_nombre, cliente_correo, producto_id) VALUES ('$nombre', '$correo', $producto_id)";
    if ($conn->query($insert) === TRUE) {
        $mensaje = "<div class='alert success'>Pedido realizado con éxito. Puedes rastrearlo en 'Mis Pedidos'.</div>";
    } else {
        $mensaje = "<div class='alert error'>Error al procesar el pedido.</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo - NVIDIA</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #1a1a1a; padding-top: 80px; }
        .catalogo-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .filtros { background: #333; padding: 15px; border-radius: 5px; margin-bottom: 20px; display: flex; gap: 15px;}
        .filtros select, .filtros button { padding: 10px; background: #222; color: white; border: 1px solid var(--nvidia-green); border-radius: 4px; }
        .filtros button { background: var(--nvidia-green); color: black; cursor: pointer; font-weight: bold; }
        .grid-productos { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .producto-card { background: #222; border: 1px solid #444; border-radius: 8px; overflow: hidden; text-align: center; padding-bottom: 15px; transition: transform 0.3s; }
        .producto-card:hover { transform: translateY(-5px); border-color: var(--nvidia-green); }
        .producto-card img { width: 100%; height: 200px; object-fit: cover; }
        .producto-info { padding: 15px; }
        .precio { color: var(--nvidia-green); font-size: 1.5rem; font-weight: bold; margin: 10px 0; }
        .agotado { color: red; font-weight: bold; }
        .btn-comprar { background: var(--nvidia-green); color: black; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 80%; }
        .alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; }
        .success { background-color: #4CAF50; color: white; }
        .error { background-color: #f44336; color: white; }
        /* Modal simple para comprar */
        #modal-compra { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; align-items: center; justify-content: center; }
        .modal-content { background: #222; padding: 30px; border-radius: 8px; width: 400px; border: 1px solid var(--nvidia-green); }
        .modal-content input { width: 100%; padding: 10px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; }
        .close-btn { float: right; cursor: pointer; color: white; font-size: 20px; }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="catalogo-container">
        <h2 style="color: var(--nvidia-green); margin-bottom: 20px;">Catálogo de Productos</h2>
        <?php echo $mensaje; ?>

        <form class="filtros" method="GET" action="catalogo.php">
            <select name="serie">
                <option value="">Todas las series</option>
                <option value="RTX 30" <?php if(isset($_GET['serie']) && $_GET['serie'] == 'RTX 30') echo 'selected'; ?>>RTX 30 Series</option>
                <option value="RTX 40" <?php if(isset($_GET['serie']) && $_GET['serie'] == 'RTX 40') echo 'selected'; ?>>RTX 40 Series</option>
                <option value="RTX 50" <?php if(isset($_GET['serie']) && $_GET['serie'] == 'RTX 50') echo 'selected'; ?>>RTX 50 Series</option>
            </select>
            <button type="submit">Filtrar</button>
        </form>

        <div class="grid-productos">
            <?php
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<div class='producto-card'>";
                    // Asumiendo que las imágenes no existen, se pone un placeholder, pero la BD tiene rutas
                    echo "<img src='assets/images/logo-white.png' alt='{$row['nombre']}' style='object-fit: contain; padding: 20px; background: #111;'>";
                    echo "<div class='producto-info'>";
                    echo "<h3>{$row['nombre']}</h3>";
                    echo "<p>{$row['descripcion']}</p>";
                    echo "<div class='precio'>L. " . number_format($row['precio_hnl'], 2) . "</div>";
                    if ($row['stock'] > 0) {
                        echo "<button class='btn-comprar' onclick='abrirModal({$row['id']}, \"{$row['nombre']}\")'>Comprar Ahora</button>";
                    } else {
                        echo "<p class='agotado'>AGOTADO</p>";
                    }
                    echo "</div></div>";
                }
            } else {
                echo "<p>No se encontraron productos.</p>";
            }
            ?>
        </div>
    </div>

    <!-- Modal de Compra -->
    <div id="modal-compra">
        <div class="modal-content">
            <span class="close-btn" onclick="cerrarModal()">&times;</span>
            <h3 id="modal-titulo" style="margin-bottom: 15px; color: var(--nvidia-green);">Realizar Pedido</h3>
            <form method="POST" action="catalogo.php">
                <input type="hidden" name="comprar_producto_id" id="modal-producto-id">
                <input type="text" name="nombre" placeholder="Tu Nombre Completo" required>
                <input type="email" name="correo" placeholder="Tu Correo Electrónico" required>
                <button type="submit" class="btn-comprar" style="width: 100%;">Confirmar Pedido</button>
            </form>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>

    <script>
        function abrirModal(id, nombre) {
            document.getElementById('modal-producto-id').value = id;
            document.getElementById('modal-titulo').innerText = 'Pedido: ' + nombre;
            document.getElementById('modal-compra').style.display = 'flex';
        }
        function cerrarModal() {
            document.getElementById('modal-compra').style.display = 'none';
        }
    </script>
</body>
</html>
