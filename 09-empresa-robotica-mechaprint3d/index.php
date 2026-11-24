<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MechaPrint 3D - Innovacion en Impresion 3D</title>
    <style>
        :root {
            --primary: #000000;
            --secondary: #ffffff;
            --accent: #005ce6;
            --text-dark: #333333;
            --text-light: #f5f5f5;
        }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--secondary);
            color: var(--text-dark);
            overflow-x: hidden;
        }
        header {
            background-color: var(--primary);
            color: var(--secondary);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-decoration: none;
            color: var(--secondary);
        }
        nav a {
            color: var(--secondary);
            text-decoration: none;
            margin-left: 2rem;
            font-weight: 500;
            transition: color 0.3s;
        }
        nav a:hover {
            color: var(--accent);
        }
        .hero {
            height: 80vh;
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1620025700813-f43f114cf309?auto=format&fit=crop&q=80&w=2000') center/cover;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: var(--secondary);
        }
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            font-weight: 800;
        }
        .hero p {
            font-size: 1.5rem;
            max-width: 600px;
            margin-bottom: 2rem;
        }
        .btn {
            background-color: var(--accent);
            color: var(--secondary);
            padding: 1rem 2.5rem;
            text-decoration: none;
            border-radius: 30px;
            font-size: 1.2rem;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #0044ab;
        }
        .section {
            padding: 5rem 2rem;
            text-align: center;
        }
        .section h2 {
            font-size: 2.5rem;
            margin-bottom: 3rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .card {
            background: var(--secondary);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            transition: transform 0.3s;
        }
        .card:hover {
            transform: translateY(-10px);
        }
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        footer {
            background-color: var(--primary);
            color: var(--text-light);
            text-align: center;
            padding: 2rem;
            margin-top: auto;
        }
    </style>
</head>
<body>
    <header>
        <a href="index.php" class="logo">MechaPrint 3D</a>
        <nav>
            <a href="index.php">Inicio</a>
            <a href="catalogo.php">Tienda</a>
            <a href="admin.php">Panel Empresarial</a>
        </nav>
    </header>

    <div class="hero">
        <h1>El Futuro Creado Hoy</h1>
        <p>Soluciones avanzadas de impresion 3D para tus proyectos IoT, robotica y aerospaciales.</p>
        <a href="catalogo.php" class="btn">Explorar Catalogo</a>
    </div>

    <div class="section">
        <h2>Nuestros Servicios</h2>
        <div class="grid">
            <div class="card">
                <h3>Carcasas y Soportes</h3>
                <p>Protege tus placas y sensores con estructuras precisas y resistentes disenadas a medida.</p>
            </div>
            <div class="card">
                <h3>Accesorios de Robotica</h3>
                <p>Todo lo que necesitas para ensamblar tus proyectos con calidad industrial.</p>
            </div>
            <div class="card">
                <h3>Modelos Oficiales NASA</h3>
                <p>Imprime la historia espacial con modelos 3D directamente de los archivos de la NASA.</p>
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; 2026 MechaPrint 3D. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
