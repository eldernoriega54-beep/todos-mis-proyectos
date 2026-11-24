<?php
$host = "localhost"; $user = "root"; $password = ""; $dbname = "mechapro_db";
$conn = new mysqli($host, $user, $password, $dbname);

$msg = "";
$order_id = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['producto_id']) && isset($_POST['cliente_nombre'])) {
    $prod_id = (int)$_POST['producto_id'];
    $cliente = $conn->real_escape_string($_POST['cliente_nombre']);
    
    // Obtener precio
    $res = $conn->query("SELECT precio FROM productos WHERE id = $prod_id");
    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $precio = $row['precio'];
        
        $sql = "INSERT INTO pedidos (producto_id, cliente_nombre, precio, estado) VALUES ($prod_id, '$cliente', $precio, 'Pendiente')";
        if ($conn->query($sql) === TRUE) {
            $order_id = $conn->insert_id;
            $msg = "Pedido realizado con exito. Tu ID de seguimiento es: <strong>#$order_id</strong>";
        } else {
            $msg = "Error al procesar el pedido.";
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['producto_id'])) {
    $prod_id = (int)$_POST['producto_id'];
} else {
    header("Location: catalogo.php");
    exit();
}

$producto = null;
if (isset($prod_id)) {
    $res = $conn->query("SELECT * FROM productos WHERE id = $prod_id");
    if ($res && $res->num_rows > 0) {
        $producto = $res->fetch_assoc();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar Pedido - MechaPrint 3D</title>
    <style>
        :root { --primary: #000; --secondary: #fff; --accent: #005ce6; --bg: #f5f5f5; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: var(--bg); }
        header { background: var(--primary); color: var(--secondary); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: var(--secondary); text-decoration: none; margin-left: 2rem; }
        .container { max-width: 600px; margin: 3rem auto; background: var(--secondary); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; }
        img { max-width: 100%; height: 250px; object-fit: contain; background: #eee; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1rem; text-align: left; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .btn { background: var(--accent); color: var(--secondary); padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; width: 100%; }
        .btn:hover { background: #0044ab; }
        .success { padding: 1rem; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <header>
        <a href="index.php" style="color:#fff; text-decoration:none; font-size:1.5rem; font-weight:bold;">MechaPrint 3D</a>
        <nav><a href="catalogo.php">Volver al Catalogo</a></nav>
    </header>

    <div class="container">
        <?php if ($msg): ?>
            <div class="success"><?php echo $msg; ?></div>
            <a href="catalogo.php" class="btn" style="display:inline-block; margin-top:1rem; text-decoration:none;">Continuar Comprando</a>
        <?php elseif ($producto): ?>
            <h2>Confirmar Pedido</h2>
            <img src="<?php echo htmlspecialchars($producto['imagen']); ?>" alt="Producto">
            <h3><?php echo htmlspecialchars($producto['nombre']); ?></h3>
            <p style="font-size:1.2rem; color:var(--accent); font-weight:bold;">L <?php echo number_format($producto['precio'], 2); ?></p>
            
            <form action="pedido.php" method="POST">
                <input type="hidden" name="producto_id" value="<?php echo $producto['id']; ?>">
                <div class="form-group">
                    <label for="cliente_nombre">Tu Nombre Completo</label>
                    <input type="text" id="cliente_nombre" name="cliente_nombre" required>
                </div>
                <button type="submit" class="btn">Confirmar y Realizar Pedido</button>
            </form>
        <?php else: ?>
            <p>Producto no encontrado.</p>
        <?php endif; ?>
    </div>
</body>
</html>
