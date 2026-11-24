# Portafolio Profesional de Proyectos Técnicos
### **Elder Adrián Noriega Ortiz**
**Bachiller Técnico Profesional en Informática con orientación en Robótica**  
📍 El Progreso, Yoro, Honduras | ✉️ [eldernoriega54@gmail.com](mailto:eldernoriega54@gmail.com) | 📞 +504 9758-0983  
🔗 **Repositorio Oficial:** [github.com/eldernoriega54-beep/todos-mis-proyectos](https://github.com/eldernoriega54-beep/todos-mis-proyectos)

---

## 🌟 Resumen de Perfil & Logros Principales

- **🥈 Subcampeón Nacional en Olimpiadas de Robótica 2026:** Segundo lugar nacional con el desarrollo del *Sistema de Prevención de Accidentes de Tráfico para Motociclistas* (Casco Inteligente con IMU de 10 ejes, GPS Neo-8M, Alerta SOS GSM al 911 y Edge AI).
- **Competidor Nacional en Tres Olimpiadas Consecutivas:** Primer estudiante de su promoción en representar consecutivamente a la institución en 3 certámenes nacionales de robótica.
- **Liderazgo Técnico Institucional:** Dirección de proyectos técnicos multidisciplinarios (automatización de timbres para centros educativos, instalación de redes y videovigilancia, tableros eléctricos y sistemas modulares).
- **Alianza y Marketing Empresarial:** Seleccionado como único estudiante representante para desarrollar el portal y estrategia digital de la empresa de robótica educativa **Cast Innovation**.
- **Investigación en Inteligencia Artificial:** Entrenamiento y diseño de heurística espacial en el borde para el *Sistema TLS (Traductor de Lenguaje de Señas)* mediante detección tridimensional de esqueleto de 21 puntos con MediaPipe Hand Landmarker en colaboración universitaria.

---

## 🌐 Página Web Interactiva del Portafolio

Este repositorio incluye una interfaz web moderna y responsiva lista para ser explorada localmente o desplegada mediante **GitHub Pages**:
- Archivo principal: [`index.html`](index.html)
- Hojas de estilo y diseño: [`style.css`](style.css)
- Controlador interactivo y modales: [`app.js`](app.js)
- Galería visual y capturas: [`assets/thumbnails/`](assets/thumbnails/)

---

## 📁 Estructura del Repositorio

El repositorio se encuentra organizado de forma modular en carpetas independientes, optimizadas para su despliegue y revisión técnica:

```text
todos-mis-proyectos/
│
├── 01-alerta-temprana-inundacion-ATRI/         # PLC Siemens S7-1200 + Arduino + App Android
├── 02-sistema-prevencion-accidentes-casco/     # Firmware de Casco Inteligente (🥈 2do Lugar Nacional)
├── 03-viga-core-app/                           # App Android complementaria para telemetría BLE
├── 04-sistema-votaciones-reconocimiento-facial/# Plataforma electoral con biometría facial AWS
├── 05-traductor-lenguaje-senas-TLS/            # Edge AI con MediaPipe (21 puntos 3D) en Android
├── 06-centro-informacion-vexel-3d/             # Diseñador Web 3D (Three.js/WebGL) + E-Commerce
├── 07-web-cast-innovation/                     # Portal institucional y educativo Cast Innovation
├── 08-desarrollo-web-nvidia/                   # Portal web avanzado Gaming con panel PHP/MySQL
├── 09-empresa-robotica-mechaprint3d/           # Modelo de empresa y catálogo de manufactura 3D
├── 10-impresiones-3d/                          # Archivos de calibración 3MF y código CNC G-Code
├── 11-produccion-audiovisual/                  # Spots y videos de robótica editados en CapCut
│
├── assets/thumbnails/                          # Capturas y recursos gráficos del portafolio
├── index.html                                  # Interfaz web interactiva del portafolio
├── style.css                                   # Estilos modernos y responsivos
├── app.js                                      # Lógica de filtrado y visualización
└── README.md                                   # Documentación técnica completa
```

---

## 🚀 Detalle de Proyectos Destacados

### 1. Sistema de Prevención de Accidentes de Tráfico para Motociclistas (Casco Inteligente)
* **Carpeta:** [`02-sistema-prevencion-accidentes-casco/`](02-sistema-prevencion-accidentes-casco/)
* **Reconocimiento:** 🥈 **Segundo Lugar a Nivel Nacional (Olimpiadas Nacionales 2026)**
* **Tecnologías:** ESP32, Arduino C++, PlatformIO, MPU6050, HMC5883L, MS5611, TinyGPS++, SIM800L, TinyML.
* **Descripción:** Prototipo mecatrónico embebido en el chasis de un casco de protección. Integra una **Unidad de Medición Inercial (IMU) de 10 ejes**, algoritmos dedicados para detección de derrapes violentos (*lowsider*) e impacto, geolocalización satelital con **GPS Neo-8M** y despacho autónomo de mensajes de socorro por **GSM SIM800L** a servicios de emergencia (911) y contactos prioritarios. Cuenta con un modelo local de inferencia TinyML para filtrar vibraciones normales del camino y evitar falsas alarmas.
> *Nota de confidencialidad:* Proyecto institucional protegido; el código expuesto presenta la arquitectura de diseño sin vulnerar llaves de producción ni datos de contacto privados.

---

### 2. VIGA Core App (Telemetría & Emergencia BLE)
* **Carpeta:** [`03-viga-core-app/`](03-viga-core-app/)
* **Tecnologías:** Android Nativo, Kotlin, Java, BLE GATT, Google Maps API.
* **Descripción:** Aplicación móvil complementaria para el casco de seguridad. Establece un enlace de baja potencia vía **Bluetooth Low Energy (BLE)** con el microcontrolador del casco para monitorear en tiempo real el porcentaje y estado de salud de la batería, velocidad actual y máxima registrada, y sincronizar datos médicos cruciales (tipo de sangre, alergias) para los cuerpos de rescate.

---

### 3. Sistema ATRI (Alerta Temprana de Riesgo Inminente ante Inundaciones)
* **Carpeta:** [`01-alerta-temprana-inundacion-ATRI/`](01-alerta-temprana-inundacion-ATRI/)
* **Tecnologías:** PLC Siemens SIMATIC S7-1214C DC/DC/DC, TIA Portal V18 (SCL), Arduino C++, Python Sockets TCP, Android Kotlin.
* **Descripción:** Solución de automatización industrial y monitoreo preventivo diseñado ante las crecidas del Río Ulúa. Un microcontrolador Arduino con relés activos en baja transmite los estados hidrométricos (verde, amarillo, rojo) a las entradas digitales del PLC Siemens S7-1200 (`%I0.1` a `%I0.3`). El PLC activa la señalización industrial correspondiente (`%Q0.1` a `%Q0.3`) y se comunica mediante protocolo TCP con un servidor puente en Python que retransmite las alertas a la aplicación móvil con alarmas sonoras perentorias.

---

### 4. Sistema TLS (Traductor de Lenguaje de Señas en Tiempo Real)
* **Carpeta:** [`05-traductor-lenguaje-senas-TLS/`](05-traductor-lenguaje-senas-TLS/)
* **Tecnologías:** Google AI Edge, MediaPipe Hand Landmarker, TensorFlow Lite (`.task` cuantizado en float16), Android Kotlin, TextToSpeech.
* **Descripción:** Aplicación de visión por computadora móvil de ejecución 100% offline (Edge Computing) desarrollada en colaboración con investigadores universitarios. Elder entrenó y programó la arquitectura que extrae **21 puntos clave (landmarks) tridimensionales** de la mano a más de 30 FPS. Implementa un desacoplamiento entre visión artificial y lingüística mediante codificación vectorial de 5 estados binarios de flexión digital `[Pulgar, Índice, Medio, Anular, Meñique]` consultando diccionarios dinámicos en formato JSON. Incluye módulo de calibración interactiva Onboarding con siluetas SVG de vocales.

---

### 5. Sistema Oficial de Votaciones con Reconocimiento Facial (CEMG Eduardo Hernández Chevez)
* **Carpeta:** [`04-sistema-votaciones-reconocimiento-facial/`](04-sistema-votaciones-reconocimiento-facial/)
* **Tecnologías:** PHP 8, Node.js, AWS Rekognition API, MySQL, JavaScript ES6, PWA.
* **Descripción:** Plataforma electoral implementada en 2026 para las elecciones estudiantiles del colegio. Utiliza biometría facial por visión artificial para la identificación de votantes, garantizando la inviolabilidad del sufragio e impidiendo la suplantación de identidad y el voto múltiple. Incluye panel de control para autoridades educativas con censo digital, gestión de postulaciones y escrutinio en tiempo real.

---

### 6. Centro de Información y Diseñador 3D Vexcel
* **Carpeta:** [`06-centro-informacion-vexel-3d/`](06-centro-informacion-vexel-3d/)
* **Tecnologías:** Three.js, WebGL, HTML5, CSS3, Node.js Express.
* **Descripción:** Plataforma web con visor tridimensional interactivo para el diseño de indumentaria textil (camisetas y pantalones). Permite rotar modelos en 3D, aplicar colores y estampar gráficos mediante una biblioteca integrada de más de 7,000 elementos vectoriales y 350 fuentes tipográficas de alta calidad.

---

### 7. Portal Web & Marketing Cast Innovation
* **Carpeta:** [`07-web-cast-innovation/`](07-web-cast-innovation/)
* **Tecnologías:** HTML5 Semántico, CSS3 Moderno, JavaScript, Multimedia.
* **Referencia:** Edgardo Caballero, CEO de Cast Innovation.
* **Descripción:** Sitio corporativo y formativo desarrollado en calidad de único estudiante representante del colegio para apoyar la presencia digital de Cast Innovation. Presenta kits robóticos de aprendizaje (LEGO Spike Essential, Bee-Bot, Pro-Bot), recursos de programación y plan estratégico corporativo.

---

### 8. Desarrollo Web Nvidia (Hardware & Gaming)
* **Carpeta:** [`08-desarrollo-web-nvidia/`](08-desarrollo-web-nvidia/)
* **Tecnologías:** PHP, MySQL, JavaScript, CSS3 Keyframes, Adobe Illustrator.
* **Descripción:** Portal temático de comercio electrónico y componentes de alto rendimiento inspirado en la estética visual de Nvidia. Incorpora catálogo dinámico de productos, panel administrativo PHP con base de datos relacional para pedidos, desarrollo completo de identidad de marca (Brandboard, mockups y flyers) y tipografía personalizada Orbitron.

---

### 9. Empresa de Robótica MechaPrint 3D
* **Carpeta:** [`09-empresa-robotica-mechaprint3d/`](09-empresa-robotica-mechaprint3d/)
* **Tecnologías:** PHP, MySQL, Python, Manufactura Aditiva FDM, Gestión Administrativa.
* **Descripción:** Proyecto integral de empresa técnica dedicada a la fabricación digital de carcasas, soportes y accesorios robóticos (soportes Flipper Zero, organizadores mecánicos, monturas de sensores). Integra catálogo digital automatizado mediante scripts en Python, portal de pedidos en PHP y un **Plan Estratégico y Administrativo formal en PDF**.

---

### 10. Impresiones 3D & Slicing CNC
* **Carpeta:** [`10-impresiones-3d/`](10-impresiones-3d/)
* **Tecnologías:** Bambu Studio, PrusaSlicer, Código G (G-Code), Modelos 3MF, PLA.
* **Descripción:** Colección de archivos de producción aditiva calibrados para máquinas CNC y manufactura FDM. Incluye el modelo arquitectónico de alta fidelidad *Bridgestone Arena*, figuras mecánicas *Smooth Gaaris* con placas optimizadas para tiempos reducidos de producción (31 min) y perfiles térmicos precisos para filamento PLA.

---

### 11. Producción Audiovisual & Marketing Digital
* **Carpeta:** [`11-produccion-audiovisual/`](11-produccion-audiovisual/)
* **Tecnologías:** CapCut Pro, FFmpeg (Codecs H.264 / AAC), Motion Graphics.
* **Descripción:** Material audiovisual promocional, informativo y técnico editado para presentaciones institucionales y torneos de robótica. Incluye spots para campañas de votación estudiantil, videos de casos de éxito y el reportaje de la carrera técnica de robótica, optimizados para reproducción fluida sin pérdida de fidelidad visual.

---

## 🛠️ Competencias Técnicas Principales

| Área | Competencias y Herramientas |
| :--- | :--- |
| **Control y Automatización** | PLC Siemens S7-1200 (SCL / Ladder), Arduino, microcontroladores ESP32, controladores lógicos CNC, sistemas modulares e industriales. |
| **Programación & Backend** | Python, C++, Java, Kotlin, PHP 8, Node.js, SQL (MySQL). |
| **Frontend & Web 3D** | HTML5, CSS3 moderno, JavaScript (ES6+), Three.js, WebGL, Progressive Web Apps (PWA). |
| **Inteligencia & Visión Artificial** | Google AI Edge, MediaPipe Hand Landmarker, TensorFlow Lite, Edge Computing, biometría facial (AWS Rekognition). |
| **Fabricación Digital & 3D** | Operación de maquinaria CNC, Impresión 3D FDM, preparación de perfiles en slicers (3MF, STL, G-Code). |
| **Diseño & Producción Multimedia** | Adobe Illustrator, edición y montaje audiovisual en CapCut, compresión avanzada con FFmpeg. |

---

## 📬 Contacto y Disponibilidad

Disponibilidad para incorporarse a oportunidades de práctica profesional, proyectos de ingeniería, desarrollo de software y manufactura robótica.

- **Nombre:** Elder Adrián Noriega Ortiz
- **Correo Electrónico:** [eldernoriega54@gmail.com](mailto:eldernoriega54@gmail.com)
- **Teléfono:** +504 9758-0983
- **Ubicación:** El Progreso, Yoro, Honduras
- **Repositorio:** [https://github.com/eldernoriega54-beep/todos-mis-proyectos](https://github.com/eldernoriega54-beep/todos-mis-proyectos)
