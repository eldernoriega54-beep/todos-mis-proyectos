<?php
$host = "localhost"; $user = "root"; $password = ""; $dbname = "mechapro_db";
$conn = new mysqli($host, $user, $password, $dbname);

$productos = [];
$tracker_msg = "";

if (isset($_GET['track_id'])) {
    $tid = (int)$_GET['track_id'];
    $res = $conn->query("SELECT p.estado, pr.nombre FROM pedidos p JOIN productos pr ON p.producto_id = pr.id WHERE p.id = $tid");
    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $tracker_msg = "Pedido #$tid ({$row['nombre']}): <strong>{$row['estado']}</strong>";
    } else {
        $tracker_msg = "No se encontro el pedido #$tid";
    }
}

if ($conn->connect_error) {
    if (file_exists('catalogo.json')) {
        $productos = json_decode(file_get_contents('catalogo.json'), true);
    }
} else {
    $sql = "SELECT * FROM productos";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['precio_lempiras'] = $row['precio'];
            $productos[] = $row;
        }
    } else if (file_exists('catalogo.json')) {
        $productos = json_decode(file_get_contents('catalogo.json'), true);
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catalogo - MechaPrint 3D</title>
    <style>
        :root { --primary: #000; --secondary: #fff; --accent: #005ce6; --bg: #f5f5f5; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: var(--bg); }
        header { background: var(--primary); color: var(--secondary); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .main-nav a { color: var(--secondary); text-decoration: none; margin-left: 2rem; font-weight: 500; }
        .logo { font-size: 1.5rem; font-weight: bold; text-decoration: none; color: var(--secondary); }
        
        .cat-nav { background: #333; display: flex; justify-content: center; padding: 0.5rem; gap: 1rem; flex-wrap: wrap; }
        .cat-nav button { background: none; border: 2px solid transparent; color: #ccc; font-size: 1.1rem; cursor: pointer; padding: 0.5rem 1.5rem; border-radius: 30px; transition: 0.3s; font-weight: 600; }
        .cat-nav button.active, .cat-nav button:hover { border-color: var(--accent); color: var(--secondary); background: rgba(0, 92, 230, 0.2); }
        
        .toolbar { background: var(--secondary); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); flex-wrap: wrap; gap: 1rem; }
        .search-bar { display: flex; gap: 10px; align-items: center; }
        .search-bar input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; }
        .tracker { background: #e6f2ff; padding: 0.5rem 1rem; border-radius: 5px; display: flex; gap: 10px; align-items: center; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; padding: 2rem; }
        .card { background: var(--secondary); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
        .card img { width: 100%; height: 200px; object-fit: cover; background: #e0e0e0; }
        .card-body { padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; }
        .card-title { font-size: 1.1rem; font-weight: bold; margin: 0 0 0.5rem 0; }
        .card-price { color: var(--accent); font-weight: bold; font-size: 1.2rem; margin: 0 0 1rem 0; }
        .card-cat { font-size: 0.8rem; color: #666; margin-bottom: 1rem; }
        .btn-order { background: var(--primary); color: var(--secondary); border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer; text-align: center; text-decoration: none; margin-top: auto; }
        .btn-order:hover { background: #333; }
        .btn { background: var(--accent); color: var(--secondary); padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <header>
        <a href="index.php" class="logo">MechaPrint 3D</a>
        <nav class="main-nav">
            <a href="index.php">Inicio</a>
            <a href="catalogo.php">Tienda</a>
            <a href="admin.php">Panel Empresarial</a>
        </nav>
    </header>

    <nav class="cat-nav" id="cat-filters">
        <button class="active" onclick="filterCat('Todos')">Todos los Productos</button>
        <button onclick="filterCat('Carcasas y Soportes')">Soportes y Carcasas</button>
        <button onclick="filterCat('Accesorios')">Accesorios de Robotica</button>
        <button onclick="filterCat('NASA 3D')">Aerodinamica e Historia Espacial</button>
    </nav>

    <div class="toolbar">
        <form class="tracker" action="catalogo.php" method="GET">
            <strong>Rastrear Pedido:</strong>
            <input type="number" name="track_id" placeholder="ID de Pedido" required style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px;">
            <button type="submit" class="btn">Buscar</button>
            <?php if($tracker_msg): ?> <span style="margin-left: 10px; color: var(--accent);"><?php echo $tracker_msg; ?></span> <?php endif; ?>
        </form>

        <div class="search-bar">
            <strong>Filtros:</strong>
            <input type="text" id="searchInput" placeholder="Búsqueda Inteligente..." onkeyup="filterItems()">
            <input type="number" id="minPrice" placeholder="Min L" onkeyup="filterItems()" style="width: 70px;">
            <input type="number" id="maxPrice" placeholder="Max L" onkeyup="filterItems()" style="width: 70px;">
        </div>
    </div>

    <div class="grid" id="productGrid">
        <?php foreach ($productos as $p): ?>
        <div class="card" data-cat="<?php echo htmlspecialchars($p['categoria']); ?>" data-name="<?php echo strtolower(htmlspecialchars($p['nombre'])); ?>" data-price="<?php echo $p['precio_lempiras']; ?>">
            <img src="<?php echo htmlspecialchars($p['imagen']); ?>" alt="Imagen">
            <div class="card-body">
                <p class="card-cat"><?php 
                    if($p['categoria'] == 'NASA 3D') echo 'Aerodinamica e Historia Espacial'; 
                    else echo htmlspecialchars($p['categoria']); 
                ?></p>
                <h3 class="card-title"><?php echo htmlspecialchars($p['nombre']); ?></h3>
                <p class="card-price">L <?php echo number_format($p['precio_lempiras'], 2); ?></p>
                <form action="pedido.php" method="POST">
                    <input type="hidden" name="producto_id" value="<?php echo $p['id']; ?>">
                    <button type="submit" class="btn-order">Ordenar</button>
                </form>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <script>
        let currentCat = 'Todos';
        function filterCat(cat) {
            currentCat = cat;
            document.querySelectorAll('#cat-filters button').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            filterItems();
        }

        function filterItems() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
            const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
            
            document.querySelectorAll('.card').forEach(card => {
                const cat = card.getAttribute('data-cat');
                const name = card.getAttribute('data-name');
                const price = parseFloat(card.getAttribute('data-price'));
                
                let show = true;
                if (currentCat !== 'Todos' && cat !== currentCat) show = false;
                if (search && !name.includes(search)) show = false;
                if (price < minPrice || price > maxPrice) show = false;
                
                if (show) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }
    </script>
</body>
</html>
