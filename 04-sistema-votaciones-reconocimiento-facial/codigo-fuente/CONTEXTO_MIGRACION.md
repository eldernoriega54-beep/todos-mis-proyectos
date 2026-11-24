# Sistema de Votaciones PWA - Reconocimiento Facial (AWS)

Documentación del sistema de votación estudiantil con autenticación biométrica y respaldo de claves.

---

## 1. Contexto General
Este proyecto es una aplicación web progresiva (PWA) desarrollada para gestionar las elecciones estudiantiles del colegio. Permite registrar estudiantes, enrolar sus rostros mediante biometría y asegurar la autenticidad del voto (un voto por estudiante) a través de la nube utilizando **AWS Rekognition**. 

El sistema incluye:
- **Padrón precargado:** Los estudiantes deben existir en la base de datos (con su correo) antes de registrar su rostro, validando la identidad institucional.
- **Login Biométrico y Clave Alterna:** En caso de fallas con la cámara, pueden votar con correo y clave.
- **Panel Administrativo:** Monitor en vivo, gestión de votos, alta de candidatos y vinculación de rostro para nivel "SuperAdmin".

---

## 2. Pila Tecnológica (Tech Stack)
- **Frontend / Diseño:** HTML5 puro, JavaScript Vanilla, CSS Nativo. Las interfaces están construidas con **TailwindCSS** (vía CDN).
- **Notificaciones UI:** **SweetAlert2** (Swal.fire) para todas las ventanas modales de error/éxito. 
- **Gráficos Administrativos:** **Chart.js** para la estadística en tiempo real de participación y conteo.
- **Backend:** **PHP** (Soporta versiones 7.4 y 8.x). Se usa el objeto **PDO** para consultas seguras contra la base de datos MySQL, previniendo inyecciones SQL.
- **Inteligencia Artificial Biométrica:** API Oficial de **Amazon Web Services (AWS Rekognition)**. Se conecta vía servidor (PHP) con el paquete `aws/aws-sdk-php`.
- **Dependencias backend:** Manejadas mediante **Composer**. 

---

## 3. Estructura de Carpetas Principal
- `/api/` - Contiene toda la lógica backend en PHP (`vote.php`, `face_login.php`, `face_register.php`, etc).
  - `/api/config.php` - Conexión PDO a la base de datos.
  - `/api/aws_config.php` - Configuración y acceso a AWS Rekognition.
  - `/api/vendor/` - Carpeta generada por Composer. Contiene el SDK de AWS. **¡Importante no borrar / y difícil de sincronizar!**
- `/js/` - Lógica de cliente en JavaScript para las vistas. 
  - `face-register.js`, `face-login.js`, `admin-panel.js`, etc.
- `/models/` - (De uso antiguo o secundario) Modelos de IA locales si se usaba `face-api.js`.
- `/sw.js` y `manifest_*.json` - Archivos vitales para PWA (hacen la web instalable y guardan caché).
- `/db_setup.php` - Instala las tablas automáticamente en la base de datos la primera vez.

---

## 4. Guía para migrar a otra computadora

### Paso A: Base de datos
Es necesario que la otra PC cuente con un entorno web local (WampServer, XAMPP o Laragon).
1. Crea una base de datos local (por defecto llamada `facial_votaciones`).
2. Ajusta las credenciales de base de datos en `api/config.php` si la contraseña de MySQL (root) de la nueva computadora es diferente.
3. Puedes ejecutar simplemente `http://localhost/chevez/db_setup.php` en el navegador para que cree e inicialice las tablas (`usuarios`, `candidatos`, `administradores`, `votos`).

### Paso B: Instalación del Proyecto
Para evitar problemas copiando y pegando (**esto resuelve tu problema con Google Drive**):
1. **Comprime todo en un .ZIP:** En tu computadora actual, en lugar de arrastrar la carpeta, dale clic derecho a `chevez` -> `"Añadir a archivo..."` y crea un `.zip`.
2. Sube ese archivo `.zip` a Google Drive (esto tomará solo 10 segundos).
3. En la nueva computadora, descárgalo y extráelo dentro del folder `www` (o `htdocs`).
4. Si por alguna razón decides omitir el `vendor`, deberás instalar **Composer** en tu nueva PC, abrir la terminal en `/api/` y correr `composer install`. Esto descargará AWS nuevamente. ¡Es más fácil el ZIP!

---

## 5. Notas Importantes para Devs
- Las contraseñas en PHP se guardan utilizando cifrado `password_hash()` de forma segura.
- Las imágenes del lado del cliente nunca se guardan a disco directamente, se envían en Base64 al PHP y de ahí viajan a AWS Rekognition temporalmente para buscar concordancias de rostros (`indexFaces` o `searchFacesByImage`), el Face ID que AWS devuelve se guarda en `usuarios`.
- El nombre de la base de rostros (Collection Id) en AWS es `alumnos-iehc`.

*Fin del documento.*
