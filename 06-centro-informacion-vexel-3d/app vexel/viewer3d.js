/* ============================================================
   VEXEL 3D - viewer3d.js
   Motor Three.js r128 — MeshBasicMaterial, color blanco puro
   ============================================================ */

(function() {
    'use strict';

    const GARMENT_3D_MAP = {
        'shirt-short':     'modelos 3d camisas/camisa Manga Corta en 3D.glb',
        'shirt-long':      'modelos 3d camisas/camisa manga larga.glb',
        'shirt-sleeveless':'modelos 3d camisas/camisa sin mangas.glb',
        'shirt-collar':    'modelos 3d camisas/Camisa con cuello.glb',
        'shirt-polo':      'modelos 3d camisas/camisa con cuello manga larga.glb',
        'pants-long':      'modelos 3d pantalones/pantalon.glb',
        'pants-short':     'modelos 3d pantalones/ahorts.glb',
    };

    let scene, camera, renderer, controls, currentModel;
    let container3d = null;
    let isInitialized = false;
    let canvasTexture = null;
    let textureNeedsUpdate = false;
    let animFrameId = null;
    let currentSideIs3DFront = true;
    let colorModeActive = false; // true = usuario eligió color plano, no sobreescribir con textura

    // ─── Init ───────────────────────────────────────────────
    function init3D(containerEl) {
        if (isInitialized) return;
        isInitialized = true;
        container3d = containerEl;

        const W = container3d.clientWidth  || 560;
        const H = container3d.clientHeight || 680;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        camera = new THREE.PerspectiveCamera(45, W / H, 0.01, 100);
        camera.position.set(0, 0, 4);

        // Renderer sin ningún toneMapping para colores reales
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping    = THREE.NoToneMapping;
        container3d.appendChild(renderer.domElement);

        // MeshBasicMaterial NO necesita luces, pero las añadimos igual
        // por si hay submateriales en el GLB que las usen
        scene.add(new THREE.AmbientLight(0xffffff, 3));
        const d1 = new THREE.DirectionalLight(0xffffff, 3); d1.position.set(0,1,5);  scene.add(d1);
        const d2 = new THREE.DirectionalLight(0xffffff, 3); d2.position.set(0,1,-5); scene.add(d2);
        const d3 = new THREE.DirectionalLight(0xffffff, 2); d3.position.set(5,0,0);  scene.add(d3);
        const d4 = new THREE.DirectionalLight(0xffffff, 2); d4.position.set(-5,0,0); scene.add(d4);
        const d5 = new THREE.DirectionalLight(0xffffff, 2); d5.position.set(0,5,0);  scene.add(d5);

        // OrbitControls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping  = true;
        controls.dampingFactor  = 0.08;
        controls.enableZoom     = true;
        controls.zoomSpeed      = 1.0;
        controls.minDistance    = 1.5;
        controls.maxDistance    = 6.0;
        controls.enablePan      = false;
        controls.target.set(0, 0, 0);
        controls.mouseButtons   = { LEFT: null, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
        controls.touches        = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

        controls.addEventListener('change', () => {
            const angle = controls.getAzimuthalAngle();
            const front = Math.abs(angle) < Math.PI / 2;
            if (front !== currentSideIs3DFront) {
                currentSideIs3DFront = front;
                if (window.on3DCameraSideChange) window.on3DCameraSideChange(front ? 'front' : 'back');
            }
        });

        // Resize
        new ResizeObserver(() => {
            const w = container3d.clientWidth, h = container3d.clientHeight;
            if (w === 0 || h === 0) return; // Prevenir NaN en camera.aspect al ocultar el div
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }).observe(container3d);

        // Clic-to-color removido de la vista 3D (el visor 3D es solo para visualizar el diseño 2D)
        // OrbitControls se mantiene activo para poder rotar/escalar libremente.


        // Loop
        (function animate() {
            animFrameId = requestAnimationFrame(animate);
            controls.update();
            if (canvasTexture && textureNeedsUpdate) {
                canvasTexture.needsUpdate = true;
                textureNeedsUpdate = false;
            }
            renderer.render(scene, camera);
        })();

        console.log('[3D] Three.js inicializado ✓');
    }

    let currentModelId = null;

    // ─── Cargar Modelo (GLTF/GLB) ───────────────────────────
    function loadModel(garmentId) {
        if (currentModelId === garmentId && currentModel) return; // Ya está cargado

        const path = GARMENT_3D_MAP[garmentId];
        if (!path) { showNoModelMessage(); return; }
        
        if (currentModel) { scene.remove(currentModel); currentModel = null; }
        currentModelId = garmentId;

        console.log('[3D] Cargando:', path);
        new THREE.GLTFLoader().load(
            path,
            function(gltf) {
                const root = gltf.scene;

                // Centrar en origen
                const box    = new THREE.Box3().setFromObject(root);
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = box.getSize(new THREE.Vector3()).length();
                root.position.sub(center);

                // Grupo padre para escalar
                currentModel = new THREE.Group();
                currentModel.add(root);
                currentModel.scale.setScalar(2.8 / maxDim);

                // Aplicar material blanco puro ANTES de añadir a la escena
                paintWhite(currentModel);

                scene.add(currentModel);
                camera.position.set(0, 0, 4);
                controls.target.set(0, 0, 0);
                controls.update();
                
                // Aplicar la textura del lienzo de inmediato
                if (window.syncTextureTo3D) {
                    window.syncTextureTo3D();
                }
                
                console.log('[3D] Modelo listo ✓');
            },
            null,
            err => { console.error('[3D] Error:', err); showNoModelMessage(); }
        );
    }

    // ─── Material: blanco puro + textura canvas ─────────────
    function paintWhite(model) {
        // Al cargar: SOLO color blanco puro, sin textura del canvas todavía
        // La textura se aplica después via syncTextureTo3D()
        model.traverse(node => {
            if (!node.isMesh) return;
            node.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                toneMapped: false,
                transparent: false,
                opacity: 1.0,
                depthWrite: true
            });
            node.material.needsUpdate = true;
        });
    }

    // ─── Sincronizar textura canvas → modelo ──────────────
    function syncTextureTo3D() {
        if (!isInitialized || !currentModel) return;

        // Renderizar el lienzo actual (Frente o Espalda)
        let currentTex = new THREE.CanvasTexture(window.canvas.getElement());
        currentTex.encoding = THREE.sRGBEncoding;
        currentTex.flipY = false;

        let mapFront = window.currentSide === 'front' ? currentTex : null;
        let mapBack  = window.currentSide === 'back'  ? currentTex : null;

        // Extraer el JSON del otro lado
        let otherSideName = window.currentSide === 'front' ? 'back' : 'front';
        let otherSideJsonStr = window.designState?.[otherSideName];
        let otherSideJson = null;
        try {
            if (otherSideJsonStr) otherSideJson = JSON.parse(otherSideJsonStr);
        } catch(e) {}

        if (otherSideJson) {
            // Generar el otro lado en un canvas invisible
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = window.canvas.width;
            tempCanvas.height = window.canvas.height;
            let fabricTemp = new fabric.StaticCanvas(tempCanvas);
            fabricTemp.loadFromJSON(otherSideJson, () => {
                let tempTex = new THREE.CanvasTexture(tempCanvas);
                tempTex.encoding = THREE.sRGBEncoding;
                tempTex.flipY = false;
                
                if (window.currentSide === 'front') {
                    mapBack = tempTex;
                } else {
                    mapFront = tempTex;
                }
                applyDoubleSidedTextures(mapFront, mapBack);
            });
        } else {
            // Si el otro lado no tiene nada modificado, usamos el actual para ambos como fallback
            if (window.currentSide === 'front') mapBack = currentTex;
            else mapFront = currentTex;
            applyDoubleSidedTextures(mapFront, mapBack);
        }
    }

    function applyDoubleSidedTextures(mapFront, mapBack) {
        if (!currentModel) return;
        
        currentModel.traverse(node => {
            if (node.isMesh && node.material) {
                const mat = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide
                });

                mat.onBeforeCompile = function(shader) {
                    shader.uniforms.mapFront = { value: mapFront };
                    shader.uniforms.mapBack = { value: mapBack };

                    // Añadir normal local
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <common>',
                        `
                        #include <common>
                        varying vec3 vLocalNormal;
                        `
                    );
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <beginnormal_vertex>',
                        `
                        #include <beginnormal_vertex>
                        vLocalNormal = objectNormal;
                        `
                    );

                    // Reemplazar la mezcla en el fragment shader
                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <common>',
                        `
                        #include <common>
                        varying vec3 vLocalNormal;
                        uniform sampler2D mapFront;
                        uniform sampler2D mapBack;
                        `
                    );

                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <map_fragment>',
                        `
                        #ifdef USE_MAP
                            vec4 texelFront = texture2D( mapFront, vUv );
                            // Invertir X para la espalda para que no se vea reflejado
                            vec2 backUv = vec2(1.0 - vUv.x, vUv.y);
                            vec4 texelBack = texture2D( mapBack, backUv );
                            
                            // vLocalNormal.z > 0 indica la parte delantera de la prenda
                            // Mezclamos suavemente en las costuras laterales (-0.1 a 0.1)
                            float blend = smoothstep(-0.1, 0.1, vLocalNormal.z);
                            
                            vec4 texelColor = mix(texelBack, texelFront, blend);
                            diffuseColor *= texelColor;
                        #endif
                        `
                    );
                };

                // Truco para que ThreeJS compile el shader con la macro USE_MAP
                mat.map = mapFront;
                mat.needsUpdate = true;
                node.material = mat;
            }
        });
        textureNeedsUpdate = true;
    }

    window.syncTextureTo3D = syncTextureTo3D;

    // ─── Color de prenda 3D (aplica al material Y al 2D) ─────
    let current3DColor = '#ffffff';
    // (colorModeActive ya declarado arriba)

    function applyColorTo3D(hexColor) {
        // Redirigir el color al editor 2D
        if (window.applyGarmentColor) {
            window.applyGarmentColor(hexColor, null, true);
        }
    }

    function setup3DColorPanel() {
        // El panel de colores 3D ha sido desactivado
    }

    // Exponer para uso externo
    window.applyColorTo3D = applyColorTo3D;

    // ─── Rotar cámara frente/espalda ───────────────────────
    function showFace(side) {
        if (!controls || !camera) return;
        currentSideIs3DFront = (side === 'front');
        const target = side === 'front' ? 0 : Math.PI;
        const start  = controls.getAzimuthalAngle();
        let d = target - start;
        if (d >  Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        let t = 0;
        (function tween() {
            t = Math.min(t + 0.06, 1);
            const a  = start + d * t;
            const r  = Math.max(camera.position.length(), 1.5);
            const po = controls.getPolarAngle();
            camera.position.set(r * Math.sin(po) * Math.sin(a), r * Math.cos(po), r * Math.sin(po) * Math.cos(a));
            controls.update();
            if (t < 1) requestAnimationFrame(tween);
        })();
    }
    window.show3DFace = showFace;

    function zoom3D(factor) {
        if (!camera || !controls) return;
        const len     = Math.min(Math.max(camera.position.length() * factor, controls.minDistance), controls.maxDistance);
        camera.position.setLength(len);
        controls.update();
    }
    window.zoom3D = zoom3D;

    function showNoModelMessage() {
        if (!container3d) return;
        if (container3d.querySelector('.no-model-msg')) return;
        const msg = document.createElement('div');
        msg.className = 'no-model-msg';
        msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#a78bfa;text-align:center;font-family:Inter,sans-serif;pointer-events:none;';
        msg.innerHTML = '<i class="fa-solid fa-cube" style="font-size:48px;opacity:0.4;"></i><br><br>Modelo 3D no disponible para esta prenda';
        container3d.appendChild(msg);
    }

    window.Viewer3D = { init: init3D, loadModel, sync: syncTextureTo3D, showFace, zoom: zoom3D };

    // Inicializar el panel de colores al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup3DColorPanel);
    } else {
        setup3DColorPanel();
    }

    console.log('[3D] viewer3d.js cargado ✓');
})();

