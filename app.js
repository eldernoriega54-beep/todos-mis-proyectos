// Iconos SVG reutilizables (sin ningún emoji)
const ICONS = {
  award: `<svg class="icon-inline" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  lock: `<svg class="icon-inline" width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  warning: `<svg class="icon-inline" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  folder: `<svg class="icon-inline" width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>`,
  info: `<svg class="icon-inline" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  video: `<svg class="icon-inline" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
  external: `<svg class="icon-inline" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`
};

const projects = [
  {
    id: "casco-seguridad",
    category: "robotica",
    folder: "02-sistema-prevencion-accidentes-casco",
    title: "Sistema de Prevención de Accidentes de Tráfico",
    badge: "Máxima Seguridad - 2do Lugar Nacional",
    isAward: true,
    isConfidential: true,
    confidentialNotice: "Proyecto de máxima seguridad y confidencialidad institucional (Campeón / Subcampeón Nacional). Por motivos de protección intelectual y seguridad del colegio, el repositorio no incluye acceso completo a los códigos de producción ni parámetros sensibles; se presenta la arquitectura técnica validada.",
    thumbnail: "assets/thumbnails/viga_logo.png",
    shortDesc: "Prototipo embebido en chasis de casco con IMU 10-DOF, GPS Neo-8M, alerta por SMS al 911 con SIM800L ante caídas o lowsider, y modelo Edge AI.",
    tags: ["ESP32", "Arduino C++", "IMU 10-DOF", "GPS Neo-8M", "SIM800L", "Edge AI", "BLE"],
    details: {
      subtitle: "Hardware de Máxima Seguridad para Motociclistas & Conducción Inteligente",
      context: "Galardonado con el Segundo Lugar a Nivel Nacional en las Olimpiadas de Robótica 2026. Proyecto institucional de alta confidencialidad y rigor técnico.",
      architecture: [
        "Unidad de Medición Inercial (IMU) de 10 ejes combinando MPU6050 (giróscopo/acelerómetro), HMC5883L (magnetómetro) y MS5611 (barómetro/altitud).",
        "Algoritmos de detección especializada para derrapes violentos (Lowsider) y lectura de anomalías en el asfalto (baches/choques).",
        "Microcontrolador ESP32 ejecutando inferencia TinyML local (ia_esp32_inference.ino) para clasificar patrones de impacto sin falsos positivos.",
        "Módulo GSM SIM800L configurado para despacho inmediato de SMS de emergencia con coordenadas satelitales obtenidas en tiempo real por el GPS TinyGPS++.",
        "Canal de telemetría y transmisión médica por Bluetooth Low Energy (BLE) hacia la aplicación móvil VIGA Core."
      ],
      hardware: "ESP32 Dev Module, IMU 10-DOF, TinyGPS Neo-8M, GSM SIM800L, Batería LiPo con telemetría ADC.",
      software: "C++ Embebido, PlatformIO, TinyML C++ header inference, FreeRTOS."
    }
  },
  {
    id: "viga-app",
    category: "ia-soft",
    folder: "03-viga-core-app",
    title: "VIGA Core App (Telemetría & Emergencia)",
    badge: "Confidencial - App Móvil Android",
    isAward: false,
    isConfidential: true,
    confidentialNotice: "Aplicación móvil asociada directamente al sistema de seguridad de motociclistas. El acceso a los protocolos internos de cifrado y bases de datos médicas está restringido por confidencialidad institucional.",
    thumbnail: "assets/thumbnails/viga_map.jpg",
    shortDesc: "Aplicación complementaria para el casco de seguridad. Enlaza vía Bluetooth Low Energy (BLE) para telemetría, estado de batería, velocidad y auxilio médico.",
    tags: ["Android", "Kotlin", "Java", "BLE GATT", "Google Maps", "Telemetría"],
    details: {
      subtitle: "Panel Móvil de Monitoreo en Tiempo Real y Asistencia Médica",
      context: "Aplicación complementaria directa del Sistema de Prevención de Accidentes. Diseñada para operar sin distraer al conductor y proveer socorro inmediato.",
      architecture: [
        "Comunicación BLE bidireccional mediante servicios GATT personalizados para telemetría y perfiles médicos.",
        "Monitoreo continuo de salud de batería de la celda de alimentación del casco y registro de velocidad máxima y actual.",
        "Almacenamiento seguro no volátil de contactos prioritarios de emergencia y tipo de sangre / alergias del piloto.",
        "Integración de mapa con ubicación satelital continua para trazado de ruta y asistencia en caso de incidente."
      ],
      hardware: "Dispositivos Android 8.0+",
      software: "Android SDK, Kotlin/Java, Jetpack Compose / Material UI, BluetoothGatt."
    }
  },
  {
    id: "sistema-atri",
    category: "robotica",
    folder: "01-alerta-temprana-inundacion-ATRI",
    title: "Sistema ATRI (Alerta de Inundación)",
    badge: "PLC Siemens S7-1200 + IoT",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/atri_logo.png",
    shortDesc: "Sistema de control y alerta temprana ante riesgo inminente de inundación referenciado al Río Ulúa. Integra PLC Siemens S7-1214C, Arduino, servidor TCP en Python y App móvil.",
    tags: ["Siemens S7-1200", "TIA Portal V18", "SCL", "Arduino", "Python TCP", "Android"],
    details: {
      subtitle: "Automatización Industrial y Telemetría Comunitaria ante Desastres Naturales",
      context: "Presentado en Olimpiadas Nacionales como una solución de ingeniería robusta para comunidades vulnerables ante crecidas del Río Ulúa.",
      architecture: [
        "Controlador Lógico Programable (PLC) Siemens S7-1214C DC/DC/DC programado en lenguaje estructurado SCL.",
        "Mapeo de entradas de nivel por relés activos en baja (%I0.1 verde, %I0.2 amarillo, %I0.3 rojo) y salidas a lámparas de señalización industrial (%Q0.1 a %Q0.3).",
        "Servidor puente en Python (servidor_puente_atri.py) con socket TCP comunicándose bidireccionalmente con el PLC y reenviando telemetría a la red móvil.",
        "Aplicación Android con panel de estado en vivo y alarmas sonoras automáticas por nivel de alerta (verde/amarillo/rojo)."
      ],
      hardware: "Siemens SIMATIC S7-1214C DC/DC/DC, Arduino UNO / Nano, Relés industriales, Sensores de nivel hidrométrico.",
      software: "Siemens TIA Portal V18 (SCL), Python 3 Sockets, Android Studio (Kotlin)."
    }
  },
  {
    id: "sistema-tls",
    category: "ia-soft",
    folder: "05-traductor-lenguaje-senas-TLS",
    title: "Sistema TLS (Traductor de Lenguaje de Señas)",
    badge: "Investigación Confidencial - Edge AI",
    isAward: false,
    isConfidential: true,
    confidentialNotice: "Proyecto de investigación en activa colaboración con investigadores universitarios (Elder entrenó la IA de esqueleto). Por acuerdos académicos de confidencialidad, el acceso al dataset privado de entrenamiento y diccionarios lingüísticos completos no está abierto al público; se exhibe la arquitectura y la inferencia móvil de 21 landmarks 3D.",
    thumbnail: "assets/thumbnails/tls_skeleton.png",
    shortDesc: "Traductor de señas a texto y voz en tiempo real con ejecución 100% offline. Utiliza MediaPipe Hand Landmarker para 21 puntos 3D y heurística vectorial sin depender de nube.",
    tags: ["MediaPipe", "TensorFlow Lite", "Android Kotlin", "Edge AI", "Computer Vision"],
    details: {
      subtitle: "Visión Artificial en el Borde & Heurística Espacial Tridimensional",
      context: "Desarrollado en colaboración con investigadores universitarios. Elder entrenó y programó la arquitectura de extracción de esqueleto, lógicas de flexión digital y motor de traducción.",
      architecture: [
        "Inferencia Edge con MediaPipe Hand Landmarker (hand_landmarker.task cuantizado en float16) a más de 30 FPS.",
        "Tracking tridimensional continuo de 21 coordenadas espaciales (x, y, z) de la mano desde la cámara móvil.",
        "Desacoplamiento total entre visión artificial e idioma: algoritmo de flexión que codifica un vector de 5 dígitos [Pulgar, Índice, Medio, Anular, Meñique].",
        "Diccionario lingüístico modular descargable en JSON (gesture_map.json y word_lexicon.json) ampliable sin recompilar el APK.",
        "Modos duales: Modo móvil una mano con síntesis de voz TextToSpeech y auto-espaciado, y Modo manos libres para videoconferencias.",
        "Calibración Onboarding interactiva con guías SVG de las vocales (A, E, I, O, U) adaptables a la mano del usuario."
      ],
      hardware: "Dispositivos móviles Android con cámara estándar (sin sensores externos).",
      software: "Kotlin, Google AI Edge / MediaPipe, TensorFlow Lite, Android Jetpack, TextToSpeech."
    }
  },
  {
    id: "portal-carrera-robotica",
    category: "web",
    folder: "12-portal-carrera-robotica",
    title: "Portal Oficial Carrera Técnica de Robótica",
    badge: "Portal Institucional & Node.js",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/carrera_robotica.jpg",
    shortDesc: "Plataforma web oficial para la divulgación de la Carrera Técnica en Informática con orientación en Robótica del CEMG Eduardo Hernández Chevez. Plan de estudios, logros y videos de proyectos.",
    tags: ["Node.js", "Express", "SQLite", "HTML5/CSS3", "Robótica Educativa"],
    details: {
      subtitle: "Plataforma de Divulgación de la Oferta Académica y Proyectos Técnicos",
      context: "Portal oficial del colegio diseñado para dar a conocer los laboratorios de mecatrónica, el plan de estudios por áreas formativas y las delegaciones de competencias.",
      architecture: [
        "Estructura modular con Express y vistas dinámicas para plan de estudios, contacto, objetivos y galería de logros.",
        "Base de datos SQLite integrada para registro de consultas y estudiantes interesados.",
        "Galería multimedia con respaldo de videos de fondo y coberturas de olimpiadas nacionales.",
        "Diseño institucional responsivo adaptado a dispositivos móviles y pantallas de presentación."
      ],
      hardware: "Servidor local / Web Hosting.",
      software: "Node.js, Express, SQLite3, HTML5, CSS3, JavaScript."
    }
  },
  {
    id: "chevez-votaciones",
    category: "web",
    folder: "04-sistema-votaciones-reconocimiento-facial",
    title: "Sistema de Votaciones Biométricas 2026",
    badge: "Visión Facial & PHP/Node",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/chevez_votar.png",
    shortDesc: "Sistema oficial de elecciones estudiantiles del CEMG Eduardo Hernández Chevez. Incorpora reconocimiento facial por visión artificial para prevenir suplantaciones y doble voto.",
    tags: ["Visión Artificial", "AWS Rekognition", "PHP", "Node.js", "MySQL", "PWA"],
    details: {
      subtitle: "Plataforma Oficial de Sufragio Estudiantil Seguro",
      context: "Creado e implementado exitosamente en el colegio durante las elecciones de 2026. Gestionó el censo electoral con verificación biométrica facial.",
      architecture: [
        "Módulo de autenticación facial biométrica (face_login.php y face_register.php) respaldado por colecciones seguras de descriptores vectoriales.",
        "Control estricto de unicidad de sufragio (check_voter.php, check_ya_voto.js) que imposibilita la duplicidad de votación.",
        "Panel de administración completo (admin.html) con gráficos de resultados en tiempo real, gestión de candidatos y auditoría de actas.",
        "Compatibilidad híbrida (Node.js backend para eventos en tiempo real y PHP/MySQL para persistencia institucional)."
      ],
      hardware: "Servidor local / Web Hosting, Cámaras web y laptops electorales.",
      software: "Node.js, PHP 8, MySQL, AWS Rekognition API, JavaScript ES6, CSS PWA."
    }
  },
  {
    id: "vexel-3d",
    category: "web",
    folder: "06-centro-informacion-vexel-3d",
    title: "Centro de Información & Diseñador Vexcel 3D",
    badge: "WebGL / Three.js 3D",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/smooth_gaaris.png",
    shortDesc: "Plataforma web con motor 3D interactivo para diseño de prendas en tiempo real. Incluye biblioteca de más de 7,000 elementos gráficos y tipografías premium.",
    tags: ["Three.js", "WebGL", "JavaScript", "HTML5/CSS3", "Node.js"],
    details: {
      subtitle: "Personalización 3D Interactiva & Centro de Información",
      context: "Plataforma integral orientada a la industria textil personalizada y presentación de identidad de marca.",
      architecture: [
        "Visor 3D en WebGL impulsado por Three.js para renderizado de modelos de prendas (camisetas y pantalones) con rotación y texturizado dinámico.",
        "Módulo de composición gráfica con más de 7,000 elementos vectoriales y más de 350 tipografías premium.",
        "Páginas institucionales completas: Misión, Visión, Valores, Plan Estratégico y Catálogo interactivo.",
        "Servidor Node.js ligero para gestión de sesiones de usuario y persistencia de diseños."
      ],
      hardware: "Navegadores modernos con soporte WebGL.",
      software: "JavaScript ES6, Three.js, CSS3 Avanzado, Node.js, Express."
    }
  },
  {
    id: "cast-innovation",
    category: "web",
    folder: "07-web-cast-innovation",
    title: "Portal Web & Marketing Cast Innovation",
    badge: "Alianza Empresarial",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/cast_innovation.png",
    shortDesc: "Desarrollo del portal institucional y apoyo de marketing digital para Cast Innovation. Presentación de robots educativos Spike Essential, Bee-Bot y contenidos de programación.",
    tags: ["HTML5", "CSS3", "JavaScript", "Marketing Digital", "Robótica Educativa"],
    details: {
      subtitle: "Presencia Digital y Divulgación de Tecnología Educativa",
      context: "Seleccionado como el único estudiante representante del colegio para colaborar directamente con el Ing. Edgardo Caballero, CEO de Cast Innovation.",
      architecture: [
        "Diseño de interfaz intuitiva y adaptativa para divulgación de kits robóticos educativos (LEGO Spike, Bee-Bot, Pro-Bot).",
        "Sección interactiva de aprendizaje de programación y conexiones para estudiantes y docentes.",
        "Estructura corporativa formal: Misión, Visión, Plan Estratégico y Catálogo de modelos.",
        "Optimización de recursos multimedia con videos demostrativos y fotografías de alta resolución."
      ],
      hardware: "Servidor Web, dispositivos de escritorio y móviles.",
      software: "HTML5 Semántico, CSS3 Flexbox/Grid, JavaScript."
    }
  },
  {
    id: "nvidia-web",
    category: "web",
    folder: "08-desarrollo-web-nvidia",
    title: "Desarrollo Web Nvidia (Gaming & Hardware)",
    badge: "E-Commerce & Branding",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/nvidia_mockup.png",
    shortDesc: "Portal temático de hardware y gaming con estética corporativa Nvidia. Catálogo interactivo, animaciones dinámicas, panel administrativo PHP/MySQL y diseño de marca.",
    tags: ["PHP", "MySQL", "JavaScript", "Animaciones CSS", "Illustrator"],
    details: {
      subtitle: "Portal Web Avanzado con Gestión de Pedidos y Brandboard",
      context: "Proyecto de desarrollo web enfocado en diseño UI/UX de alto impacto visual y arquitectura modular.",
      architecture: [
        "Catálogo dinámico de tarjetas gráficas y componentes con panel administrativo PHP (admin.php) y gestión de pedidos (mis_pedidos.php).",
        "Desarrollo de identidad gráfica completa: Brandboard, mockups digitales, paleta de colores corporativa y tipografía Orbitron.",
        "Efectos visuales modernos con canvas, animaciones de fondo y banners publicitarios (flyers).",
        "Base de datos relacional MySQL (nvidia_db.sql) para persistencia de catálogo y transacciones."
      ],
      hardware: "Servidor Apache / XAMPP, MySQL.",
      software: "PHP 8, MySQL, CSS3 Keyframes, JavaScript, Adobe Illustrator."
    }
  },
  {
    id: "mechaprint-3d",
    category: "robotica",
    folder: "09-empresa-robotica-mechaprint3d",
    title: "Empresa de Robótica MechaPrint 3D",
    badge: "Proyecto de Empresa & 3D",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/bridgestone_arena.png",
    shortDesc: "Emprendimiento integral de manufactura aditiva y robótica. Plataforma web de pedidos, catálogo de accesorios 3D (Flipper Zero, stands) y plan estratégico empresarial en PDF.",
    tags: ["Manufactura 3D", "PHP", "MySQL", "Python", "Plan de Negocios"],
    details: {
      subtitle: "Modelo de Negocio Tecnológico & Producción CNC/FDM",
      context: "Proyecto final que combina habilidades técnicas de manufactura aditiva con gestión estratégica y financiera de una empresa de tecnología.",
      architecture: [
        "Plan Estratégico y Administrativo formal documentado en PDF con análisis de mercado, costos de filamento y proyecciones de retorno.",
        "Catálogo automatizado con script en Python (generate_catalog.py) que indexa modelos 3D y especificaciones técnicas.",
        "Plataforma web con sistema de cotizaciones y pedidos en tiempo real (pedido.php) con base de datos SQL.",
        "Repositorio calibrado de carcasas, soportes mecánicos y accesorios listos para impresión en PLA/PETG."
      ],
      hardware: "Impresoras 3D FDM, Servidor local.",
      software: "PHP, MySQL, Python, Slicers 3MF/G-Code."
    }
  },
  {
    id: "impresiones-3d",
    category: "fabricacion",
    folder: "10-impresiones-3d",
    title: "Manufactura Aditiva & Slicing 3D",
    badge: "Modelado & CNC",
    isAward: false,
    isConfidential: false,
    thumbnail: "assets/thumbnails/smooth_gaaris.png",
    shortDesc: "Archivos de producción 3D calibrados (.3mf y G-Code) para piezas complejas: modelo arquitectónico Bridgestone Arena, piezas mecánicas Smooth Gaaris y optimización de tiempos.",
    tags: ["Impresión 3D", "G-Code", "3MF Slicer", "PLA", "CNC"],
    details: {
      subtitle: "Calibración, Slicing y Optimización de Código Máquina",
      context: "Experiencia directa en preparación de archivos para impresoras 3D y maquinaria de manufactura avanzada.",
      architecture: [
        "Bridgestone Arena.3mf: Modelo arquitectónico de alta resolución con optimización de soportes y capas finas.",
        "Smooth Gaaris_PLA_31m57s.gcode.3mf: Perfil de impresión ultra-optimizado para producción rápida en 31 minutos.",
        "1804_PLA_3h47m.gcode: Código G listo para máquina con perfiles térmicos y retracciones calibradas para filamento PLA.",
        "Previsualizaciones y placas multicapa generadas en slicers de última generación."
      ],
      hardware: "Impresoras 3D FDM, Controladores CNC.",
      software: "Bambu Studio, PrusaSlicer, G-Code Analyzer."
    }
  },
  {
    id: "produccion-audiovisual",
    category: "marketing",
    folder: "11-produccion-audiovisual",
    title: "Marketing & Animaciones Propias",
    badge: "Videos & Galería Reproducible",
    isAward: false,
    isConfidential: false,
    isSpecialVideoCard: true,
    thumbnail: "assets/thumbnails/cast_innovation.png",
    shortDesc: "Galería completa de 7 videos y animaciones editadas en CapCut: reportajes de robótica, spots de votaciones biométricas, casos de éxito y animaciones listas para ver aquí.",
    tags: ["CapCut", "Edición de Video", "Animación Propia", "Marketing Digital", "H.264"],
    details: {
      subtitle: "Producción Audiovisual, Comunicación Técnica y Animaciones Propias",
      context: "Colección audiovisual completa para promoción institucional y proyectos de tecnología.",
      architecture: [
        "Visualiza y reproduce directamente todos los videos desde la pestaña dedicada de Marketing.",
        "Videos comprimidos y optimizados en H.264 para carga instantánea en navegador.",
        "Incluye reportaje de robótica, spots de votaciones biométricas, casos de éxito y TES."
      ],
      hardware: "Navegador web (reproducción HTML5 directa).",
      software: "CapCut, FFmpeg, H.264 Codec."
    }
  }
];

// Lista de videos disponibles para reproducir directamente en la página
const videoShowcaseList = [
  {
    title: "Marketing Empresarial Cast Innovation",
    file: "11-produccion-audiovisual/0530.mp4",
    badge: "Marketing Empresarial",
    desc: "Video de marketing producido para Cast Innovation, empresa de robótica e innovación educativa. Elder Noriega fue el único representante estudiantil en colaborar con esta empresa, encargándose íntegramente de la producción audiovisual y estrategia de difusión.",
    tags: ["Marketing", "Cast Innovation", "Robótica Educativa", "CapCut", "Producción Propia"]
  },
  {
    title: "Video de la Carrera de Robótica (Original)",
    file: "11-produccion-audiovisual/video de la carrera de robotica original (1).mp4",
    badge: "Reportaje & Torneos",
    desc: "Recorrido audiovisual completo por los proyectos, prototipos, laboratorios y trayectoria en las Olimpiadas Nacionales de Robótica.",
    tags: ["Robótica", "Competencias", "Trayectoria"]
  },
  {
    title: "Casos de Éxito en Proyectos Técnicos",
    file: "11-produccion-audiovisual/video de los casos de exito.mp4",
    badge: "Casos de Éxito",
    desc: "Presentación formal de soluciones reales implementadas con impacto en instituciones educativas y la comunidad.",
    tags: ["Impacto Real", "Automatización", "Liderazgo"]
  },
  {
    title: "Promoción y Explicación Técnica de Proyectos",
    file: "11-produccion-audiovisual/promocion y explicacion.mp4",
    badge: "Explicación Técnica",
    desc: "Demostración guiada con explicación detallada del funcionamiento técnico de los prototipos desarrollados.",
    tags: ["Demostración", "Ingeniería", "Electrónica"]
  },
  {
    title: "Promoción de Votaciones Biométricas 1",
    file: "11-produccion-audiovisual/promocion de votaciones 1.mp4",
    badge: "Campaña Oficial 2026",
    desc: "Spot publicitario oficial para la concienciación y orientación estudiantil en el uso del sistema electoral con biometría facial.",
    tags: ["Marketing Institucional", "Biometría", "Spot"]
  },
  {
    title: "Promoción de Votaciones Biométricas 2",
    file: "11-produccion-audiovisual/promocion votaciones 2.mp4",
    badge: "Spot Electoral",
    desc: "Segunda entrega audiovisual para la difusión masiva del sufragio seguro y transparente en el colegio.",
    tags: ["Animación", "Campaña", "PWA"]
  },
  {
    title: "Resultados de Trabajo Educativo Social (TES)",
    file: "11-produccion-audiovisual/video de resultados de tes.mp4",
    badge: "Resultados TES",
    desc: "Informe audiovisual condensado con métricas, evidencias y logros alcanzados durante el Trabajo Educativo Social.",
    tags: ["Comunidad", "Educación", "Evidencias"]
  },
  {
    title: "Producción Audiovisual Final Ebenezer",
    file: "11-produccion-audiovisual/video final evenezer.mp4",
    badge: "Producción & Montaje",
    desc: "Montaje audiovisual conmemorativo con animaciones, transiciones y sincronización musical para evento de cierre.",
    tags: ["Montaje", "Edición Dinámica", "CapCut"]
  }
];

const container = document.getElementById("projectsContainer");
const videoSection = document.getElementById("videoShowcaseSection");
const videosContainer = document.getElementById("videosContainer");

function renderProjects(filter = "all") {
  if (filter === "marketing") {
    container.style.display = "none";
    videoSection.style.display = "block";
    renderVideoShowcase();
    return;
  } else {
    container.style.display = "grid";
    videoSection.style.display = "none";
  }

  container.innerHTML = "";
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "project-card";

    // Si es la tarjeta de marketing vista desde "all", su botón lleva directamente a ver los videos
    const actionBtn = p.isSpecialVideoCard
      ? `<button class="btn btn-primary" onclick="switchToMarketing()">
           ${ICONS.video}
           Ver y Reproducir Videos Aquí
         </button>`
      : `<button class="btn btn-primary" onclick="openModal('${p.id}')">
           ${ICONS.info}
           Ver Detalles y Arquitectura
         </button>`;

    // Advertencia en la tarjeta si es confidencial
    const securityBox = p.isConfidential
      ? `<div class="card-security-alert">
           ${ICONS.lock}
           <div><strong>Confidencial:</strong> Acceso restringido por seguridad institucional / investigación.</div>
         </div>`
      : "";

    // Badge con clase según sea premio o confidencial
    let badgeClass = "card-badge";
    let badgeIcon = "";
    if (p.isConfidential) {
      badgeClass += " security-badge";
      badgeIcon = ICONS.lock;
    } else if (p.isAward) {
      badgeClass += " award-badge";
      badgeIcon = ICONS.award;
    }

    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy" onerror="this.src='assets/thumbnails/viga_logo.png'">
        <span class="${badgeClass}">
          ${badgeIcon}
          ${p.badge}
        </span>
      </div>
      <div class="card-body">
        <div class="card-folder">${ICONS.folder} ${p.folder}</div>
        <h3 class="card-title">${p.title}</h3>
        ${securityBox}
        <p class="card-text">${p.shortDesc}</p>
        <div class="tech-tags">
          ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
        <div class="card-footer">
          ${actionBtn}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderVideoShowcase() {
  videosContainer.innerHTML = "";
  videoShowcaseList.forEach((v) => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-player-wrapper">
        <video controls preload="metadata">
          <source src="${v.file}" type="video/mp4">
          Tu navegador no soporta reproducción de video HTML5.
        </video>
      </div>
      <div class="video-card-body">
        <div class="video-badge">${ICONS.video} ${v.badge}</div>
        <h3 class="video-card-title">${v.title}</h3>
        <p class="video-card-desc">${v.desc}</p>
        <div class="tech-tags">
          ${v.tags.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
      </div>
    `;
    videosContainer.appendChild(card);
  });
}

function switchToMarketing() {
  document.querySelectorAll(".pill").forEach(p => {
    if (p.getAttribute("data-filter") === "marketing") {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });
  renderProjects("marketing");
  window.scrollTo({ top: document.getElementById("filterPillsContainer").offsetTop - 20, behavior: "smooth" });
}

// Filtros
document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    pill.classList.add("active");
    renderProjects(pill.getAttribute("data-filter"));
  });
});

// Modal Logic
const modal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("modalCloseBtn");

function openModal(id) {
  const p = projects.find(item => item.id === id);
  if (!p) return;

  // Cuadro de advertencia dentro del modal si es confidencial
  const modalSecurityBox = p.isConfidential
    ? `<div class="modal-security-box">
         <h4>${ICONS.warning} Advertencia de Seguridad y Acceso Restringido</h4>
         <p>${p.confidentialNotice}</p>
       </div>`
    : "";

  let badgeClass = "card-badge";
  let badgeIcon = "";
  if (p.isConfidential) {
    badgeClass += " security-badge";
    badgeIcon = ICONS.lock;
  } else if (p.isAward) {
    badgeClass += " award-badge";
    badgeIcon = ICONS.award;
  }

  modalBody.innerHTML = `
    <img src="${p.thumbnail}" alt="${p.title}" class="modal-img" onerror="this.style.display='none'">
    <span class="${badgeClass}">
      ${badgeIcon}
      ${p.badge}
    </span>
    <h2 class="modal-title" style="margin-top: 10px;">${p.title}</h2>
    <h4 class="modal-subtitle">${p.details.subtitle}</h4>
    
    ${modalSecurityBox}

    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 14px; margin-bottom: 20px;">
      <p style="font-size: 0.9rem; color: #cbd5e1;"><strong>Ubicación en Repositorio:</strong> <code>/${p.folder}</code></p>
      <p style="font-size: 0.9rem; color: #cbd5e1; margin-top: 6px;"><strong>Contexto:</strong> ${p.details.context}</p>
    </div>

    <h3 class="modal-section-title">Aspectos Técnicos y Arquitectura</h3>
    <ul class="modal-list">
      ${p.details.architecture.map(item => `<li>${item}</li>`).join("")}
    </ul>

    <h3 class="modal-section-title">Hardware &amp; Entorno</h3>
    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 12px;">${p.details.hardware}</p>

    <h3 class="modal-section-title">Herramientas &amp; Tecnologías</h3>
    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px;">${p.details.software}</p>

    <div style="text-align: right; margin-top: 24px;">
      <a href="https://github.com/eldernoriega54-beep/todos-mis-proyectos/tree/main/${p.folder}" target="_blank" class="btn btn-primary" style="display: inline-flex;">
        ${ICONS.external}
        Ver Carpeta en GitHub
      </a>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Render inicial
renderProjects();
