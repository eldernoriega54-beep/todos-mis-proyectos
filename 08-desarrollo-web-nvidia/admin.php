<?php
require_once 'includes/db.php';

// Actualizar estado de pedido
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['actualizar_pedido'])) {
    $pedido_id = (int)$_POST['pedido_id'];
    $nuevo_estado = $conn->real_escape_string($_POST['estado']);
    $conn->query("UPDATE pedidos SET estado = '$nuevo_estado' WHERE id = $pedido_id");
}

// Activar/Desactivar inventario (Stock)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['actualizar_stock'])) {
    $prod_id = (int)$_POST['producto_id'];
    $nuevo_stock = (int)$_POST['stock'];
    $conn->query("UPDATE productos SET stock = $nuevo_stock WHERE id = $prod_id");
}

// Obtener Pedidos
$sql_pedidos = "SELECT p.id, p.cliente_nombre, p.estado, p.fecha_pedido, pr.nombre as producto_nombre, pr.precio_hnl 
                FROM pedidos p JOIN productos pr ON p.producto_id = pr.id ORDER BY p.fecha_pedido DESC";
$res_pedidos = $conn->query($sql_pedidos);

// Obtener Productos para inventario
$sql_prod = "SELECT id, nombre, stock, precio_hnl FROM productos";
$res_prod = $conn->query($sql_prod);

// Calcular Ingresos Totales (Simulación simple)
$ingresos = 0;
$res_ingresos = $conn->query("SELECT SUM(pr.precio_hnl) as total FROM pedidos p JOIN productos pr ON p.producto_id = pr.id WHERE p.estado != 'Recibido'");
if ($row = $res_ingresos->fetch_assoc()) {
    $ingresos = $row['total'] ? $row['total'] : 0;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Trabajador - NVIDIA</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body { background-color: #111; padding: 20px; color: white; }
        .admin-container { max-width: 1200px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: #222; }
        th, td { padding: 12px; border: 1px solid #444; text-align: left; }
        th { background-color: var(--nvidia-green); color: black; }
        .btn { padding: 6px 12px; background: var(--nvidia-green); border: none; color: black; font-weight: bold; cursor: pointer; border-radius: 3px; }
        .header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid var(--nvidia-green); padding-bottom: 10px; }
        .dashboard-cards { display: flex; gap: 20px; margin-bottom: 30px; }
        .card { background: #222; padding: 20px; border-radius: 8px; flex: 1; border-left: 5px solid var(--nvidia-green); }
        .card h3 { margin-bottom: 10px; color: #aaa; }
        .card .value { font-size: 2rem; font-weight: bold; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="admin-container">
        <div class="header-admin">
            <h1><img src="assets/images/logo-white.png" height="30" style="vertical-align: middle;"> Portal Administrativo</h1>
            <a href="index.html" class="btn">Volver a Tienda</a>
        </div>

        <div class="dashboard-cards">
            <div class="card">
                <h3>Ingresos Estimados (Tienda Local)</h3>
                <div class="value">L. <?php echo number_format($ingresos, 2); ?></div>
            </div>
            <div class="card">
                <h3>Pedidos Activos</h3>
                <div class="value"><?php echo $res_pedidos->num_rows; ?></div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 30px; background: white; padding: 20px;">
            <h3 style="color: black; margin-bottom: 20px;">Ingresos Globales NVIDIA (Crecimiento Histórico)</h3>
            <canvas id="ingresosChart" width="400" height="150"></canvas>
        </div>

        <h2>Gestión de Pedidos</h2>
        <table>
            <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Fecha</th>
                <th>Estado Actual</th>
                <th>Acción</th>
            </tr>
            <?php while($p = $res_pedidos->fetch_assoc()): ?>
            <tr>
                <td><?php echo $p['id']; ?></td>
                <td><?php echo $p['cliente_nombre']; ?></td>
                <td><?php echo $p['producto_nombre']; ?></td>
                <td><?php echo $p['fecha_pedido']; ?></td>
                <td>
                    <form method="POST" style="display:inline;">
                        <input type="hidden" name="pedido_id" value="<?php echo $p['id']; ?>">
                        <select name="estado" style="padding:5px;">
                            <?php
                            $estados = ['Recibido', 'En tránsito', 'En país de destino', 'En aduanas', 'En camino a ciudad', 'Entregado'];
                            foreach($estados as $e) {
                                $sel = ($e == $p['estado']) ? "selected" : "";
                                echo "<option value='$e' $sel>$e</option>";
                            }
                            ?>
                        </select>
                        <button type="submit" name="actualizar_pedido" class="btn">Actualizar</button>
                    </form>
                </td>
                <td>L. <?php echo number_format($p['precio_hnl'], 2); ?></td>
            </tr>
            <?php endwhile; ?>
        </table>

        <h2>Inventario (Activar/Desactivar)</h2>
        <table>
            <tr>
                <th>ID Prod</th>
                <th>Nombre</th>
                <th>Stock Actual</th>
                <th>Acción</th>
            </tr>
            <?php while($pr = $res_prod->fetch_assoc()): ?>
            <tr>
                <td><?php echo $pr['id']; ?></td>
                <td><?php echo $pr['nombre']; ?></td>
                <td>
                    <form method="POST">
                        <input type="hidden" name="producto_id" value="<?php echo $pr['id']; ?>">
                        <input type="number" name="stock" value="<?php echo $pr['stock']; ?>" min="0" style="padding:5px; width: 60px;">
                        <button type="submit" name="actualizar_stock" class="btn">Guardar Stock</button>
                    </form>
                </td>
                <td><?php echo ($pr['stock'] > 0) ? "<span style='color:#76b900'>Activo (En catálogo)</span>" : "<span style='color:red'>Agotado (Oculto)</span>"; ?></td>
            </tr>
            <?php endwhile; ?>
        </table>
    </div>
    <script>
        const ctx = document.getElementById('ingresosChart').getContext('2d');
        const ingresosChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Q1 FY23', 'Q2 FY23', 'Q3 FY23', 'Q4 FY23', 'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25'],
                datasets: [{
                    label: 'Ingresos Trimestrales (Miles de Millones USD)',
                    data: [8.29, 6.70, 5.93, 6.05, 7.19, 13.51, 18.12, 22.10, 26.04],
                    borderColor: '#76b900',
                    backgroundColor: 'rgba(118, 185, 0, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>
