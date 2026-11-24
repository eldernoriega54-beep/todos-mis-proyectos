const projects = [
  {
    id: "casco-seguridad",
    category: "robotica",
    folder: "02-sistema-prevencion-accidentes-casco",
    title: "Sistema de Prevención de Accidentes de Tráfico",
    badge: "🥈 2do Lugar Nacional (Olimpiadas 2026)",
    isAward: true,
    thumbnail: "assets/thumbnails/viga_logo.png",
    shortDesc: "Prototipo integrado en el chasis de un casco con IMU 10-DOF, GPS Neo-8M, alerta por SMS al 911 con SIM800L ante caídas o lowsider, y modelo Edge AI embebido.",
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
    badge: "App Móvil Android",
    isAward: false,
    thumbnail: "assets/thumbnails/viga_map.jpg",
    shortDesc: "Aplicación móvil complementaria para el casco de seguridad. Enlaza vía Bluetooth Low Energy (BLE) para monitorear telemetría, batería, velocidad y datos médicos del piloto.",
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
    badge: "Edge AI & MediaPipe",
    isAward: false,
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
    id: "chevez-votaciones",
    category: "web",
    folder: "04-sistema-votaciones-reconocimiento-facial",
    title: "Sistema de Votaciones Biométricas 2026",
    badge: "Visión Facial & PHP/Node",
    isAward: false,
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
    category: "fabricacion",
    folder: "11-produccion-audiovisual",
    title: "Producción Audiovisual & Marketing Digital",
    badge: "Videos & Animación CapCut",
    isAward: false,
    thumbnail: "assets/thumbnails/cast_innovation.png",
    shortDesc: "Serie de videos promocionales, institucionales y técnicos producidos y editados en CapCut. Cobertura de robótica, casos de éxito, votaciones biométricas y presentaciones.",
    tags: ["CapCut", "Edición de Video", "Animación", "H.264", "Multimedia"],
    details: {
      subtitle: "Comunicación Técnica y Contenido Audiovisual de Alto Impacto",
      context: "Desarrollo de piezas publicitarias y explicativas para proyectos institucionales, eventos del colegio y torneos de robótica.",
      architecture: [
        "Promoción y Explicación de Votaciones Biométricas: Spots publicitarios para concienciación del voto estudiantil.",
        "Video de la Carrera de Robótica: Resumen visual de la trayectoria, prototipos y competencias nacionales.",
        "Casos de Éxito y Presentaciones: Edición de ritmo, inserción de motion graphics, sincronización de audio y exportación optimizada en H.264."
      ],
      hardware: "Estación de trabajo audiovisual.",
      software: "CapCut Pro, FFmpeg, H.264/AAC Codecs."
    }
  }
];

// Renderizar tarjetas
const container = document.getElementById("projectsContainer");

function renderProjects(filter = "all") {
  container.innerHTML = "";
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy" onerror="this.src='assets/thumbnails/viga_logo.png'">
        <span class="card-badge ${p.isAward ? 'award-badge' : ''}">${p.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-folder">📁 ${p.folder}</div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-text">${p.shortDesc}</p>
        <div class="tech-tags">
          ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" onclick="openModal('${p.id}')">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Ver Detalles y Arquitectura
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
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

  modalBody.innerHTML = `
    <img src="${p.thumbnail}" alt="${p.title}" class="modal-img" onerror="this.style.display='none'">
    <span class="card-badge ${p.isAward ? 'award-badge' : ''}">${p.badge}</span>
    <h2 class="modal-title" style="margin-top: 10px;">${p.title}</h2>
    <h4 class="modal-subtitle">${p.details.subtitle}</h4>
    
    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 14px; margin-bottom: 20px;">
      <p style="font-size: 0.9rem; color: #cbd5e1;"><strong>Ubicación en Repositorio:</strong> <code>/${p.folder}</code></p>
      <p style="font-size: 0.9rem; color: #cbd5e1; margin-top: 6px;"><strong>Contexto:</strong> ${p.details.context}</p>
    </div>

    <h3 class="modal-section-title">Aspectos Técnicos y Arquitectura</h3>
    <ul class="modal-list">
      ${p.details.architecture.map(item => `<li>${item}</li>`).join("")}
    </ul>

    <h3 class="modal-section-title">Hardware & Entorno</h3>
    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 12px;">${p.details.hardware}</p>

    <h3 class="modal-section-title">Herramientas & Tecnologías</h3>
    <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px;">${p.details.software}</p>

    <div style="text-align: right; margin-top: 24px;">
      <a href="https://github.com/eldernoriega54-beep/todos-mis-proyectos/tree/main/${p.folder}" target="_blank" class="btn btn-primary" style="display: inline-flex;">
        Ver Carpeta en GitHub &rarr;
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
