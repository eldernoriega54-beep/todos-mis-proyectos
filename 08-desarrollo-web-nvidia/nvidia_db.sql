CREATE DATABASE IF NOT EXISTS nvidia_db;
USE nvidia_db;

-- Tabla de Productos (Catálogo)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    serie VARCHAR(50),
    precio_hnl DECIMAL(10, 2) NOT NULL,
    uso VARCHAR(100),
    descripcion TEXT,
    stock INT DEFAULT 1,
    imagen VARCHAR(255)
);

-- Insertar algunos productos realistas
INSERT INTO productos (nombre, serie, precio_hnl, uso, descripcion, stock, imagen) VALUES
('GeForce RTX 4090', 'RTX 40', 48500.00, 'Gaming, IA, Edición 3D', 'La GPU más rápida del mundo para jugadores y creadores.', 5, 'assets/images/rtx4090.png'),
('GeForce RTX 4080', 'RTX 40', 32000.00, 'Gaming, IA', 'Rendimiento ultrarrápido impulsado por la arquitectura Ada Lovelace.', 10, 'assets/images/rtx4080.png'),
('GeForce RTX 3060', 'RTX 30', 8500.00, 'Gaming 1080p', 'Juega a los títulos más recientes con la potencia de Ampere.', 0, 'assets/images/rtx3060.png'),
('GeForce RTX 5090 (Próximamente)', 'RTX 50', 55000.00, 'Entusiasta, IA', 'La próxima generación de rendimiento gráfico.', 0, 'assets/images/rtx5090.png');

-- Tabla de Contactos (Requisito de la profesora)
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pedidos (Para el cliente y el panel de admin)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_correo VARCHAR(100) NOT NULL,
    producto_id INT,
    estado ENUM('Recibido', 'En tránsito', 'En país de destino', 'En aduanas', 'En camino a ciudad', 'Entregado') DEFAULT 'Recibido',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar un pedido de prueba
INSERT INTO pedidos (cliente_nombre, cliente_correo, producto_id, estado) VALUES
('Juan Perez', 'juan@example.com', 1, 'En aduanas');
