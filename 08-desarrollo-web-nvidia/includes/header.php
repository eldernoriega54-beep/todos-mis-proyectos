<?php if (!isset($hide_video) || !$hide_video): ?>
<!-- Video Background Global -->
<div class="video-bg-global">
    <video id="bg-video" autoplay muted playsinline loop></video>
</div>
<div class="glass-overlay-global"></div>
<?php endif; ?>

<nav class="navbar">
    <div class="logo-nav">
        <a href="index.html"><img src="assets/images/logo-white.png" alt="NVIDIA Logo" height="40"></a>
    </div>
    <ul class="nav-links">
        <li><a href="index.html">Inicio</a></li>
        <li><a href="catalogo.php">Productos</a></li>
        <li class="dropdown">
            <a href="mision.html">Quiénes Somos <i class="fas fa-caret-down"></i></a>
            <ul class="dropdown-content">
                <li><a href="mision.html">Misión</a></li>
                <li><a href="vision.html">Visión</a></li>
                <li><a href="historia.html">Historia</a></li>
                <li><a href="rubro.html">Rubro</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="cambios_logo.html">Rediseño de Marca <i class="fas fa-caret-down"></i></a>
            <ul class="dropdown-content">
                <li><a href="cambios_logo.html">Cambios en el logo</a></li>
                <li><a href="paleta_colores.html">Paleta de Colores</a></li>
                <li><a href="fuentes.html">Fuentes</a></li>
                <li><a href="mockup.html">Mock Up</a></li>
                <li><a href="flayers.html">Flayers</a></li>
            </ul>
        </li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="drivers.html">Drivers</a></li>
        <li><a href="contacto.php">Contacto</a></li>
    </ul>
    <div class="nav-extra">
        <a href="mis_pedidos.php"><i class="fas fa-shopping-cart"></i> Mis Pedidos</a>
    </div>
</nav>