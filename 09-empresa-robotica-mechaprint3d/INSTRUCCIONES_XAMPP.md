# MechaPrint 3D - Proyecto Final de Robótica

## Estructura del Proyecto
- `index.php`: Página informativa principal (estilo Samsung, profesional y limpia).
- `catalogo.php`: Tienda online. Muestra productos, tiene categorías, buscador inteligente, filtros por precio y un rastreador de pedidos.
- `pedido.php`: Página para confirmar una orden y registrarla en la base de datos.
- `admin.php`: Panel de control de la empresa. Permite ver el stock, gestionar inventario, ver pedidos (imagen, cliente, precio, descarga de STL) y actualizar su estado.
- `database.sql`: Estructura de la base de datos (tablas `productos` y `pedidos`).
- `init_db.php`: Script mágico. Al ejecutarlo en el navegador, crea la base de datos y carga todos los productos del `catalogo.json` en SQL automáticamente.
- `generate_catalog.py`: Script en Python que escaneó las carpetas 3D, generó las imágenes y creó el `catalogo.json`.

## Instrucciones para migrar a XAMPP

1. **Mover los archivos:** Copia toda esta carpeta (`empresa de robotica proyecto final`) a la carpeta `htdocs` de XAMPP (por lo general está en `C:\xampp\htdocs\`). Puedes renombrar la carpeta a `mechapro` para que la URL sea más corta.
2. **Iniciar XAMPP:** Abre el Panel de Control de XAMPP y enciende **Apache** y **MySQL**.
3. **Inicializar la Base de Datos:** Abre tu navegador y ve a `http://localhost/mechapro/init_db.php`. Esto creará la base de datos y migrará los productos del JSON a SQL.
4. **Listo:** Ahora puedes navegar a `http://localhost/mechapro/index.php` y utilizar la plataforma completa.

> **Nota sobre el script de Python:** El script de Python ya fue ejecutado en segundo plano y ha escaneado tus carpetas, generado renders y creado el `catalogo.json` (junto con las imágenes en la carpeta `assets/img/catalogo`).

¡Éxitos con tu proyecto de graduación!
