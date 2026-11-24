/* ============================================================
   VEXEL 3D - App Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // PANTALLA DE CARGA
    // ================================================
    const loadingScreen = document.getElementById('loading-screen');
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginStatus = document.getElementById('login-status');
    const googleLoginBtn = document.getElementById('btn-google-login');
    const logoutBtn = document.getElementById('logout-btn');
    const appContainer = document.querySelector('.app-container');

    const googleSignInConfig = {
        client_id: '', // Añade aquí tu Google Client ID para habilitar el SDK.
    };

    let userDatabase = [];

    function showLoader(callback, delay = 800) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.style.opacity = '1';
        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 0.4s';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                if (callback) callback();
            }, 400);
        }, delay);
    }

    // Pantalla de carga inicial al abrir la app
    showLoader(null, 1800);

    // ================================================
    // NAVEGACIÓN
    // ================================================
    const navItems = document.querySelectorAll('.nav-item:not(.has-dropdown)');
    const views    = document.querySelectorAll('.view-section');

    function startMainApp() {
        document.querySelector('.app-container').classList.remove('hidden');
        activateNav(document.getElementById('nav-home'));
        showView('view-home');
    }

    // --- Animación de Celebración PWA ---
    function launchPWACelebration() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; inset:0; z-index:9999999; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; background:rgba(0,0,0,0.55); font-family:Inter, sans-serif;';
        overlay.innerHTML = `
            <div style="background:rgba(22,22,40,0.95); border:2px solid #00e5ff; border-radius:24px; padding:40px; text-align:center; box-shadow:0 0 50px rgba(0,229,255,0.4); animation: modalFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); pointer-events:auto; max-width:400px; color:#fff;">
                <div style="font-size:4rem; margin-bottom:15px;">🎉🎈</div>
                <h2 style="font-size:1.8rem; font-weight:900; background:linear-gradient(135deg, #fff, #00e5ff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:10px;">¡Felicitaciones!</h2>
                <p style="color:#b2b2d3; font-size:1rem; margin-bottom:20px; line-height:1.4;">Has obtenido la aplicación de Vexel 3D con éxito.</p>
                <button id="close-pwa-cel" style="padding:10px 24px; background:#00e5ff; border:none; color:#000; border-radius:10px; font-weight:800; cursor:pointer;">Entendido</button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('close-pwa-cel').addEventListener('click', () => {
            overlay.remove();
        });

        const colors = ['#E040FB', '#00e5ff', '#ffeb3b', '#ff4081', '#00e676'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.style.position = 'fixed';
                el.style.pointerEvents = 'none';
                el.style.zIndex = '99999999';
                
                const isBalloon = Math.random() > 0.6;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const startX = Math.random() * window.innerWidth;
                
                if (isBalloon) {
                    el.style.width = '45px';
                    el.style.height = '55px';
                    el.style.background = color;
                    el.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
                    el.style.left = startX + 'px';
                    el.style.bottom = '-80px';
                    el.style.opacity = '0.9';
                    el.style.boxShadow = 'inset -5px -5px 12px rgba(0,0,0,0.2)';
                    
                    const string = document.createElement('div');
                    string.style.width = '2px';
                    string.style.height = '45px';
                    string.style.background = 'rgba(255,255,255,0.4)';
                    string.style.position = 'absolute';
                    string.style.bottom = '-45px';
                    string.style.left = '21px';
                    el.appendChild(string);
                    
                    document.body.appendChild(el);
                    
                    let pos = -80;
                    const speed = 2 + Math.random() * 4;
                    const swing = 1 + Math.random() * 2;
                    let angle = 0;
                    
                    const balloonInterval = setInterval(() => {
                        pos += speed;
                        angle += 0.04;
                        el.style.bottom = pos + 'px';
                        el.style.transform = `translateX(${Math.sin(angle) * swing * 12}px)`;
                        
                        if (pos > window.innerHeight + 100) {
                            clearInterval(balloonInterval);
                            el.remove();
                        }
                    }, 16);
                } else {
                    const isSerpentina = Math.random() > 0.5;
                    el.style.background = color;
                    el.style.left = startX + 'px';
                    el.style.top = '-20px';
                    el.style.opacity = '0.95';
                    
                    if (isSerpentina) {
                        el.style.width = '4px';
                        el.style.height = '28px';
                        el.style.borderRadius = '2px';
                    } else {
                        el.style.width = '9px';
                        el.style.height = '9px';
                        el.style.borderRadius = '2px';
                    }
                    
                    document.body.appendChild(el);
                    
                    let pos = -20;
                    const speed = 3.5 + Math.random() * 4.5;
                    let angle = Math.random() * 360;
                    const rotSpeed = 3 + Math.random() * 6;
                    const swing = 0.6 + Math.random() * 1.8;
                    let swingAngle = 0;
                    
                    const confettiInterval = setInterval(() => {
                        pos += speed;
                        angle += rotSpeed;
                        swingAngle += 0.08;
                        
                        el.style.top = pos + 'px';
                        el.style.left = (startX + Math.sin(swingAngle) * swing * 16) + 'px';
                        el.style.transform = `rotate(${angle}deg)`;
                        
                        if (pos > window.innerHeight + 50) {
                            clearInterval(confettiInterval);
                            el.remove();
                        }
                    }, 16);
                }
            }, i * 60);
        }
    }

    // --- Modal de Pregunta de Instalación ---
    function showInstallPromptWindow() {
        if (document.getElementById('pwa-prompt-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'pwa-prompt-modal';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(10,10,25,0.85); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:999999; font-family:Inter, sans-serif; color:#fff;';
        
        modal.innerHTML = `
            <div style="background:rgba(20,20,35,0.95); border:1px solid rgba(224, 64, 251, 0.4); border-radius:24px; padding:35px; width:90%; max-width:420px; text-align:center; box-shadow:0 20px 50px rgba(224, 64, 251, 0.25);">
                <div style="font-size:3.5rem; color:#E040FB; margin-bottom:20px;"><i class="fa-solid fa-cloud-arrow-down"></i></div>
                <h3 style="font-size:1.5rem; font-weight:800; margin-bottom:12px;">¿Quieres obtener la app?</h3>
                <p style="color:#b2b2d3; font-size:0.95rem; line-height:1.5; margin-bottom:25px;">Instala Vexel 3D en tu dispositivo para un acceso rápido y diseño sin límites.</p>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button id="pwa-prompt-cancel" style="padding:12px 25px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:12px; font-weight:600; cursor:pointer; transition:background 0.2s;">Quizás más tarde</button>
                    <button id="pwa-prompt-confirm" style="padding:12px 30px; background:#E040FB; border:none; color:#fff; border-radius:12px; font-weight:700; cursor:pointer; box-shadow:0 0 20px rgba(224, 64, 251, 0.4); transition:all 0.2s;">¡Obtener App!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('pwa-prompt-cancel').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('pwa-prompt-confirm').addEventListener('click', () => {
            modal.remove();
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                alert("En iOS: Toca el ícono de Compartir (flecha hacia arriba) y luego selecciona 'Agregar a Inicio'.");
                launchPWACelebration();
                return;
            }
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        launchPWACelebration();
                    }
                    deferredPrompt = null;
                });
            } else {
                launchPWACelebration();
            }
        });
    }

    function initApp() {
        const termsAccepted = localStorage.getItem('vexel3d-terms');
        const termsModal = document.getElementById('terms-modal');
        if (termsAccepted) {
            if (termsModal) termsModal.classList.add('hidden');
            startMainApp();
            
            // Si viene con el parámetro ?install=true, preguntar instalación de inmediato
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('install') === 'true') {
                setTimeout(showInstallPromptWindow, 1500);
            }
        } else {
            if (termsModal) termsModal.classList.remove('hidden');
        }
    }

    const btnAcceptTerms = document.getElementById('btn-accept-terms');
    if (btnAcceptTerms) {
        btnAcceptTerms.addEventListener('click', () => {
            localStorage.setItem('vexel3d-terms', 'true');
            document.getElementById('terms-modal').classList.add('hidden');
            startMainApp();
            
            // Preguntar si quiere obtener la app después de aceptar los términos
            setTimeout(showInstallPromptWindow, 1200);
        });
    }

    function showView(viewId) {
        views.forEach(v => {
            v.classList.toggle('hidden', v.id !== viewId);
            v.classList.toggle('active', v.id === viewId);
        });
    }

    function activateNav(targetNavItem) {
        navItems.forEach(n => n.classList.remove('active'));
        if (targetNavItem) targetNavItem.classList.add('active');
    }

    // Inicializar app después de definir navItems y las funciones base
    initApp();

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;

            if (target === 'home')      { activateNav(item); showView('view-home'); }
            else if (target === 'mydesigns') { activateNav(item); showView('view-mydesigns'); renderMyDesigns(); }
            else if (target === 'settings')  { activateNav(item); showView('view-settings'); }
        });
    });

    // Crear nuevo diseño → editor con loader
    document.getElementById('btn-create-new')?.addEventListener('click', openEditor);
    document.getElementById('btn-hero-create')?.addEventListener('click', openEditor);

    function openEditor() {
        // Al abrir el editor desde Inicio o Crear Diseño, iniciar un proyecto nuevo
        currentProjectId = 'proj_' + Date.now();
        designState = { front: null, back: null };
        window.designState = designState;
        
        activateNav(null);
        showLoader(() => showView('view-editor'), 700);
        initCanvasIfNeeded();
    }

    document.getElementById('btn-back-home')?.addEventListener('click', () => {
        activateNav(document.getElementById('nav-home'));
        showView('view-home');
    });

    // ================================================
    // CONFIGURACIONES INTERNAS
    // ================================================
    // (Configuración unificada, ya no hay paneles laterales)

    // Tema (oscuro / claro) desde configuraciones
    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.setAttribute('data-theme', btn.dataset.t);
        });
    });

    // Color de acento personalizado
    document.querySelectorAll('.accent-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.accent-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.dataset.color;
            document.documentElement.style.setProperty('--accent', color);
            // Calcular versión más clara (simple approximation)
            document.documentElement.style.setProperty('--accent-light', color + 'CC');
        });
    });

    // Theme toggle desde menú de cuenta (shortcut)
    document.getElementById('theme-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // ================================================
    // CATÁLOGO DE PRENDAS (Inicio)
    // ================================================
    const GARMENTS = [
        { id: 'shirt-short',     name: 'Manga Corta',      type: 'shirt', svg: 'estiloscamisas/estilos camisas/camiseta.svg?v=2' },
        { id: 'shirt-long',      name: 'Manga Larga',      type: 'shirt', svg: 'estiloscamisas/estilos camisas/camiseta mangas largas.svg?v=2' },
        { id: 'shirt-sleeveless',name: 'Sin Mangas',       type: 'shirt', svg: 'estiloscamisas/estilos camisas/camiseta sin mangas.svg?v=2' },
        { id: 'shirt-collar',    name: 'Manga Larga Cuello', type: 'shirt', svg: 'estiloscamisas/estilos camisas/camiseta cuello mangas largas.svg?v=2' },
        { id: 'shirt-polo',      name: 'Polo',             type: 'shirt', svg: 'estiloscamisas/estilos camisas/plantila camisa cuello3.svg?v=2' },
        { id: 'pants-long',      name: 'Pantalón Largo',   type: 'pants', svg: 'estilospantalones/pantalon.svg?v=2' },
        { id: 'pants-short',     name: 'Short',            type: 'pants', svg: 'estilospantalones/short.svg?v=2' },
    ];

    const templatesGrid = document.getElementById('garments-grid');

    function renderTemplates(filter = 'all') {
        if (!templatesGrid) return;
        templatesGrid.innerHTML = '';
        const list = filter === 'all' ? GARMENTS : GARMENTS.filter(g => g.type === filter);
        list.forEach(g => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.style.cursor = 'pointer'; // Asegurar que sea clickeable
            card.innerHTML = `
                <div class="template-img" style="background-color: #ffffff; border-radius: 8px; padding: 10px; display: flex; align-items: center; justify-content: center; height: 180px;">
                    <img src="${g.svg}" alt="${g.name}" style="max-height: 100%; max-width: 100%;">
                </div>
                <div class="template-info">
                    <h4>${g.name}</h4>
                    <p>Empresa Vexel 3D</p>
                </div>`;
            card.addEventListener('click', () => {
                const sel = document.getElementById('garment-selector');
                if (sel) {
                    sel.value = g.id;
                    // Trigger the change immediately rather than waiting for timeout
                    sel.dispatchEvent(new Event('change'));
                }
                openEditor();
            });
            templatesGrid.appendChild(card);
        });
    }

    renderTemplates();

    // Tabs de filtro
    document.querySelectorAll('.catalog-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.catalog-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTemplates(tab.dataset.filter);
        });
    });

    // Últimas creaciones vacías
    const recentCreations = document.getElementById('recent-creations');
    if (recentCreations) {
        recentCreations.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-folder-open"></i>
                Aún no has creado diseños. ¡Empieza con uno de los modelos!
            </div>`;
    }

    // ================================================
    // COMUNIDAD (vacía — esperando usuarios reales)
    // ================================================
    const storiesBar = document.getElementById('stories-bar');
    if (storiesBar) {
        storiesBar.innerHTML = `
            <p style="color:var(--text-muted);font-size:13px;padding:10px 0;white-space:nowrap">
                No hay historias nuevas.
            </p>`;
    }

    const communityFeed = document.getElementById('community-feed');
    if (communityFeed) {
        communityFeed.innerHTML = `
            <div class="community-empty">
                <i class="fa-regular fa-image"></i>
                <h3>Aún no hay publicaciones</h3>
                <p>¡Sé el primero en compartir tu diseño con la comunidad Vexel 3D!</p>
            </div>`;
    }

    const featuredList = document.getElementById('featured-list');
    if (featuredList) {
        featuredList.innerHTML = `
            <p style="font-size:13px;color:var(--text-muted)">Sin usuarios destacados aún.</p>`;
    }

    // ================================================
    // SVGs DE PRENDAS INCRUSTADOS (para funcionar sin servidor)
    // ================================================
    const GARMENT_SVGS = {
        'shirt-short': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460">
            <path d="M130,30 C155,18 175,12 200,12 C225,12 245,18 270,30
                     L310,42 C345,56 378,80 395,105 L360,145 L320,115 L320,445
                     L80,445 L80,115 L40,145 L5,105 C22,80 55,56 90,42 Z
                     M130,30 C143,52 163,68 200,73 C237,68 257,52 270,30" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="3" stroke-linejoin="round"/>
        </svg>`,
        'shirt-long': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 520">
            <path d="M135,30 C158,18 178,12 210,12 C242,12 262,18 285,30
                     L320,44 C358,60 395,86 410,115
                     L395,340 L355,335 L330,115
                     L330,500 L90,500 L90,115 L65,335 L25,340
                     L10,115 C25,86 62,60 100,44 Z
                     M135,30 C148,52 168,68 210,73 C252,68 272,52 285,30" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="3" stroke-linejoin="round"/>
        </svg>`,
        'shirt-sleeveless': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 460">
            <path d="M90,12 C115,12 155,10 170,10 C185,10 225,12 250,12
                     C270,18 290,28 300,42 L305,80 L305,445 L35,445 L35,80
                     L40,42 C50,28 70,18 90,12 Z
                     M90,12 C100,35 118,55 170,60 C222,55 240,35 250,12" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="3" stroke-linejoin="round"/>
        </svg>`,
        'pants-long': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 560">
            <rect x="55" y="10" width="250" height="35" rx="5" fill="#EFEFEF" stroke="#C8C8C8" stroke-width="2"/>
            <path d="M55,45 L305,45 L292,265 L210,265 L190,278 L170,265 L68,265 Z" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="2.5"/>
            <path d="M68,265 L170,265 L165,545 L60,545 Z" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="2.5"/>
            <path d="M210,265 L292,265 L300,545 L195,545 Z" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="2.5"/>
        </svg>`,
        'pants-short': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320">
            <rect x="55" y="10" width="250" height="35" rx="5" fill="#EFEFEF" stroke="#C8C8C8" stroke-width="2"/>
            <path d="M55,45 L305,45 L293,195 L212,195 L192,208 L172,195 L67,195 Z" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="2.5"/>
            <path d="M67,195 L172,195 L168,305 L63,305 Z" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="2.5"/>
            <path d="M212,195 L293,195 L297,305 L192,305 Z" 
                  fill="#F7F7F7" stroke="#C8C8C8" stroke-width="2.5"/>
        </svg>`,
    };

    function svgToDataURL(svgString) {
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    }

    // ================================================
    // EDITOR — CANVAS (Fabric.js)
    // ================================================
    let canvas = null;
    let historyUndo = [];
    let historyRedo = [];
    let currentSide = 'front';
    window.currentSide = currentSide;
    let designState = { front: null, back: null }; // Guardar estado por lado
    window.designState = designState;

    function initCanvasIfNeeded() {
        if (canvas) return;

        const canvasEl = document.getElementById('design-canvas');
        const wrapper  = document.getElementById('canvas-wrapper');

        // Tamaño del canvas según el wrapper
        const W = 560;
        const H = 680;

        canvas = new fabric.Canvas('design-canvas', {
            width: W,
            height: H,
            backgroundColor: '#FFFFFF',
            selection: true,
            preserveObjectStacking: true,
        });
        window.canvas = canvas;

        loadGarmentSVG(document.getElementById('garment-selector').value);
        attachCanvasEvents();
        extendCanvasWithBubble();
        if (window.__initSliceTool) window.__initSliceTool();
    }
    window.initCanvasIfNeeded = initCanvasIfNeeded;

    // Cargar prenda como imagen + región de recorte
    function loadGarmentSVG(type) {
        if (!canvas) return;
        saveCurrentSideState();
        canvas.clear();
        canvas.backgroundColor = '#F0F0F0';
        canvas.clipPath = null;
        canvas.setZoom(1);
        canvas.viewportTransform = [1,0,0,1,0,0];

        if (type === 'blank') {
            canvas.backgroundColor = '#FFFFFF';
            canvas.renderAll();
            updateEditorLabel('Lienzo en Blanco');
            return;
        }

        const nameMap = {
            'shirt-short': 'Manga Corta', 'shirt-long': 'Manga Larga',
            'shirt-sleeveless': 'Sin Mangas', 'shirt-collar': 'Manga Larga Cuello', 'shirt-polo': 'Polo',
            'pants-long': 'Pantalón Largo', 'pants-short': 'Short',
        };
        updateEditorLabel(nameMap[type] || type);

        const garmentInfo = GARMENTS.find(g => g.id === type);
        if (!garmentInfo) return;

        // Añadimos un cache-buster para asegurar que se descargue el archivo SVG actualizado con el relleno blanco
        const svgUrl = garmentInfo.svg.split('?')[0] + '?t=' + Date.now();
        
        fetch(svgUrl)
            .then(res => res.text())
            .then(svgStr => {
                const W = canvas.width;
                const H = canvas.height;
                const pad = 30;

                // Primera pasada: dibujar la prenda de fondo
                fabric.loadSVGFromString(svgStr, function(objects, options) {
                    if (!objects || objects.length === 0) {
                        console.error('SVG sin objetos para tipo:', type);
                        return;
                    }

                    const svgObj = fabric.util.groupSVGElements(objects, options);
                    const objW = svgObj.width  || 595;
                    const objH = svgObj.height || 841;
                    let scale = Math.min((W - pad*2) / objW, (H - pad*2) / objH);
                    if (!isFinite(scale) || scale > 10) scale = 0.8;

                    // Forzar el color de la prenda a blanco por defecto para que no se vea oscura/transparente
                    if (svgObj._objects) {
                        svgObj._objects.forEach(path => {
                            // Aplicamos blanco a todos los trazos o formas para asegurar que la camiseta tenga fondo
                            path.set({ fill: '#ffffff' });
                            // Si no tenía borde, le ponemos uno sutil
                            if (!path.stroke || path.stroke === 'none') {
                                path.set({ stroke: '#cccccc', strokeWidth: 1 });
                            }
                        });
                    } else {
                        svgObj.set({ fill: '#ffffff' });
                        if (!svgObj.stroke || svgObj.stroke === 'none') {
                            svgObj.set({ stroke: '#cccccc', strokeWidth: 1 });
                        }
                    }

                    svgObj.set({
                        left: W / 2, top: H / 2,
                        originX: 'center', originY: 'center',
                        scaleX: scale, scaleY: scale,
                        selectable: false, evented: true,
                        hoverCursor: 'pointer',
                        excludeFromExport: true,
                        isGarment: true
                    });
                    canvas.add(svgObj);
                    canvas.sendToBack(svgObj);

                    // Segunda pasada: crear clipPath con la misma forma
                    fabric.loadSVGFromString(svgStr, function(clipObjects, clipOptions) {
                        if (!clipObjects || clipObjects.length === 0) {
                            canvas.renderAll();
                            saveHistory();
                            return;
                        }
                        const clipObj = fabric.util.groupSVGElements(clipObjects, clipOptions);
                        clipObj.set({
                            left: W / 2, top: H / 2,
                            originX: 'center', originY: 'center',
                            scaleX: scale, scaleY: scale,
                        });
                        canvas.clipPath = clipObj;
                        canvas.renderAll();
                        saveHistory();
                    });
                });
            }).catch(err => console.error('Error loading garment SVG:', err));
    }

    function updateEditorLabel(name) {
        document.getElementById('editor-garment-label').textContent = name;
    }

    // Cambio de prenda
    document.getElementById('garment-selector')?.addEventListener('change', (e) => {
        loadGarmentSVG(e.target.value);
    });

    // Frente / Espalda
    document.getElementById('btn-side-front')?.addEventListener('click', () => switchSide('front'));
    document.getElementById('btn-side-back')?.addEventListener('click',  () => switchSide('back'));

    function switchSide(side) {
        if (side === currentSide) return;
        saveCurrentSideState();
        currentSide = side;
        window.currentSide = currentSide;
        document.getElementById('btn-side-front').classList.toggle('active', side === 'front');
        document.getElementById('btn-side-back').classList.toggle('active',  side === 'back');
        restoreSideState(side);
    }

    function saveCurrentSideState() {
        if (!canvas) return;
        // Guardamos todos los objetos excepto el fondo (no seleccionable)
        const objs = canvas.getObjects().filter(o => o.selectable !== false);
        designState[currentSide] = JSON.stringify(canvas.toJSON(['selectable', 'evented']));
    }

    function restoreSideState(side) {
        if (!canvas) return;
        const state = designState[side];
        const garmentType = document.getElementById('garment-selector').value;
        loadGarmentSVG(garmentType);
        // Restaurar objetos guardados de ese lado si hay
        // (simplificado — restaurar tras breve delay para que el SVG cargue)
        if (state) {
            setTimeout(() => {
                const parsed = JSON.parse(state);
                const userObjs = (parsed.objects || []).filter(o => o.selectable !== false);
                userObjs.forEach(objData => {
                    fabric.util.enlivenObjects([objData], (enlivened) => {
                        enlivened.forEach(obj => canvas.add(obj));
                        canvas.renderAll();
                    });
                });
            }, 400);
        }
    }

    // ================================================
    // SISTEMA DE HERRAMIENTAS - MODO ACTIVO
    // ================================================
    let currentTool = 'select';
    let sliceMode = false;
    let sliceStartPoint = null;
    let sliceLine = null;

    function setActiveTool(toolId) {
        currentTool = toolId;
        // Quitar estado activo de todos los botones
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('tool-' + toolId.replace('tool-',''));
        if (btn) btn.classList.add('active');

        // Salir de modo dibujo por defecto
        if (canvas) {
            canvas.isDrawingMode = false;
            canvas.selection = true;
            sliceMode = false;
            canvas.defaultCursor = 'default';
        }

        if (toolId === 'pencil' && canvas) {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.color = document.getElementById('prop-fill')?.value || '#000000';
            canvas.freeDrawingBrush.width = 4;
        }
        if (toolId === 'group-select' && canvas) {
            canvas.selection = true;
        }
        if (toolId === 'slice' && canvas) {
            sliceMode = true;
            canvas.defaultCursor = 'crosshair';
            canvas.selection = false;
        }
        if (toolId === 'curve' && canvas) {
            convertLastLineToCurve();
        }
        if (toolId === 'group-objects' && canvas) {
            groupSelectedObjects();
        }
    }

    // Convertir la última línea de corte a bézier
    function convertLastLineToCurve() {
        if (!canvas) return;
        const objs = canvas.getObjects();
        // Buscar la última línea de corte (marcada como isSliceLine)
        const lastLine = [...objs].reverse().find(o => o.isSliceLine);
        if (!lastLine) return;
        const x1 = lastLine.x1, y1 = lastLine.y1, x2 = lastLine.x2, y2 = lastLine.y2;
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2 - 40;
        const curve = new fabric.Path(`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`, {
            stroke: '#e53935', strokeWidth: 2, fill: 'transparent',
            selectable: true, evented: true, isSliceLine: true,
        });
        canvas.remove(lastLine);
        canvas.add(curve);
        canvas.renderAll();
        saveHistory();
    }

    // Agrupar objetos seleccionados
    function groupSelectedObjects() {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;
        if (active.type === 'activeSelection') {
            active.toGroup();
            canvas.requestRenderAll();
            saveHistory();
        } else if (active.type === 'group') {
            active.toActiveSelection();
            canvas.requestRenderAll();
            saveHistory();
        }
    }

    // Eventos de clic en botones de herramientas
    ['select','group-select','pencil','slice','curve','group-objects'].forEach(id => {
        document.getElementById('tool-' + id)?.addEventListener('click', () => setActiveTool(id));
    });

    // ================================================
    // HERRAMIENTAS DE CORTE (Slice) sobre el lienzo
    // ================================================
    // Se implementa en el event listener del canvas (mouse:down / mouse:up)
    // Guardamos referencia para inicializar después del canvas
    window.__initSliceTool = function() {
        if (!canvas) return;
        canvas.on('mouse:down', function(opt) {
            if (!sliceMode) return;
            const p = canvas.getPointer(opt.e);
            sliceStartPoint = { x: p.x, y: p.y };
            // Línea guía temporal
            sliceLine = new fabric.Line([p.x, p.y, p.x, p.y], {
                stroke: '#e53935', strokeWidth: 2, strokeDashArray: [5, 5],
                selectable: false, evented: false, isSliceLine: true,
            });
            canvas.add(sliceLine);
        });
        canvas.on('mouse:move', function(opt) {
            if (!sliceMode || !sliceLine) return;
            const p = canvas.getPointer(opt.e);
            sliceLine.set({ x2: p.x, y2: p.y });
            canvas.renderAll();
        });
        canvas.on('mouse:up', function(opt) {
            if (!sliceMode || !sliceLine) return;
            const p = canvas.getPointer(opt.e);
            
            const dx = p.x - sliceStartPoint.x;
            const dy = p.y - sliceStartPoint.y;
            // Solo crear zona si la línea tiene cierta longitud (evitar clics accidentales)
            if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                
                // Crear un rectángulo gigante que cuelga de la línea para actuar como la nueva "zona"
                const zone = new fabric.Rect({
                    left: (sliceStartPoint.x + p.x) / 2,
                    top: (sliceStartPoint.y + p.y) / 2,
                    width: 3000,
                    height: 3000,
                    originX: 'center',
                    originY: 'top',
                    angle: angle,
                    fill: '#1565C0', // Color por defecto
                    opacity: 1,
                    selectable: true,
                    isGarmentZone: true,
                    name: 'Zona de Color'
                });
                
                canvas.add(zone);
                
                // Enviar la zona al fondo, pero siempre SOBRE la prenda principal
                zone.sendToBack();
                const garment = canvas.getObjects().find(o => o.isGarment);
                if (garment) garment.sendToBack();
            }
            
            canvas.remove(sliceLine);
            sliceLine = null;
            canvas.renderAll();
            saveHistory();
            
            // Volver al modo selección
            setActiveTool('select');
        });
    };

    // ================================================
    // HERRAMIENTAS DEL EDITOR (originales)
    // ================================================

    // -- TEXTO --
    document.getElementById('tool-text')?.addEventListener('click', () => {
        if (!canvas) return;
        const text = new fabric.IText('Tu Texto Aquí', {
            left: canvas.width / 2,
            top:  canvas.height / 2,
            originX: 'center', originY: 'center',
            fontFamily: 'Inter',
            fill: '#000000',
            fontSize: 36,
            fontWeight: '700',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        saveHistory();
    });

    // -- TEXTO CURVADO --
    document.getElementById('tool-text-arch')?.addEventListener('click', () => {
        if (!canvas) return;
        const radius   = 120;
        const text     = 'Texto curvado';
        const chars    = text.split('');
        const angle    = 180 / chars.length;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + radius / 2;

        const group = [];
        chars.forEach((char, i) => {
            const charAngle = -90 + angle * i + angle / 2;
            const rad = charAngle * Math.PI / 180;
            const x = cx + radius * Math.cos(rad);
            const y = cy + radius * Math.sin(rad);
            const t = new fabric.Text(char, {
                left: x, top: y,
                originX: 'center', originY: 'center',
                fontSize: 26,
                fontFamily: 'Inter',
                fontWeight: '700',
                fill: '#000000',
                angle: charAngle + 90,
            });
            canvas.add(t);
            group.push(t);
        });
        // Agrupar todos los caracteres
        const fabricGroup = new fabric.Group(group);
        group.forEach(t => canvas.remove(t));
        canvas.add(fabricGroup);
        canvas.setActiveObject(fabricGroup);
        saveHistory();
    });

    // -- MODAL DE ELEMENTOS GRÁFICOS --
    const elementosModal = document.getElementById('elementos-modal');
    const elementosGrid = document.getElementById('elementos-grid');
    let currentElementoCategory = 'filled';

    // Cargar los iconos en el modal
    function loadElementosModal(category = 'filled') {
        currentElementoCategory = category;
        if (!ICONS_DATA || !ICONS_DATA[category]) {
            elementosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;">No hay iconos disponibles</p>';
            return;
        }
        elementosGrid.innerHTML = '';
        const icons = ICONS_DATA[category].slice(0, 80);
        if (icons.length === 0) {
            elementosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;">No hay iconos en esta categoría</p>';
            return;
        }
        icons.forEach((iconName, index) => {
            const iconContainer = document.createElement('div');
            iconContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:8px;border-radius:6px;transition:background 0.2s;';
            iconContainer.title = iconName;
            iconContainer.className = 'icon-item';
            iconContainer.setAttribute('data-icon-name', iconName);
            iconContainer.setAttribute('data-category', category);
            
            const iconImg = document.createElement('img');
            iconImg.src = './elementos graficos/tabler-icons-main/tabler-icons-main/icons/' + category + '/' + iconName + '.svg?v=2';
            iconImg.style.cssText = 'width:40px;height:40px;object-fit:contain;';
            iconImg.onerror = () => { 
                iconContainer.style.opacity = '0.4';
                console.warn('Icon failed to load:', iconName);
            };
            iconImg.onload = () => {
                console.log('Icon loaded:', iconName);
            };
            
            const iconLabel = document.createElement('small');
            iconLabel.textContent = iconName.substring(0, 12);
            iconLabel.style.cssText = 'font-size:10px;color:#999;text-align:center;word-break:break-word;';
            
            iconContainer.appendChild(iconImg);
            iconContainer.appendChild(iconLabel);
            
            iconContainer.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(74, 20, 140, 0.15)';
            });
            iconContainer.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
            
            iconContainer.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Clicked icon:', iconName);
                insertIconoToCanvas(category, iconName);
                elementosModal.classList.add('hidden');
            });
            
            elementosGrid.appendChild(iconContainer);
        });
    }

    // Insertar icono en el canvas
    function insertIconoToCanvas(category, iconName) {
        console.log('insertIconoToCanvas called with:', category, iconName);
        
        if (!canvas) {
            console.error('Canvas not initialized');
            alert('El canvas no está disponible. Asegúrate de estar en la vista del editor.');
            return;
        }
        
        // Usar espacios reales en la ruta
        const iconPath = './elementos graficos/tabler-icons-main/tabler-icons-main/icons/' + category + '/' + iconName + '.svg?v=2';
        console.log('Loading SVG from:', iconPath);
        
        // Usar XMLHttpRequest para mejor soporte con file:// URLs
        const xhr = new XMLHttpRequest();
        xhr.open('GET', iconPath, true);
        xhr.responseType = 'text';
        
        xhr.onload = function() {
            if (xhr.status === 200 || xhr.status === 0) {
                console.log('SVG loaded, parsing...');
                
                try {
                    // Usar loadSVGFromString de Fabric
                    fabric.loadSVGFromString(xhr.responseText, function(objects, options) {
                        console.log('SVG parsed, objects count:', objects ? objects.length : 0);
                        
                        if (!objects || objects.length === 0) {
                            console.error('No SVG objects parsed for:', iconName);
                            alert('No se pudo procesar el icono: ' + iconName);
                            return;
                        }
                        
                        let svgObj;
                        try {
                            if (objects.length === 1) {
                                svgObj = objects[0];
                            } else {
                                svgObj = new fabric.Group(objects);
                            }
                            
                            // Escalar el objeto
                            const maxSize = Math.min(150, canvas.width * 0.3);
                            svgObj.scaleToWidth(maxSize);
                            
                            // Posicionar en el centro
                            svgObj.set({
                                left: canvas.width / 2,
                                top: canvas.height / 2,
                                originX: 'center',
                                originY: 'center'
                            });
                            
                            // Añadir al canvas
                            canvas.add(svgObj);
                            canvas.setActiveObject(svgObj);
                            canvas.renderAll();
                            
                            console.log('Icon successfully added to canvas');
                            
                            // Guardar en historial si existe la función
                            if (typeof saveHistory === 'function') {
                                saveHistory();
                            }
                        } catch (error) {
                            console.error('Error processing SVG:', error);
                            alert('Error al procesar el icono: ' + error.message);
                        }
                    });
                } catch (error) {
                    console.error('Error parsing SVG:', error);
                    alert('Error al parsear el icono: ' + error.message);
                }
            }
        };
        
        xhr.onerror = function() {
            console.error('Error loading SVG:', xhr.status, xhr.statusText);
            alert('Error al cargar el icono. Verifica la ruta: ' + iconPath);
        };
        
        xhr.onprogress = function(e) {
            console.log('Loading progress:', e.loaded, 'bytes');
        };
        
        xhr.send();
    }

    // Manejadores de pestañas del modal de elementos
    document.querySelectorAll('#elementos-modal .modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#elementos-modal .modal-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadElementosModal(tab.dataset.category);
        });
    });

    // Abrir modal de elementos
    document.getElementById('tool-elementos')?.addEventListener('click', () => {
        loadElementosModal('filled');
        elementosModal.classList.remove('hidden');
    });

    document.getElementById('close-elementos-modal')?.addEventListener('click', () => {
        elementosModal.classList.add('hidden');
    });

    elementosModal?.addEventListener('click', (e) => {
        if (e.target === elementosModal) elementosModal.classList.add('hidden');
    });

    // -- MODAL DE FORMAS --
    const shapeModal = document.getElementById('shape-modal');
    document.getElementById('tool-shape')?.addEventListener('click', () => {
        shapeModal.classList.remove('hidden');
    });
    document.getElementById('close-shape-modal')?.addEventListener('click', () => {
        shapeModal.classList.add('hidden');
    });
    shapeModal?.addEventListener('click', (e) => {
        if (e.target === shapeModal) shapeModal.classList.add('hidden');
    });

    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!canvas) return;
            const type = btn.dataset.shape;
            let shape;
            const base = {
                left: canvas.width / 2, top: canvas.height / 2,
                originX: 'center', originY: 'center',
                fill: '#4A148C', stroke: 'transparent', strokeWidth: 0,
            };
            if (type === 'rect') {
                shape = new fabric.Rect({ ...base, width: 120, height: 80, rx: 8, ry: 8 });
            } else if (type === 'circle') {
                shape = new fabric.Circle({ ...base, radius: 55 });
            } else if (type === 'triangle') {
                shape = new fabric.Triangle({ ...base, width: 110, height: 110 });
            } else if (type === 'star') {
                shape = makeStar(canvas.width / 2, canvas.height / 2, 5, 60, 30, base.fill);
            } else if (type === 'line') {
                shape = new fabric.Line([canvas.width/2 - 60, canvas.height/2, canvas.width/2 + 60, canvas.height/2], {
                    stroke: '#4A148C', strokeWidth: 6, strokeLineCap: 'round',
                });
            } else if (type === 'hexagon') {
                shape = makePolygon(6, 60, canvas.width / 2, canvas.height / 2, base.fill);
            }
            if (shape) {
                canvas.add(shape);
                canvas.setActiveObject(shape);
                saveHistory();
            }
            shapeModal.classList.add('hidden');
        });
    });

    function makeStar(cx, cy, points, outerR, innerR, fill) {
        const pts = [];
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        }
        return new fabric.Polygon(pts, { fill, originX: 'center', originY: 'center' });
    }

    function makePolygon(sides, radius, cx, cy, fill) {
        const pts = [];
        for (let i = 0; i < sides; i++) {
            const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
            pts.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
        }
        return new fabric.Polygon(pts, { fill, originX: 'center', originY: 'center' });
    }

    // -- IMPORTAR IMAGEN / SVG --
    document.getElementById('tool-upload')?.addEventListener('change', (e) => {
        if (!canvas) return;
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const data = ev.target.result;
            if (file.name.toLowerCase().endsWith('.svg')) {
                fabric.loadSVGFromURL(data, (objects, opts) => {
                    const obj = fabric.util.groupSVGElements(objects, opts);
                    obj.scaleToWidth(Math.min(180, canvas.width * 0.35));
                    obj.set({ left: canvas.width/2, top: canvas.height/2, originX:'center', originY:'center' });
                    canvas.add(obj);
                    canvas.setActiveObject(obj);
                    canvas.renderAll();
                    saveHistory();
                });
            } else {
                fabric.Image.fromURL(data, (img) => {
                    img.scaleToWidth(Math.min(200, canvas.width * 0.40));
                    img.set({ left: canvas.width/2, top: canvas.height/2, originX:'center', originY:'center' });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                    saveHistory();
                });
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    });

    // -- ELIMINAR --
    document.getElementById('tool-delete')?.addEventListener('click', deleteSelected);

    // Ctrl+Z / Ctrl+Y
    window.addEventListener('keydown', (e) => {
        const inEditor = document.getElementById('view-editor').classList.contains('active');
        if (!inEditor || !canvas) return;

        const active = canvas.getActiveObject();

        // No interceptar si estamos escribiendo en texto
        if (active && active.isEditing) return;

        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undoHistory();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
            e.preventDefault();
            redoHistory();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            groupSelected();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
            e.preventDefault();
            ungroupSelected();
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && !active?.isEditing) {
            deleteSelected();
        }
    });

    // Agrupar objetos seleccionados (Ctrl+G)
    function groupSelected() {
        const sel = canvas.getActiveObject();
        if (!sel || sel.type !== 'activeSelection') return;
        const group = sel.toGroup();
        canvas.setActiveObject(group);
        canvas.renderAll();
        saveHistory();
    }

    // Desagrupar (Ctrl+Shift+G)
    function ungroupSelected() {
        const sel = canvas.getActiveObject();
        if (!sel || sel.type !== 'group') return;
        const items = sel.toActiveSelection();
        canvas.setActiveObject(items);
        canvas.renderAll();
        saveHistory();
    }

    function deleteSelected() {
        if (!canvas) return;
        const objs = canvas.getActiveObjects();
        if (objs.length) {
            canvas.discardActiveObject();
            objs.forEach(o => canvas.remove(o));
            canvas.renderAll();
            saveHistory();
        }
    }

    // ================================================
    // PANEL DE PROPIEDADES
    // ================================================
    const propertiesPanel  = document.getElementById('properties-panel');
    const noSelectionHint  = document.getElementById('no-selection-hint');
    const propFill         = document.getElementById('prop-fill');
    const propStroke       = document.getElementById('prop-stroke');
    const propStrokeWidth  = document.getElementById('prop-stroke-width');
    const propOpacity      = document.getElementById('prop-opacity');
    const propOpacityLabel = document.getElementById('opacity-label');
    const propFontSize     = document.getElementById('prop-font-size');
    const textPropsRow     = document.getElementById('text-props-row');
    const textBoldRow      = document.getElementById('text-bold-row');
    const propFontFamily   = document.getElementById('prop-font-family');
    const textFontRow      = document.getElementById('text-font-row');
    const propBold         = document.getElementById('prop-bold');
    const propItalic       = document.getElementById('prop-italic');
    const propUnderline    = document.getElementById('prop-underline');

    function attachCanvasEvents() {
        canvas.on('selection:created', updatePropsPanel);
        canvas.on('selection:updated', updatePropsPanel);
        canvas.on('selection:cleared', () => {
            propertiesPanel.style.display = 'none';
            noSelectionHint.style.display = 'block';
        });
        canvas.on('object:modified', saveHistory);

        // Clic en la prenda → burbuja de color de prenda
        canvas.on('mouse:down', function(opt) {
            const clickedTarget = opt.target;
            // Solo abrir burbuja si se hizo clic DIRECTAMENTE en la prenda (isGarment) o en una zona cortada
            if (clickedTarget && (clickedTarget.isGarment === true || clickedTarget.isGarmentZone === true)) {
                showGarmentColorPicker(opt.e, clickedTarget);
            }
        });

        // Conectar burbuja flotante
        extendCanvasWithBubble();
    }

    // ================================================
    // BURBUJA DE COLOR DE PRENDA
    // ================================================
    let garmentColorBubble = null;

    function showGarmentColorPicker(mouseEvent, targetObj) {
        window.currentGarmentTarget = targetObj; // Guardar referencia global para el onclick

        // Remover burbuja anterior si existe
        if (garmentColorBubble) garmentColorBubble.remove();

        const canvasEl = document.getElementById('design-canvas');
        const rect = canvasEl.getBoundingClientRect();

        garmentColorBubble = document.createElement('div');
        garmentColorBubble.id = 'garment-color-bubble';
        garmentColorBubble.style.cssText = `
            position: fixed;
            left: ${Math.min(mouseEvent.clientX + 10, window.innerWidth - 220)}px;
            top: ${Math.min(mouseEvent.clientY - 10, window.innerHeight - 110)}px;
            background: var(--bg-surface, #1e1e2e);
            border: 1px solid var(--accent, #7c3aed);
            border-radius: 12px;
            padding: 12px 16px;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 190px;
            font-family: Inter, sans-serif;
        `;
        const titleText = targetObj && targetObj.isGarmentZone ? 'Color de Zona' : 'Color de prenda';
        garmentColorBubble.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#fff;font-size:13px;font-weight:600;"><i class="fa-solid fa-fill-drip" style="color:#a78bfa;margin-right:6px;"></i>${titleText}</span>
                <button id="gcb-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:16px;padding:0;">✕</button>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <input type="color" id="gcb-color" value="#4A148C" style="width:44px;height:36px;border:none;border-radius:8px;cursor:pointer;background:none;">
                <span style="color:#ccc;font-size:12px;">Toca para seleccionar color</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${['#ffffff','#000000','#ef4444','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316'].map(c =>
                    `<div onclick="applyGarmentColor('${c}', window.currentGarmentTarget)" style="width:24px;height:24px;background:${c};border-radius:50%;cursor:pointer;border:2px solid #333;transition:transform 0.1s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>`
                ).join('')}
            </div>
            <button id="gcb-apply" style="background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:8px;cursor:pointer;font-size:13px;font-weight:600;">Aplicar color</button>
        `;

        document.body.appendChild(garmentColorBubble);

        // Aplicar al hacer clic en "Aplicar"
        document.getElementById('gcb-apply').addEventListener('click', () => {
            const color = document.getElementById('gcb-color').value;
            applyGarmentColor(color, window.currentGarmentTarget);
        });

        // Aplicar color en tiempo real para el modelo 3D
        document.getElementById('gcb-color').addEventListener('input', (e) => {
            applyGarmentColor(e.target.value, window.currentGarmentTarget, true); // true = no cerrar burbuja
        });

        // Cerrar
        document.getElementById('gcb-close').addEventListener('click', () => {
            garmentColorBubble?.remove();
            garmentColorBubble = null;
            window.currentGarmentTarget = null;
        });

        // Cerrar al hacer clic fuera
        if (window.closeGarmentBubbleFn) {
            document.removeEventListener('mousedown', window.closeGarmentBubbleFn);
        }
        
        window.closeGarmentBubbleFn = function(e) {
            if (garmentColorBubble && !garmentColorBubble.contains(e.target)) {
                // Prevenir que se cierre inmediatamente si acaban de hacer clic en el canvas para abrirla
                if (e.target.tagName.toLowerCase() === 'canvas') return;
                
                garmentColorBubble.remove();
                garmentColorBubble = null;
                window.currentGarmentTarget = null;
                document.removeEventListener('mousedown', window.closeGarmentBubbleFn);
                window.closeGarmentBubbleFn = null;
            }
        };

        setTimeout(() => {
            document.addEventListener('mousedown', window.closeGarmentBubbleFn);
        }, 100);
    }
    window.showGarmentColorPicker = showGarmentColorPicker;

    // Función global para aplicar color a la prenda
    window.applyGarmentColor = function(color, targetObj, keepBubbleOpen = false) {
        if (!canvas) return;
        const garment = targetObj || window.currentGarmentTarget || canvas.getObjects().find(o => o.isGarment || o.selectable === false);
        if (garment) {
            if (garment._objects) {
                garment._objects.forEach(path => {
                    if (path.fill && path.fill !== 'none' && path.fill !== 'transparent') {
                        path.set('fill', color);
                    }
                });
            } else {
                garment.set('fill', color);
            }
            canvas.renderAll();
            if (window.saveHistory) window.saveHistory();
            if (window.syncTextureTo3D) window.syncTextureTo3D();
        }
        if (garmentColorBubble && !keepBubbleOpen) {
            garmentColorBubble.remove();
            garmentColorBubble = null;
        }
    };

    function updatePropsPanel() {
        const obj = canvas.getActiveObject();
        if (!obj || obj.selectable === false) return;

        propertiesPanel.style.display = 'block';
        noSelectionHint.style.display = 'none';

        // Rellenar campos
        if (obj.fill && typeof obj.fill === 'string') propFill.value = rgbToHex(obj.fill) || '#4A148C';
        if (obj.stroke) propStroke.value = rgbToHex(obj.stroke) || '#000000';
        propStrokeWidth.value = obj.strokeWidth || 0;
        propOpacity.value = Math.round((obj.opacity || 1) * 100);
        propOpacityLabel.textContent = propOpacity.value + '%';

        const isText = obj.type === 'i-text' || obj.type === 'text';
        if (textPropsRow) textPropsRow.style.display = isText ? 'flex' : 'none';
        if (textBoldRow) textBoldRow.style.display  = isText ? 'flex' : 'none';
        if (textFontRow) textFontRow.style.display = isText ? 'flex' : 'none';

        if (isText) {
            if (propFontSize) propFontSize.value = obj.fontSize || 40;
            if (propBold) propBold.classList.toggle('active', obj.fontWeight === 'bold');
            if (propItalic) propItalic.classList.toggle('active', obj.fontStyle === 'italic');
            if (propUnderline) propUnderline.classList.toggle('active', !!obj.underline);
            if (propFontFamily) propFontFamily.value = obj.fontFamily || 'Inter';
        }
    }

    propFill.addEventListener('input', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('fill', propFill.value); canvas.renderAll(); }
    });
    propStroke.addEventListener('input', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('stroke', propStroke.value); canvas.renderAll(); }
    });
    propStrokeWidth.addEventListener('input', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('strokeWidth', parseInt(propStrokeWidth.value)); canvas.renderAll(); }
    });
    propOpacity.addEventListener('input', () => {
        const obj = canvas?.getActiveObject();
        const val = parseInt(propOpacity.value);
        propOpacityLabel.textContent = val + '%';
        if (obj) { obj.set('opacity', val / 100); canvas.renderAll(); }
    });
    propFontSize.addEventListener('input', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('fontSize', parseInt(propFontSize.value)); canvas.renderAll(); }
    });
    propFontFamily?.addEventListener('change', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('fontFamily', propFontFamily.value); canvas.renderAll(); saveHistory(); }
    });
    propBold?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        const isBold = obj.fontWeight === 'bold';
        obj.set('fontWeight', isBold ? 'normal' : 'bold');
        propBold.classList.toggle('active', !isBold);
        canvas.renderAll();
    });
    propItalic?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        const isItalic = obj.fontStyle === 'italic';
        obj.set('fontStyle', isItalic ? 'normal' : 'italic');
        propItalic.classList.toggle('active', !isItalic);
        canvas.renderAll();
    });
    propUnderline?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (!obj) return;
        obj.set('underline', !obj.underline);
        propUnderline.classList.toggle('active', !!obj.underline);
        canvas.renderAll();
    });

    // ================================================
    // ACCIONES RÁPIDAS (barra derecha)
    // ================================================
    document.getElementById('qa-undo')?.addEventListener('click', undoHistory);
    document.getElementById('qa-redo')?.addEventListener('click', redoHistory);
    document.getElementById('qa-front')?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.bringToFront(); canvas.renderAll(); saveHistory(); }
    });
    document.getElementById('qa-back')?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (obj) {
            obj.sendToBack();
            // Asegurarse de que la prenda siempre quede debajo
            const garment = canvas.getObjects().find(o => o.isGarment);
            if (garment) canvas.sendToBack(garment);
            canvas.renderAll();
            saveHistory();
        }
    });
    // Botón de Capas
    document.getElementById('qa-layers')?.addEventListener('click', () => {
        const lyrSidebar = document.getElementById('layers-sidebar');
        lyrSidebar.classList.toggle('hidden');
        if (!lyrSidebar.classList.contains('hidden')) {
            renderLayersPanel();
        }
    });
    document.getElementById('btn-close-layers')?.addEventListener('click', () => {
        document.getElementById('layers-sidebar').classList.add('hidden');
    });
    // Botones del panel de capas
    document.getElementById('lyr-bring-front')?.addEventListener('click', () => {
        canvas?.getActiveObject()?.bringToFront(); canvas?.renderAll(); saveHistory(); renderLayersPanel();
    });
    document.getElementById('lyr-bring-fwd')?.addEventListener('click', () => {
        canvas?.getActiveObject()?.bringForward(); canvas?.renderAll(); saveHistory(); renderLayersPanel();
    });
    document.getElementById('lyr-send-bwd')?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (obj) {
            obj.sendBackwards();
            const garment = canvas.getObjects().find(o => o.isGarment);
            if (garment) canvas.sendToBack(garment);
            canvas.renderAll(); saveHistory(); renderLayersPanel();
        }
    });
    document.getElementById('lyr-send-back')?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (obj) {
            obj.sendToBack();
            const garment = canvas.getObjects().find(o => o.isGarment);
            if (garment) canvas.sendToBack(garment);
            canvas.renderAll(); saveHistory(); renderLayersPanel();
        }
    });
    document.getElementById('qa-flip-h')?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('flipX', !obj.flipX); canvas.renderAll(); }
    });
    document.getElementById('qa-flip-v')?.addEventListener('click', () => {
        const obj = canvas?.getActiveObject();
        if (obj) { obj.set('flipY', !obj.flipY); canvas.renderAll(); }
    });
    document.getElementById('qa-zoom-in')?.addEventListener('click', () => {
        if (!canvas) return;
        canvas.setZoom(Math.min(canvas.getZoom() * 1.15, 4));
    });
    document.getElementById('qa-zoom-out')?.addEventListener('click', () => {
        if (!canvas) return;
        canvas.setZoom(Math.max(canvas.getZoom() * 0.87, 0.3));
    });

    // ================================================
    // HISTORIAL (Undo / Redo)
    // ================================================
    window.saveHistory = function saveHistory() {
        if (!canvas) return;
        historyUndo.push(JSON.stringify(canvas.toJSON(['selectable','evented','isGarment'])));
        historyRedo = [];
        // Sincronizar textura en el visor 3D
        if (window.syncTextureTo3D) window.syncTextureTo3D();
    }

    function undoHistory() {
        if (!canvas || historyUndo.length < 2) return;
        historyRedo.push(historyUndo.pop());
        const prev = historyUndo[historyUndo.length - 1];
        canvas.loadFromJSON(prev, () => {
            // Re-marcar el objeto de prenda como no seleccionable
            canvas.getObjects().forEach((obj, i) => {
                if (i === 0 || obj.isGarment) {
                    obj.set({ selectable: false, evented: false, isGarment: true });
                }
            });
            canvas.renderAll();
            if (window.syncTextureTo3D) window.syncTextureTo3D();
        });
    }

    function redoHistory() {
        if (!canvas || historyRedo.length === 0) return;
        const next = historyRedo.pop();
        historyUndo.push(next);
        canvas.loadFromJSON(next, () => {
            canvas.getObjects().forEach((obj, i) => {
                if (i === 0 || obj.isGarment) {
                    obj.set({ selectable: false, evented: false, isGarment: true });
                }
            });
            canvas.renderAll();
            if (window.syncTextureTo3D) window.syncTextureTo3D();
        });
    }

    function ensureBgNotSelectable() {
        // El primer objeto siempre es el fondo de la prenda
        const objs = canvas.getObjects();
        if (objs.length > 0) {
            objs[0].set({ selectable: false, evented: false });
        }
    }

    // ================================================
    // VISTA 3D (Three.js)
    // ================================================
    const overlay3D = document.getElementById('3d-overlay');
    let viewer3DInitialized = false;

    document.getElementById('btn-toggle-3d')?.addEventListener('click', () => {
        overlay3D.classList.remove('hidden');

        const container = document.getElementById('3d-viewer-container');
        if (!viewer3DInitialized && window.Viewer3D) {
            window.Viewer3D.init(container);
            viewer3DInitialized = true;
        }
        const garmentId = document.getElementById('garment-selector')?.value;
        if (window.Viewer3D && garmentId) {
            window.Viewer3D.loadModel(garmentId);
        }
        if (window.syncTextureTo3D) window.syncTextureTo3D();
    });

    document.getElementById('btn-close-3d')?.addEventListener('click', () => {
        overlay3D.classList.add('hidden');
        // Ocultar panel de color 3D al cerrar
        const colorPanel = document.getElementById('panel-3d-color');
        if (colorPanel) colorPanel.style.display = 'none';
    });

    // Botones de zoom del visor 3D
    document.getElementById('btn-3d-zoom-in')?.addEventListener('click',  () => window.zoom3D?.(0.85));
    document.getElementById('btn-3d-zoom-out')?.addEventListener('click', () => window.zoom3D?.(1.18));

    // Conectar botones Frente/Espalda con rotación 3D
    document.getElementById('btn-side-front')?.addEventListener('click', () => {
        if (window.show3DFace) window.show3DFace('front');
    });
    document.getElementById('btn-side-back')?.addEventListener('click', () => {
        if (window.show3DFace) window.show3DFace('back');
    });

    // Escuchar cambios de cámara 3D para actualizar botones 2D
    window.on3DCameraSideChange = function(side) {
        if (side === 'front') {
            document.getElementById('btn-side-front')?.classList.add('active');
            document.getElementById('btn-side-back')?.classList.remove('active');
        } else {
            document.getElementById('btn-side-back')?.classList.add('active');
            document.getElementById('btn-side-front')?.classList.remove('active');
        }
    };

    // Cuando cambia la prenda, actualizar el modelo 3D si el visor está abierto
    document.getElementById('garment-selector')?.addEventListener('change', (e) => {
        if (viewer3DInitialized && !overlay3D.classList.contains('hidden') && window.Viewer3D) {
            window.Viewer3D.loadModel(e.target.value);
        }
    });

    // ================================================
    // GUARDAR DISEÑO
    // ================================================
    // Botón guardar diseño eliminado de aquí para usar el modal (al final del archivo)

    // ================================================
    // UTILIDADES
    // ================================================
    function rgbToHex(color) {
        if (!color || color === 'transparent') return '#000000';
        if (color.startsWith('#')) return color;
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(color);
        if (!result) return '#000000';
        return '#' + [result[1], result[2], result[3]]
            .map(n => parseInt(n).toString(16).padStart(2, '0'))
            .join('');
    }

    // ================================================
    // BURBUJA FLOTANTE (Posición / Capas / Fuentes)
    // ================================================
    const floatBubble     = document.getElementById('float-bubble');
    const fbubFontsList   = document.getElementById('fbub-fonts-list');
    const fbubFontSearch  = document.getElementById('fbub-font-search');
    const fbubLayersList  = document.getElementById('fbub-layers-list');

    // Cambiar tabs de la burbuja
    document.querySelectorAll('.fbub-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.fbub-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.fbub-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('fbub-' + tab.dataset.ftab).classList.add('active');
            if (tab.dataset.ftab === 'layers') renderLayersList();
            if (tab.dataset.ftab === 'fonts') renderFontsList();
        });
    });

    // Mostrar/ocultar burbuja según selección en canvas
    function showFloatBubble(obj) {
        if (!obj || obj.selectable === false) {
            floatBubble.classList.add('hidden');
            return;
        }
        floatBubble.classList.remove('hidden');
        syncPositionInputs(obj);
        const isText = obj.type === 'i-text' || obj.type === 'text';
        // Solo mostrar tab Fuentes si es texto
        const fontsTab = document.querySelector('.fbub-tab[data-ftab="fonts"]');
        if (fontsTab) fontsTab.style.display = isText ? '' : 'none';
    }

    function syncPositionInputs(obj) {
        if (!obj) return;
        const x = document.getElementById('fbub-x');
        const y = document.getElementById('fbub-y');
        const w = document.getElementById('fbub-w');
        const h = document.getElementById('fbub-h');
        const a = document.getElementById('fbub-angle');
        if (x) x.value = Math.round(obj.left || 0);
        if (y) y.value = Math.round(obj.top || 0);
        if (w) w.value = Math.round((obj.width || 0) * (obj.scaleX || 1));
        if (h) h.value = Math.round((obj.height || 0) * (obj.scaleY || 1));
        if (a) a.value = Math.round(obj.angle || 0);
    }

    // Conectar inputs de posición al canvas
    function fbubInputChange(id, setter) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            const obj = canvas?.getActiveObject();
            if (!obj || obj.selectable === false) return;
            
            const val = parseFloat(el.value);
            if (isNaN(val)) return;

            setter(obj, val);
            obj.setCoords();
            
            if (obj.isFrame && window.syncBezel) {
                window.syncBezel(obj);
            }
            
            canvas.renderAll();
            
            // Usar un debounce simple para el history si se quisiera, 
            // pero por ahora guardamos en cada cambio
            if (window.saveHistory) window.saveHistory();
        });
    }
    fbubInputChange('fbub-x', (obj, v) => obj.set('left', v));
    fbubInputChange('fbub-y', (obj, v) => obj.set('top', v));
    fbubInputChange('fbub-w', (obj, v) => { if (obj.width) obj.set('scaleX', v / obj.width); });
    fbubInputChange('fbub-h', (obj, v) => { if (obj.height) obj.set('scaleY', v / obj.height); });
    fbubInputChange('fbub-angle', (obj, v) => obj.set('angle', v));

    // Botones de alineación
    document.querySelectorAll('.fbub-align-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const obj = canvas?.getActiveObject();
            if (!obj || !canvas) return;
            const cW = canvas.width, cH = canvas.height;
            const oW = (obj.width || 0) * (obj.scaleX || 1);
            const oH = (obj.height || 0) * (obj.scaleY || 1);
            switch (btn.dataset.align) {
                case 'left':     obj.set({ left: 0, originX: 'left' }); break;
                case 'right':    obj.set({ left: cW - oW, originX: 'left' }); break;
                case 'center-h': obj.set({ left: cW / 2, originX: 'center' }); break;
                case 'top':      obj.set({ top: 0, originY: 'top' }); break;
                case 'bottom':   obj.set({ top: cH - oH, originY: 'top' }); break;
                case 'center-v': obj.set({ top: cH / 2, originY: 'center' }); break;
            }
            canvas.renderAll();
            syncPositionInputs(canvas.getActiveObject());
        });
    });

    // Actualizar posición en vivo al mover objetos
    function extendCanvasWithBubble() {
        if (!canvas) return;
        canvas.on('selection:created', e => showFloatBubble(e.selected?.[0]));
        canvas.on('selection:updated', e => showFloatBubble(e.selected?.[0]));
        canvas.on('selection:cleared', () => floatBubble.classList.add('hidden'));
        canvas.on('object:moving',   e => syncPositionInputs(e.target));
        canvas.on('object:scaling',  e => syncPositionInputs(e.target));
        canvas.on('object:rotating', e => syncPositionInputs(e.target));
    }
    
    // Renderizar lista de capas en el panel lateral
    function renderLayersPanel() {
        const list = document.getElementById('layers-panel-list');
        if (!canvas || !list) return;
        list.innerHTML = '';
        const objs = canvas.getObjects().slice().reverse();
        objs.forEach((obj) => {
            if (obj.isGarment || obj.selectable === false) return;
            const item = document.createElement('div');
            item.className = 'lyr-item';
            item.draggable = true;
            const isActive = canvas.getActiveObject() === obj;
            if (isActive) item.classList.add('active');

            // Icono según tipo
            let icon = 'fa-shapes';
            let label = 'Forma';
            if (obj.type === 'i-text' || obj.type === 'text') {
                icon  = 'fa-font';
                label = `"${(obj.text || '').substring(0, 14)}"`;
            } else if (obj.type === 'image') {
                icon  = 'fa-image';
                label = 'Imagen';
            } else if (obj.type === 'circle')   { icon = 'fa-circle'; label = 'Círculo'; }
            else if (obj.type === 'rect')        { icon = 'fa-square'; label = 'Rectángulo'; }
            else if (obj.type === 'triangle')    { icon = 'fa-play'; label = 'Triángulo'; }
            else if (obj.type === 'path')        { icon = 'fa-bezier-curve'; label = 'Trazo'; }
            else if (obj.type === 'group')       { icon = 'fa-object-group'; label = 'Grupo'; }

            // Vista previa de color
            const fillColor = (typeof obj.fill === 'string' && obj.fill !== 'none') ? obj.fill : '#aaa';

            item.innerHTML = `
                <div class="lyr-item-grip"><i class="fa-solid fa-grip-lines"></i></div>
                <div class="lyr-item-color" style="background:${fillColor};"></div>
                <i class="fa-solid ${icon} lyr-item-icon"></i>
                <span class="lyr-item-label">${label}</span>
                <button class="lyr-item-del" title="Eliminar">
                    <i class="fa-solid fa-xmark"></i>
                </button>`;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.lyr-item-del')) {
                    canvas.remove(obj);
                    canvas.renderAll();
                    saveHistory();
                    renderLayersPanel();
                    return;
                }
                canvas.setActiveObject(obj);
                canvas.renderAll();
                renderLayersPanel();
            });

            // Drag to reorder
            item.addEventListener('dragstart', () => item.classList.add('dragging'));
            item.addEventListener('dragend',   () => {
                item.classList.remove('dragging');
                // Reordenar objetos en canvas según orden visual del DOM
                const items = [...list.querySelectorAll('.lyr-item')];
                const allObjs = canvas.getObjects().filter(o => !o.isGarment && o.selectable !== false);
                const garment = canvas.getObjects().find(o => o.isGarment || o.selectable === false);
                canvas.clear();
                if (garment) canvas.add(garment);
                // Invertir porque la lista muestra de arriba=frente a abajo=fondo
                [...items].reverse().forEach(it => {
                    const idx = parseInt(it.dataset.objIdx);
                    if (!isNaN(idx) && allObjs[idx]) canvas.add(allObjs[idx]);
                });
                canvas.renderAll();
                saveHistory();
            });
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                const dragging = list.querySelector('.dragging');
                if (dragging && dragging !== item) {
                    const rect = item.getBoundingClientRect();
                    const mid = rect.top + rect.height / 2;
                    if (e.clientY < mid) item.parentNode.insertBefore(dragging, item);
                    else item.parentNode.insertBefore(dragging, item.nextSibling);
                }
            });

            // Guardar índice original para reordenar
            const objIdx = canvas.getObjects().filter(o => !o.isGarment && o.selectable !== false).reverse().indexOf(obj);
            item.dataset.objIdx = objIdx;

            list.appendChild(item);
        });
        if (list.innerHTML === '') {
            list.innerHTML = '<p style="color:var(--text-muted);font-size:12px;padding:16px;text-align:center;">No hay capas todavía</p>';
        }
    }

    // Renderizar lista de capas (burbuja flotante — compatibilidad hacia atrás)
    function renderLayersList() {
        renderLayersPanel(); // redirigir al nuevo panel
        if (!canvas || !fbubLayersList) return;
        fbubLayersList.innerHTML = '';
        const objs = canvas.getObjects().slice().reverse();
        objs.forEach((obj, idx) => {
            if (obj.selectable === false) return;
            const item = document.createElement('div');
            item.className = 'fbub-layer-item';
            const isActive = canvas.getActiveObject() === obj;
            if (isActive) item.classList.add('active');
            const label = obj.type === 'i-text' || obj.type === 'text'
                ? `T "${(obj.text || '').substring(0, 12)}"` : `${obj.type} #${objs.length - idx}`;
            item.innerHTML = `<span class="layer-icon"><i class="fa-solid fa-${obj.type === 'i-text' || obj.type === 'text' ? 'font' : 'shapes'}"></i></span><span class="layer-label">${label}</span>`;
            item.addEventListener('click', () => {
                canvas.setActiveObject(obj);
                canvas.renderAll();
                renderLayersList();
            });
            fbubLayersList.appendChild(item);
        });
        if (fbubLayersList.innerHTML === '') {
            fbubLayersList.innerHTML = '<p style="color:var(--text-muted);font-size:12px;padding:8px;">Sin capas</p>';
        }
    }

    // Actualizar panel de capas cuando cambia el canvas
    canvas && canvas.on('object:added',   () => { renderLayersPanel(); if (window.syncTextureTo3D) window.syncTextureTo3D(); });
    canvas && canvas.on('object:removed', () => { renderLayersPanel(); if (window.syncTextureTo3D) window.syncTextureTo3D(); });
    canvas && canvas.on('object:modified',() => { renderLayersPanel(); if (window.syncTextureTo3D) window.syncTextureTo3D(); });

    // ================================================
    // FUENTES PREMIUM
    // ================================================
    let PREMIUM_FONTS = null;
    let loadedFontFaces = new Set();

    async function loadPremiumFontsList() {
        if (PREMIUM_FONTS) return PREMIUM_FONTS;
        try {
            const res = await fetch('fonts-list.json?v=3');
            PREMIUM_FONTS = await res.json();
        } catch (e) {
            PREMIUM_FONTS = {};
        }
        return PREMIUM_FONTS;
    }

    async function renderFontsList(filter = '') {
        if (!fbubFontsList) return;
        const fonts = await loadPremiumFontsList();
        fbubFontsList.innerHTML = '';
        const entries = Object.entries(fonts).filter(([name]) =>
            !filter || name.toLowerCase().includes(filter.toLowerCase())
        );
        if (entries.length === 0) {
            fbubFontsList.innerHTML = '<p style="color:var(--text-muted);font-size:12px;padding:8px;">No encontrado</p>';
            return;
        }
        entries.slice(0, 60).forEach(([name, path]) => {
            const item = document.createElement('div');
            item.className = 'fbub-font-item';
            item.textContent = name;
            item.dataset.fontName = name;
            item.dataset.fontPath = path;
            item.addEventListener('click', async () => {
                await applyPremiumFont(name, path);
                document.querySelectorAll('.fbub-font-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
            // Mostrar la fuente en sí misma si ya está cargada
            if (loadedFontFaces.has(name)) item.style.fontFamily = name;
            fbubFontsList.appendChild(item);
        });
    }

    async function applyPremiumFont(fontName, fontPath) {
        const obj = canvas?.getActiveObject();
        if (!obj || (obj.type !== 'i-text' && obj.type !== 'text')) return;

        // Cargar la fuente si no está cargada
        if (!loadedFontFaces.has(fontName)) {
            try {
                const ff = new FontFace(fontName, `url('${fontPath}')`);
                await ff.load();
                document.fonts.add(ff);
                loadedFontFaces.add(fontName);
            } catch (e) {
                console.warn('No se pudo cargar la fuente:', fontName, e);
                return;
            }
        }
        obj.set('fontFamily', fontName);
        canvas.renderAll();
        saveHistory();
        // También sincronizar con el selector del panel izquierdo si existe
        const sel = document.getElementById('prop-font-family');
        if (sel) {
            // Agregar opción si no existe
            let opt = Array.from(sel.options).find(o => o.value === fontName);
            if (!opt) {
                opt = document.createElement('option');
                opt.value = fontName;
                opt.textContent = fontName;
                sel.appendChild(opt);
            }
            sel.value = fontName;
        }
    }

    fbubFontSearch?.addEventListener('input', () => {
        renderFontsList(fbubFontSearch.value);
    });

    // ================================================
    // LOCAL STORAGE (AUTO-GUARDADO Y MIS DISEÑOS)
    // ================================================
    let currentProjectId = 'proj_' + Date.now();

    function autoSaveToLocal() {
        if (!canvas) return;
        // Sincronizar el lienzo actual al estado global antes de guardar
        designState[currentSide] = JSON.stringify(canvas.toJSON(['selectable', 'evented']));
        
        const preview = canvas.toDataURL({ format: 'png', multiplier: 0.2 });
        const designs = JSON.parse(localStorage.getItem('vexel-designs') || '[]');
        
        const saveObj = {
            id: currentProjectId,
            name: 'Diseño ' + new Date(parseInt(currentProjectId.split('_')[1])).toLocaleString(),
            state: designState, // Guardamos ambas caras
            garment: document.getElementById('garment-selector')?.value || 'shirt-short',
            preview: preview,
            date: new Date().toISOString()
        };

        const existingIdx = designs.findIndex(d => d.id === saveObj.id);
        if (existingIdx >= 0) designs[existingIdx] = saveObj;
        else {
            designs.unshift(saveObj); // Agregar al inicio
            if (designs.length > 20) designs.pop(); // Mantener un historial de 20 diseños
        }

        localStorage.setItem('vexel-designs', JSON.stringify(designs));
    }

    // Interceptar saveHistory para auto-guardar
    const originalSaveHistory = window.saveHistory;
    window.saveHistory = function() {
        if (originalSaveHistory) originalSaveHistory();
        autoSaveToLocal();
    };

    window.renderMyDesigns = function() {
        const feed = document.getElementById('mydesigns-feed');
        if (!feed) return;
        const designs = JSON.parse(localStorage.getItem('vexel-designs') || '[]');
        if (designs.length === 0) {
            feed.innerHTML = '<p class="empty-state"><i class="fa-regular fa-folder-open"></i><br>Aún no tienes diseños guardados</p>';
            return;
        }

        feed.innerHTML = '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px;">' +
            designs.map(d => `
                <div class="design-card" data-id="${d.id}" style="background:var(--bg-surface); border:1px solid var(--border); border-radius:8px; padding:8px; cursor:pointer;">
                    <img src="${d.preview}" style="width:100%; border-radius:4px; aspect-ratio: 1; object-fit: contain; background:#fff; pointer-events:none;">
                    <p style="color:var(--text); font-size:13px; margin-top:8px; text-align:center; font-weight:600; pointer-events:none;">${d.name}</p>
                    <p style="color:var(--text-muted); font-size:11px; text-align:center; pointer-events:none;">${new Date(d.date).toLocaleDateString()}</p>
                </div>
            `).join('') + '</div>';
    };

    document.getElementById('mydesigns-feed')?.addEventListener('click', (e) => {
        const card = e.target.closest('.design-card');
        if (!card) return;
        const id = card.getAttribute('data-id');
        const designs = JSON.parse(localStorage.getItem('vexel-designs') || '[]');
        const d = designs.find(x => String(x.id) === String(id));
        if (d && canvas) {
            try {
                // Restaurar el ID del proyecto actual y el estado completo
                currentProjectId = d.id;
                designState = d.state || { front: d.json, back: null }; // d.json por compatibilidad con diseños viejos
                window.designState = designState;
                
                // Actualizar la prenda seleccionada
                const sel = document.getElementById('garment-selector');
                if (sel && d.garment) sel.value = d.garment;

                // Forzar ir a la vista Frontal
                currentSide = 'front';
                window.currentSide = currentSide;
                document.getElementById('btn-side-front')?.classList.add('active');
                document.getElementById('btn-side-back')?.classList.remove('active');

                const frontState = designState.front;
                if (frontState) {
                    canvas.loadFromJSON(frontState, () => {
                        // Restaurar flag isGarment
                        const garment = canvas.getObjects().find(o => o.isGarment) || 
                                        canvas.getObjects().find(o => o.type === 'group' && o.selectable === false);
                        if (garment) garment.set({ isGarment: true, evented: true, selectable: false });

                        canvas.renderAll();
                        activateNav(null);
                        
                        if (window.syncTextureTo3D) {
                            setTimeout(() => window.syncTextureTo3D(), 50);
                        }

                        showLoader(() => showView('view-editor'), 700);
                    });
                }
            } catch (err) {
                console.error("Error cargando diseño:", err);
                alert("Hubo un error al cargar este diseño. Puede estar corrupto.");
            }
        }
    });

    // ================================================
    // NOTIFICACIONES INSISTENTES (FAKE PUSH)
    // ================================================
    const btnReqNotif = document.getElementById('btn-request-notifications');
    let fakeNotifInterval;

    function spawnFakeNotification() {
        if (Notification.permission === 'granted') {
            const msgs = [
                "¡Tu diseño actual se ve genial! ¿Por qué no lo exportas?",
                "La IA de Vexel 3D está lista para ayudarte.",
                "Recuerda que tus diseños se autoguardan.",
                "Vexel 3D: Sigue creando prendas increíbles.",
                "¿Ya probaste cambiar el color de acento en configuración?",
                "¡No olvides revisar tu diseño en 3D!"
            ];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            new Notification("Vexel 3D", { body: msg, icon: "imagenes de la app/isologo.png" });
        }
    }

    if (btnReqNotif) {
        btnReqNotif.addEventListener('click', () => {
            if (!("Notification" in window)) {
                alert("Este navegador no soporta notificaciones de escritorio.");
                return;
            }
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Vexel 3D", { body: "¡Notificaciones activadas exitosamente!", icon: "imagenes de la app/isologo.png" });
                    if (!fakeNotifInterval) fakeNotifInterval = setInterval(spawnFakeNotification, 5 * 60 * 1000); // Cada 5 mins
                }
            });
        });
        
        if (Notification.permission === 'granted') {
            if (!fakeNotifInterval) fakeNotifInterval = setInterval(spawnFakeNotification, 5 * 60 * 1000);
        }
    }

    // Toast interno
    function showToast(msg) {
        let t = document.getElementById('vex-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'vex-toast';
            t.style.cssText = 'position:fixed; bottom:20px; right:20px; background:var(--accent); color:#fff; padding:12px 20px; border-radius:8px; z-index:99999; font-family:Inter; font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.3); transition: opacity 0.3s; pointer-events:none;';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.style.opacity = '1';
        setTimeout(() => t.style.opacity = '0', 3000);
    }

    // ================================================
    // INSTALAR PWA
    // ================================================
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    const btnInstall = document.getElementById('btn-install-pwa');
    if (btnInstall) {
        btnInstall.addEventListener('click', () => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                alert("En iOS: Toca el ícono de Compartir (flecha hacia arriba) y luego selecciona 'Agregar a Inicio'.");
                return;
            }
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            } else {
                alert("La aplicación ya está instalada o tu navegador no soporta instalación directa (usa la opción de agregar a pantalla de inicio del navegador).");
            }
        });
    }

    // ================================================
    // MODAL DE EXPORTACIÓN Y FORMATOS
    // ================================================
    const btnSaveDesign = document.getElementById('btn-save-design');
    const exportModal = document.getElementById('export-modal');
    const closeExport = document.getElementById('close-export-modal');
    const prodForm = document.getElementById('export-production-form');
    const btnConfirmExport = document.getElementById('btn-confirm-export');
    let currentExportFormat = '';

    if (btnSaveDesign) {
        btnSaveDesign.addEventListener('click', () => {
            autoSaveToLocal();
            showToast("Diseño guardado en local");
            if (exportModal) exportModal.classList.remove('hidden');
        });
    }

    if (closeExport) {
        closeExport.addEventListener('click', () => {
            exportModal.classList.add('hidden');
            prodForm.classList.add('hidden');
        });
    }

    document.querySelectorAll('.export-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const format = btn.dataset.format;
            currentExportFormat = format;

            document.querySelectorAll('.export-opt-btn').forEach(b => b.style.borderColor = 'var(--border)');
            btn.style.borderColor = 'var(--accent)';

            if (format === 'jpg' || format === 'json') {
                prodForm.classList.remove('hidden');
                document.getElementById('form-required-badge').textContent = format === 'json' ? '(Obligatorio)' : '(Opcional)';
            } else {
                prodForm.classList.add('hidden');
                executeExport(format);
            }
        });
    });

    if (btnConfirmExport) {
        btnConfirmExport.addEventListener('click', () => {
            const fabric = document.getElementById('prod-fabric').value;
            const size = document.getElementById('prod-size').value;
            
            if (currentExportFormat === 'json') {
                if (!fabric || !size) {
                    alert("Para el JSON de producción, Tela y Talla son obligatorios.");
                    return;
                }
            }
            executeExport(currentExportFormat, {
                fabric: fabric || 'No especificado',
                size: size || 'No especificado',
                desc: document.getElementById('prod-desc').value || ''
            });
        });
    }

    function executeExport(format, prodData = null) {
        if (!canvas) return;
        let dataUrl, ext, type;

        if (format === 'png') {
            dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
            downloadFile(dataUrl, 'vexel_design.png');
            finishExport();
        } 
        else if (format === 'svg') {
            const svgStr = canvas.toSVG();
            dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
            downloadFile(dataUrl, 'vexel_design.svg');
            finishExport();
        }
        else if (format === 'png3d') {
            // Capturar el renderer Three.js directamente
            const viewer = document.getElementById('3d-viewer-container');
            const threeCanvas = viewer ? viewer.querySelector('canvas') : null;
            if (!threeCanvas) {
                showToast('Abre la Vista 3D primero para capturar el modelo.');
                if (exportModal) exportModal.classList.add('hidden');
                return;
            }
            // Forzar un render antes de capturar
            if (window.Viewer3D && window.Viewer3D.sync) window.Viewer3D.sync();
            setTimeout(() => {
                const png3dUrl = threeCanvas.toDataURL('image/png');
                downloadFile(png3dUrl, 'vexel_3d.png');
                finishExport();
            }, 200);
        }
        else if (format === 'ghibli') {
            // Estilo Ghibli: captura 3D + filtro acuarela/sepia cálido
            const viewer = document.getElementById('3d-viewer-container');
            const threeCanvas = viewer ? viewer.querySelector('canvas') : null;

            // Usar canvas 2D si 3D no está disponible
            const sourceCanvas = threeCanvas || canvas.getElement();
            if (window.Viewer3D && window.Viewer3D.sync) window.Viewer3D.sync();

            setTimeout(() => {
                const img = new Image();
                img.onload = () => {
                    const tc = document.createElement('canvas');
                    tc.width  = img.width;
                    tc.height = img.height;
                    const ctx = tc.getContext('2d');

                    // Dibujar imagen base
                    ctx.drawImage(img, 0, 0);

                    // ── Filtro Ghibli 1: Overlay de luz cálida ──
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.fillStyle = 'rgba(255, 240, 200, 0.35)';
                    ctx.fillRect(0, 0, tc.width, tc.height);

                    // ── Filtro Ghibli 2: Añadir textura de papel (ruido suave) ──
                    ctx.globalCompositeOperation = 'source-over';
                    const imageData = ctx.getImageData(0, 0, tc.width, tc.height);
                    const d = imageData.data;
                    for (let i = 0; i < d.length; i += 4) {
                        // Sepia suave
                        const r = d[i], g = d[i+1], b = d[i+2];
                        d[i]   = Math.min(255, r * 0.85 + g * 0.15 + b * 0.06 + 20);
                        d[i+1] = Math.min(255, r * 0.07 + g * 0.88 + b * 0.05 + 10);
                        d[i+2] = Math.min(255, r * 0.04 + g * 0.06 + b * 0.89 - 10);
                        // Ruido de papel
                        const noise = (Math.random() - 0.5) * 18;
                        d[i]   = Math.min(255, Math.max(0, d[i]   + noise));
                        d[i+1] = Math.min(255, Math.max(0, d[i+1] + noise));
                        d[i+2] = Math.min(255, Math.max(0, d[i+2] + noise));
                    }
                    ctx.putImageData(imageData, 0, 0);

                    // ── Filtro Ghibli 3: Borde desenfocado / viñeta ──
                    const grad = ctx.createRadialGradient(
                        tc.width/2, tc.height/2, tc.height * 0.35,
                        tc.width/2, tc.height/2, tc.height * 0.85
                    );
                    grad.addColorStop(0, 'rgba(0,0,0,0)');
                    grad.addColorStop(1, 'rgba(120,80,30,0.35)');
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, tc.width, tc.height);

                    // ── Marca de agua Vexel sutil ──
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.font = 'bold 14px Inter, sans-serif';
                    ctx.fillStyle = 'rgba(255,255,255,0.25)';
                    ctx.fillText('✦ Vexel 3D — Ghibli Style', 20, tc.height - 20);

                    downloadFile(tc.toDataURL('image/png'), 'vexel_ghibli.png');
                    finishExport();
                };
                img.src = sourceCanvas.toDataURL('image/png');
            }, 250);
        }
        else if (format === 'json') {
            const json = canvas.toJSON(['id', 'isGarment', 'isGarmentZone', 'selectable']);
            const out = {
                metadata: {
                    app: "Vexel 3D",
                    version: "2.0.1",
                    date: new Date().toISOString(),
                    production: prodData
                },
                design: json
            };
            dataUrl = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(out, null, 2));
            downloadFile(dataUrl, 'vexel_production.json');
            finishExport();
        }
        else if (format === 'jpg') {
            // Generar JPG base
            const baseJpgUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.95, multiplier: 2, enableRetinaScaling: true });
            if (!prodData || (prodData.fabric === 'No especificado' && prodData.size === 'No especificado' && !prodData.desc)) {
                // Sin form, descarga directa
                downloadFile(baseJpgUrl, 'vexel_design.jpg');
                finishExport();
                return;
            }

            // Con form: Dibujar la credencial en la esquina
            const img = new Image();
            img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const localProxyUrl = `http://localhost:8001/api/proxy?url=${encodeURIComponent(a.url)}`;
                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Dibujar caja de credencial bonita en la esquina inferior derecha
                const pad = 30;
                const boxW = 350;
                const boxH = 120;
                const x = tempCanvas.width - boxW - pad;
                const y = tempCanvas.height - boxH - pad;

                ctx.save();
                ctx.globalAlpha = 0.85;
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetY = 5;
                
                // Rounded rect
                ctx.beginPath();
                ctx.roundRect(x, y, boxW, boxH, 16);
                ctx.fill();
                
                // Borde de acento
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#7c3aed';
                ctx.stroke();

                ctx.restore();

                // Texto
                ctx.fillStyle = '#1e1e2e';
                ctx.font = 'bold 18px Inter, sans-serif';
                ctx.fillText('VEXEL 3D - DATOS DE PRODUCCIÓN', x + 20, y + 30);
                
                ctx.font = '16px Inter, sans-serif';
                ctx.fillStyle = '#333333';
                ctx.fillText(`Tela: ${prodData.fabric}`, x + 20, y + 60);
                ctx.fillText(`Talla: ${prodData.size}`, x + 20, y + 80);
                if (prodData.desc) {
                    ctx.font = 'italic 14px Inter, sans-serif';
                    ctx.fillStyle = '#666666';
                    let shortDesc = prodData.desc.length > 40 ? prodData.desc.substring(0,37)+'...' : prodData.desc;
                    ctx.fillText(`Notas: ${shortDesc}`, x + 20, y + 105);
                }

                downloadFile(tempCanvas.toDataURL('image/jpeg', 0.95), 'vexel_production.jpg');
                finishExport();
            };
            img.src = baseJpgUrl;
        }
    }

    function downloadFile(dataUrl, filename) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function finishExport() {
        showToast("¡Exportación completada!");
        if (exportModal) exportModal.classList.add('hidden');
        prodForm.classList.add('hidden');
        currentExportFormat = '';
        document.querySelectorAll('.export-opt-btn').forEach(b => b.style.borderColor = 'var(--border)');
    }

});
