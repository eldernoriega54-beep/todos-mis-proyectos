// ============================================================
// MOTOR DE MARCOS DE VEXEL 3D — Estilo Canva Real
// v2.0: Drop-into-frame verdadero, formas básicas, dispositivos
// ============================================================

(function() {
'use strict';

// ─── Abrir/Cerrar Modal ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const marcosModal = document.getElementById('marcos-modal');
    const toolMarcos  = document.getElementById('tool-marcos');
    const closeBtn    = document.getElementById('close-marcos-modal');

    if (toolMarcos)  toolMarcos.addEventListener('click',  () => marcosModal?.classList.remove('hidden'));
    if (closeBtn)    closeBtn.addEventListener('click',    () => marcosModal?.classList.add('hidden'));
    if (marcosModal) marcosModal.addEventListener('click', (e) => { if (e.target === marcosModal) marcosModal.classList.add('hidden'); });

    // ─── Vincular botones del modal ──────────────────────────
    document.querySelectorAll('.marco-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.getAttribute('data-shape');
            addFrameToCanvas(shape);
            marcosModal?.classList.add('hidden');
        });
    });

    // ─── Escuchar canvas cuando esté listo ───────────────────
    waitForCanvas();
});

// ─── Esperar al canvas de Fabric ─────────────────────────
function waitForCanvas() {
    if (window.canvas) {
        setupDropListeners();
    } else {
        setTimeout(waitForCanvas, 200);
    }
}

// ─── Crear Marco en Fabric.js ────────────────────────────
function addFrameToCanvas(shape) {
    const c = window.canvas;
    if (!c) return;
    buildFrame(c, shape, c.width / 2, c.height / 2);
}

function buildFrame(c, shape, cx, cy) {
    /* Genera el contenedor de marco con clip path y un placeholder degradado.
       Retorna el objeto fabric que se añade al lienzo. */
    
    let W, H, rx = 0;
    
    // ── Dimensiones según tipo ────────────────────────────
    switch (shape) {
        case 'circle':    W = 160; H = 160; break;
        case 'square':    W = 160; H = 160; rx = 12; break;
        case 'landscape': W = 220; H = 140; rx = 8; break;
        case 'portrait':  W = 140; H = 210; rx = 8; break;
        case 'cellphone': W = 104; H = 200; rx = 20; break;
        case 'laptop':    W = 240; H = 155; rx = 5; break;
        case 'tablet':    W = 130; H = 185; rx = 8; break;
        case 'monitor':   W = 260; H = 170; rx = 4; break;
        case 'film':      W = 180; H = 220; rx = 4; break;
        case 'polaroid':  W = 160; H = 200; rx = 4; break;
        case 'triangle':  W = 180; H = 160; break;
        case 'hexagon':   W = 160; H = 160; break;
        case 'diamond':   W = 150; H = 150; break;
        default:          W = 160; H = 160; rx = 8;
    }

    // ── Crear clipPath (máscara de recorte) ───────────────
    let clipShape;
    const clipOpts = { originX: 'center', originY: 'center', left: 0, top: 0 };
    
    if (shape === 'circle') {
        clipShape = new fabric.Circle({
            radius: W / 2,
            ...clipOpts
        });
    } else if (shape === 'triangle') {
        clipShape = new fabric.Triangle({
            width: W, height: H,
            ...clipOpts
        });
    } else if (shape === 'hexagon') {
        const hw = W / 2, hh = H / 2;
        clipShape = new fabric.Polygon([
            { x: hw,       y: 0 },
            { x: W,        y: hh * 0.5 },
            { x: W,        y: hh * 1.5 },
            { x: hw,       y: H },
            { x: 0,        y: hh * 1.5 },
            { x: 0,        y: hh * 0.5 }
        ], clipOpts);
    } else if (shape === 'diamond') {
        const hw = W / 2, hh = H / 2;
        clipShape = new fabric.Polygon([
            { x: hw, y: 0 },
            { x: W,  y: hh },
            { x: hw, y: H },
            { x: 0,  y: hh }
        ], clipOpts);
    } else {
        clipShape = new fabric.Rect({
            width: W, height: H,
            rx: rx, ry: rx,
            ...clipOpts
        });
    }

    // ── Placeholder (fondo con gradiente simulado) ────────
    const placeholder = new fabric.Rect({
        width: W, height: H,
        fill: '#b8d8e8', // Un color celeste sólido estilo cielo (más confiable que el gradiente en Fabric)
        originX: 'left', originY: 'top',
        left: 0, top: 0,
        selectable: false, evented: false
    });

    // ── Ícono de "soltar imagen aquí" ─────────────────────
    const iconText = new fabric.Text('⬇', {
        fontSize: 28,
        fill: 'rgba(255,255,255,0.5)',
        originX: 'center', originY: 'center',
        left: W / 2, top: H / 2 - 10,
        selectable: false, evented: false
    });
    const hintText = new fabric.Text('Arrastra una imagen', {
        fontSize: 10,
        fill: 'rgba(255,255,255,0.4)',
        originX: 'center', originY: 'center',
        left: W / 2, top: H / 2 + 20,
        selectable: false, evented: false,
        fontFamily: 'Inter, sans-serif'
    });

    // ── Grupo base del marco ──────────────────────────────
    const frameGroup = new fabric.Group([placeholder, iconText, hintText], {
        left: cx - W / 2,
        top:  cy - H / 2,
        clipPath: clipShape,
        hasRotatingPoint: true
    });

    // ── Metadatos de marco ────────────────────────────────
    frameGroup.isFrame     = true;
    frameGroup.frameShape  = shape;
    frameGroup.frameW      = W;
    frameGroup.frameH      = H;
    frameGroup.frameRx     = rx;
    frameGroup._hasImage   = false;    // true cuando ya tiene imagen colocada

    // ── Bezel externo (decoración visual) ────────────────
    const bezel = makeBezel(shape, W, H, rx);
    if (bezel) {
        bezel.left = frameGroup.left;
        bezel.top  = frameGroup.top;
        bezel.selectable = false;
        bezel.evented    = false;
        bezel._bezelFor  = frameGroup; // referencia para moverlo junto
        c.add(bezel);
        frameGroup._bezel = bezel;
    }

    // ── Borde visual del marco ────────────────────────────
    if (shape !== 'cellphone' && shape !== 'laptop') {
        frameGroup.set({
            stroke: 'rgba(224,64,251,0.7)',
            strokeWidth: 2,
            paintFirst: 'stroke'
        });
    }

    c.add(frameGroup);
    c.setActiveObject(frameGroup);
    c.renderAll();
    if (window.saveHistory)    window.saveHistory();
    if (window.syncTextureTo3D) window.syncTextureTo3D();
    return frameGroup;
}

// ─── Decoración (bezel) por tipo de marco ────────────────
function makeBezel(shape, W, H, rx) {
    if (shape === 'cellphone') {
        // Cuerpo del teléfono
        const body = new fabric.Rect({ width: W + 14, height: H + 14, rx: 24, ry: 24,
            fill: 'transparent', stroke: '#1a1a2e', strokeWidth: 8,
            originX: 'left', originY: 'top'
        });
        const speaker = new fabric.Rect({ width: 34, height: 5, rx: 3,
            fill: '#1a1a2e',
            left: (W + 14) / 2 - 17, top: 10,
            originX: 'left', originY: 'top'
        });
        const camera = new fabric.Circle({ radius: 4, fill: '#1a1a2e',
            left: (W + 14) / 2 + 22, top: 8,
            originX: 'left', originY: 'top'
        });
        const homeBar = new fabric.Rect({ width: 40, height: 4, rx: 2,
            fill: '#1a1a2e',
            left: (W + 14) / 2 - 20, top: H + 4,
            originX: 'left', originY: 'top'
        });
        const btn1 = new fabric.Rect({ width: 4, height: 30, rx: 2, fill: '#1a1a2e',
            left: -8, top: 50, originX: 'left', originY: 'top' });
        const btn2 = new fabric.Rect({ width: 4, height: 20, rx: 2, fill: '#1a1a2e',
            left: W + 18, top: 70, originX: 'left', originY: 'top' });
        return new fabric.Group([body, speaker, camera, homeBar, btn1, btn2], {
            left: -7, top: -7
        });
    }
    if (shape === 'laptop') {
        const screen = new fabric.Rect({ width: W + 20, height: H + 14, rx: 6, ry: 6,
            fill: 'transparent', stroke: '#2d2d3a', strokeWidth: 10,
            originX: 'left', originY: 'top'
        });
        const camera = new fabric.Circle({ radius: 3, fill: '#2d2d3a',
            left: (W + 20) / 2 - 3, top: 5,
            originX: 'left', originY: 'top'
        });
        const base = new fabric.Polygon([
            { x: -20, y: H + 14 },
            { x: W + 40, y: H + 14 },
            { x: W + 55, y: H + 34 },
            { x: -35, y: H + 34 }
        ], { fill: '#2d2d3a', originX: 'left', originY: 'top' });
        const trackpad = new fabric.Rect({ width: 50, height: 10, rx: 2, fill: '#3d3d4a',
            left: (W + 20) / 2 - 25, top: H + 20, originX: 'left', originY: 'top' });
        return new fabric.Group([screen, camera, base, trackpad], {
            left: -10, top: -7
        });
    }
    if (shape === 'film') {
        // Marco de película
        const filmLeft = new fabric.Rect({ width: 18, height: H, fill: '#111',
            left: -18, top: 0, originX: 'left', originY: 'top' });
        const filmRight = new fabric.Rect({ width: 18, height: H, fill: '#111',
            left: W, top: 0, originX: 'left', originY: 'top' });
        const holes = [];
        for (let i = 0; i < 6; i++) {
            holes.push(new fabric.Rect({ width: 10, height: 14, rx: 2, fill: '#333',
                left: -14, top: 10 + i * 33, originX: 'left', originY: 'top' }));
            holes.push(new fabric.Rect({ width: 10, height: 14, rx: 2, fill: '#333',
                left: W + 4, top: 10 + i * 33, originX: 'left', originY: 'top' }));
        }
        return new fabric.Group([filmLeft, filmRight, ...holes], { left: 0, top: 0 });
    }
    if (shape === 'tablet') {
        const body = new fabric.Rect({ width: W + 16, height: H + 16, rx: 10, ry: 10,
            fill: 'transparent', stroke: '#1a1a2e', strokeWidth: 8,
            originX: 'left', originY: 'top'
        });
        const homeBtn = new fabric.Circle({ radius: 5, fill: '#1a1a2e',
            left: (W + 16) / 2 - 5, top: H + 3,
            originX: 'left', originY: 'top'
        });
        const camera = new fabric.Circle({ radius: 3, fill: '#1a1a2e',
            left: (W + 16) / 2 - 3, top: 6,
            originX: 'left', originY: 'top'
        });
        return new fabric.Group([body, homeBtn, camera], { left: -8, top: -8 });
    }
    if (shape === 'monitor') {
        const screen = new fabric.Rect({ width: W + 20, height: H + 14, rx: 8, ry: 8,
            fill: 'transparent', stroke: '#2d2d3a', strokeWidth: 10,
            originX: 'left', originY: 'top'
        });
        const neck = new fabric.Rect({ width: 12, height: 30, rx: 2,
            fill: '#2d2d3a',
            left: (W + 20) / 2 - 6, top: H + 14,
            originX: 'left', originY: 'top'
        });
        const base = new fabric.Rect({ width: 80, height: 10, rx: 4,
            fill: '#2d2d3a',
            left: (W + 20) / 2 - 40, top: H + 42,
            originX: 'left', originY: 'top'
        });
        return new fabric.Group([screen, neck, base], { left: -10, top: -7 });
    }
    if (shape === 'polaroid') {
        const outer = new fabric.Rect({ width: W + 20, height: H + 50, rx: 3,
            fill: '#f5f0e8', stroke: '#ddd', strokeWidth: 1,
            left: -10, top: -10, originX: 'left', originY: 'top' });
        return new fabric.Group([outer], { left: 0, top: 0 });
    }
    return null; // sin bezel para cuadrado, círculo, landscape, portrait, triangle, hexagon, diamond
}

// ─── Sincronizar posición del bezel con el marco ─────────
function syncBezel(frameObj) {
    const b = frameObj._bezel;
    if (!b) return;
    // El bezel usa coordenadas relativas (left/top) pre-ajustadas
    // Solo necesitamos asegurarnos de que está posicionado correctamente
    b.set({
        left: frameObj.left + frameObj._bezelOffset?.x || frameObj.left - 7,
        top:  frameObj.top  + frameObj._bezelOffset?.y || frameObj.top  - 7,
        angle: frameObj.angle || 0,
        scaleX: frameObj.scaleX || 1,
        scaleY: frameObj.scaleY || 1
    });
    b.setCoords();
}

// ─── Insertar imagen en marco ─────────────────────────────
function putImageInFrame(frameObj, fabricImg) {
    if (!frameObj.isFrame) return;

    const c = window.canvas;
    const W = frameObj.frameW;
    const H = frameObj.frameH;
    const rx = frameObj.frameRx;
    const shape = frameObj.frameShape;

    // Crear clipPath para la imagen dentro del grupo
    let imgClip;
    if (shape === 'circle') {
        imgClip = new fabric.Circle({ radius: W / 2, originX: 'center', originY: 'center' });
    } else {
        imgClip = new fabric.Rect({ width: W, height: H, rx, ry: rx, originX: 'center', originY: 'center' });
    }

    // Escalar la imagen para que llene el marco (object-fit: cover)
    const scaleX = W / fabricImg.width;
    const scaleY = H / fabricImg.height;
    const scale  = Math.max(scaleX, scaleY);
    fabricImg.scale(scale);
    fabricImg.set({
        originX: 'center', originY: 'center',
        left: 0, top: 0,
        selectable: false, evented: false,
        clipPath: imgClip
    });

    // Reemplazar contenido del grupo: placeholder → imagen
    // Eliminamos objetos anteriores (placeholder + íconos)
    const oldObjs = [...frameObj.getObjects()];
    oldObjs.forEach(o => frameObj.remove(o));
    frameObj.add(fabricImg);
    frameObj._hasImage = true;
    
    // Actualizar borde (quitar borde punteado, poner borde limpio)
    frameObj.set({
        stroke: 'rgba(224,64,251,0.3)',
        strokeWidth: 1
    });

    c.renderAll();
    if (window.saveHistory)    window.saveHistory();
    if (window.syncTextureTo3D) window.syncTextureTo3D();
}

// ─── Escucha de drag & drop en el lienzo ─────────────────
function setupDropListeners() {
    const c = window.canvas;

    // Cuando se mueve un objeto: resaltar marcos compatibles
    c.on('object:moving', (e) => {
        const obj = e.target;
        if (!obj || obj.isFrame || obj.type === 'group') return;

        const frames = c.getObjects().filter(o => o.isFrame);
        frames.forEach(f => {
            if (obj.intersectsWithObject(f)) {
                f.set({ strokeWidth: 3, stroke: '#E040FB' });
            } else {
                f.set({ strokeWidth: f._hasImage ? 1 : 2,
                        stroke: f._hasImage ? 'rgba(224,64,251,0.3)' : 'rgba(224,64,251,0.7)' });
            }
        });
        c.renderAll();
    });

    // Cuando se suelta un objeto: si intersecta con un marco, insertar
    c.on('object:modified', (e) => {
        const obj = e.target;
        if (!obj || obj.isFrame) return;
        if (obj.type !== 'image') return; // solo imágenes se insertan en marcos

        const frames = c.getObjects().filter(o => o.isFrame);
        for (const frame of frames) {
            // Resetear highlight
            frame.set({ strokeWidth: frame._hasImage ? 1 : 2,
                        stroke: frame._hasImage ? 'rgba(224,64,251,0.3)' : 'rgba(224,64,251,0.7)' });

            if (obj.intersectsWithObject(frame)) {
                // Crear copia nueva de la imagen para insertarla
                obj.clone((cloned) => {
                    putImageInFrame(frame, cloned);
                    c.remove(obj); // quitar original
                    c.renderAll();
                });
                break;
            }
        }
        c.renderAll();
    });

    // También sincronizar bezel al mover marco
    c.on('object:moving', (e) => {
        if (e.target && e.target.isFrame) syncBezel(e.target);
    });
    c.on('object:scaling', (e) => {
        if (e.target && e.target.isFrame) syncBezel(e.target);
    });
    c.on('object:rotating', (e) => {
        if (e.target && e.target.isFrame) syncBezel(e.target);
    });

    // ── Drop desde FUERA del navegador (archivos) ─────────
    const canvasEl = c.getElement();
    const parent = canvasEl.parentElement; // .canvas-container

    if (parent) {
        parent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        parent.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (!files || !files.length) return;

            const file = files[0];
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                fabric.Image.fromURL(ev.target.result, (newImg) => {
                    // Calcular coordenadas del drop en el lienzo
                    const rect    = canvasEl.getBoundingClientRect();
                    const scaleRatio = c.width / rect.width;
                    const dropX   = (e.clientX - rect.left) * scaleRatio;
                    const dropY   = (e.clientY - rect.top)  * scaleRatio;
                    const dropPt  = new fabric.Point(dropX, dropY);

                    // ¿Hay un marco en ese punto?
                    const frame = c.getObjects().filter(o => o.isFrame)
                                               .find(f => f.containsPoint(dropPt));

                    if (frame) {
                        putImageInFrame(frame, newImg);
                    } else {
                        // Soltar imagen en el lienzo normalmente
                        newImg.scaleToWidth(150);
                        newImg.set({ left: dropX, top: dropY, originX: 'center', originY: 'center' });
                        c.add(newImg);
                        c.setActiveObject(newImg);
                        c.renderAll();
                        if (window.saveHistory)    window.saveHistory();
                        if (window.syncTextureTo3D) window.syncTextureTo3D();
                    }
                });
            };
            reader.readAsDataURL(file);
        });
    }
}

// Exponer para uso externo
window.addFrameToCanvas = addFrameToCanvas;

})();
