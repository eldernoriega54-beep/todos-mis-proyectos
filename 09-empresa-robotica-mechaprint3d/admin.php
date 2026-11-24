<?php
$host = "localhost"; $user = "root"; $password = ""; $dbname = "mechapro_db";
$conn = new mysqli($host, $user, $password, $dbname);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'update_stock') {
        $id = (int)$_POST['id'];
        $stock = (int)$_POST['stock'];
        $conn->query("UPDATE productos SET stock = $stock WHERE id = $id");
    } else if (isset($_POST['action']) && $_POST['action'] === 'update_estado') {
        $id = (int)$_POST['id'];
        $estado = $conn->real_escape_string($_POST['estado']);
        $conn->query("UPDATE pedidos SET estado = '$estado' WHERE id = $id");
    }
    header("Location: admin.php");
    exit();
}

$productos = [];
$res_prod = $conn->query("SELECT * FROM productos");
if ($res_prod) {
    while($r = $res_prod->fetch_assoc()) $productos[] = $r;
}

$pedidos = [];
$res_ped = $conn->query("SELECT p.*, pr.nombre, pr.imagen, pr.archivo_stl FROM pedidos p JOIN productos pr ON p.producto_id = pr.id ORDER BY p.fecha DESC");
if ($res_ped) {
    while($r = $res_ped->fetch_assoc()) $pedidos[] = $r;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Empresarial - MechaPrint 3D</title>
    <style>
        :root { --primary: #000; --secondary: #fff; --accent: #005ce6; --bg: #f5f5f5; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: var(--bg); }
        header { background: var(--primary); color: var(--secondary); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: var(--secondary); text-decoration: none; margin-left: 2rem; }
        .container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .tabs { display: flex; margin-bottom: 1rem; border-bottom: 2px solid #ddd; }
        .tab { padding: 1rem 2rem; cursor: pointer; font-weight: bold; }
        .tab.active { border-bottom: 2px solid var(--accent); color: var(--accent); }
        .tab-content { display: none; background: var(--secondary); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .tab-content.active { display: block; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f9f9f9; }
        img.thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
        .btn { background: var(--primary); color: var(--secondary); padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #333; }
        input[type="number"], select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
        .file-link { color: var(--accent); text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <a href="index.php" style="color:#fff; text-decoration:none; font-size:1.5rem; font-weight:bold;">MechaPrint 3D - Panel</a>
        <nav><a href="catalogo.php">Ir a Tienda</a></nav>
    </header>

    <div class="container">
        <div class="tabs">
            <div class="tab active" onclick="switchTab('pedidos')">Gestión de Pedidos</div>
            <div class="tab" onclick="switchTab('stock')">Control de Stock</div>
        </div>

        <div id="pedidos" class="tab-content active">
            <h2>Pedidos Recientes</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Archivo STL</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
                <?php foreach ($pedidos as $p): ?>
                <tr>
                    <td>#<?php echo $p['id']; ?></td>
                    <td><img src="<?php echo htmlspecialchars($p['imagen']); ?>" class="thumb"></td>
                    <td><?php echo htmlspecialchars($p['cliente_nombre']); ?></td>
                    <td><?php echo htmlspecialchars($p['nombre']); ?></td>
                    <td>L <?php echo number_format($p['precio'], 2); ?></td>
                    <td><a href="<?php echo htmlspecialchars($p['archivo_stl']); ?>" class="file-link" target="_blank" download>Descargar STL</a></td>
                    <td>
                        <form action="admin.php" method="POST" style="display:flex; gap:10px;">
                            <input type="hidden" name="action" value="update_estado">
                            <input type="hidden" name="id" value="<?php echo $p['id']; ?>">
                            <select name="estado">
                                <option value="Pendiente" <?php if($p['estado']=='Pendiente') echo 'selected'; ?>>Pendiente</option>
                                <option value="Imprimiendo" <?php if($p['estado']=='Imprimiendo') echo 'selected'; ?>>Imprimiendo</option>
                                <option value="Listo para entregar" <?php if($p['estado']=='Listo para entregar') echo 'selected'; ?>>Listo para entregar</option>
                                <option value="Entregado" <?php if($p['estado']=='Entregado') echo 'selected'; ?>>Entregado</option>
                            </select>
                            <button type="submit" class="btn">Actualizar</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>

        <div id="stock" class="tab-content">
            <h2>Control de Inventario</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock Actual</th>
                    <th>Actualizar</th>
                </tr>
                <?php foreach ($productos as $pr): ?>
                <tr>
                    <td><?php echo $pr['id']; ?></td>
                    <td><img src="<?php echo htmlspecialchars($pr['imagen']); ?>" class="thumb"></td>
                    <td><?php echo htmlspecialchars($pr['nombre']); ?></td>
                    <td><?php echo htmlspecialchars($pr['categoria']); ?></td>
                    <td>
                        <form action="admin.php" method="POST" style="display:flex; gap:10px;">
                            <input type="hidden" name="action" value="update_stock">
                            <input type="hidden" name="id" value="<?php echo $pr['id']; ?>">
                            <input type="number" name="stock" value="<?php echo $pr['stock']; ?>" min="0" style="width: 80px;">
                            <button type="submit" class="btn">Guardar</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>

    <script>
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }
    </script>
</body>
</html>
