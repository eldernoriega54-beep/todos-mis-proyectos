// ============================================================
// MÓDULO DE IA VEXEL 3D — Asistente de Diseño Vectorial (Estilo Canva)
// ============================================================

const AI_SYSTEM_PROMPT = `
Eres la Inteligencia Artificial Vectorial de Vexel 3D (similar a Canva). Tu objetivo es diseñar cualquier tipo de camisa o prenda que el usuario describa en texto, manteniendo siempre tu naturaleza de IA vectorial.
No estás limitado a opciones específicas ni a estilos predefinidos. Estás habilitado para la generación de imágenes y puedes usar todo lo que quieras de la app:
todos los archivos, textos propios o de la app, marcos (puedes insertar imágenes dentro de ellos), formas, elementos gráficos, imágenes generadas e incluso vectorizar fuentes de texto.
Tienes libertad total para interpretar la solicitud del usuario y construir sobre el lienzo un diseño complejo, multicapa y espectacular.
Crea la prenda exacta que el usuario describa en texto, usando toda tu capacidad creativa y vectorial auque cieto te di algunos ejemplos tu eres un diseñador profecional
si te dicen haz una camisa de flor dibujada a mano tu la generas vectorialemnte si te pideuna imagen que no se pueda hacer de manera vectorial la generas como elemento grafico
si te pide una imagen especifica generala ai te dicen una camisa que represente robotica hazla con lo que sea que sepas de conocimiento en robotica en caso de preguntar tu nombre es Vexel3D_IA okey,
y si preguntan quienes son los creadores de esta app dices los desarrolladores se llaman Elder Noriega Erick Jafet y Maycol martinez siendo estas todas las instrucciones como ia de esta empresa una cosa sepas que no todo es generar la prenda una pregunta cotidiana 
no es una orden de crear un diseño.
`;

document.addEventListener('DOMContentLoaded', () => {
    const aiFab = document.getElementById('btn-ai-fab');
    const aiSidebar = document.getElementById('ai-sidebar');
    const closeAiBtn = document.getElementById('btn-close-ai');
    const aiInput = document.getElementById('ai-input');
    const aiChatArea = document.getElementById('ai-chat-area');
    const aiLoadingOverlay = document.getElementById('ai-loading-overlay');

    // --- Control de la Interfaz del Asistente ---
    if (aiFab && aiSidebar) {
        aiFab.addEventListener('click', () => {
            aiSidebar.classList.toggle('hidden');
            if (!aiSidebar.classList.contains('hidden')) {
                aiInput.focus();
                scrollChatToBottom();
            }
        });
    }

    if (closeAiBtn && aiSidebar) {
        closeAiBtn.addEventListener('click', () => {
            aiSidebar.classList.add('hidden');
        });
    }

    if (aiInput) {
        aiInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && aiInput.value.trim() !== '') {
                const prompt = aiInput.value.trim();
                aiInput.value = '';
                await handleUserPrompt(prompt);
            }
        });
    }

    function scrollChatToBottom() {
        if (aiChatArea) {
            aiChatArea.scrollTop = aiChatArea.scrollHeight;
        }
    }

    function appendMessage(sender, text) {
        if (!aiChatArea) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ai-msg-${sender}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        aiChatArea.appendChild(msgDiv);
        scrollChatToBottom();
    }

    // --- Ejecución de Acciones sobre Fabric.js ---
    async function executeActions(actions) {
        if (typeof window.initCanvasIfNeeded === 'function') {
            try { window.initCanvasIfNeeded(); } catch (e) { console.warn('initCanvasIfNeeded error', e); }
        }
        const c = window.canvas;
        if (!c) return;

        // Limpiar elementos de diseño anteriores si es un estilo completo
        const hasClear = actions.some(a => a.type === 'clear');
        if (hasClear) {
            // Eliminar todos los objetos que no sean la prenda base
            const objs = c.getObjects();
            for (let i = objs.length - 1; i >= 0; i--) {
                const obj = objs[i];
                if (!obj.isGarment && obj.selectable !== false) {
                    c.remove(obj);
                }
            }
        }

        for (const a of actions || []) {
            try {
                if (a.type === 'set_canvas_bg' && a.color) {
                    // Si hay una prenda base, cambiar su color de fondo
                    const garment = c.getObjects().find(o => o.isGarment || o.selectable === false);
                    if (garment) {
                        if (garment._objects) {
                            garment._objects.forEach(path => {
                                if (path.fill && path.fill !== 'none' && path.fill !== 'transparent') {
                                    path.set('fill', a.color);
                                }
                            });
                        } else {
                            garment.set('fill', a.color);
                        }
                    } else {
                        c.backgroundColor = a.color;
                    }
                }
                
                if (a.type === 'add_text' && a.text) {
                    const obj = new fabric.IText(a.text, {
                        left: a.left || c.width/2,
                        top: a.top || c.height/2,
                        originX: 'center', 
                        originY: 'center',
                        fill: a.color || '#ffffff', 
                        fontSize: a.fontSize || 38,
                        fontFamily: a.fontFamily || 'Inter',
                        fontWeight: a.fontWeight || 'normal',
                        shadow: a.shadow || null
                    });
                    c.add(obj);
                    c.setActiveObject(obj);
                }
                
                if (a.type === 'add_shape') {
                    const opts = { 
                        left: a.left || c.width/2, 
                        top: a.top || c.height/2, 
                        originX: 'center', 
                        originY: 'center', 
                        fill: a.color || '#e040fb',
                        opacity: a.opacity || 1.0,
                        stroke: a.stroke || null,
                        strokeWidth: a.strokeWidth || 0
                    };
                    let obj = null;
                    if (a.shape === 'circle') {
                        obj = new fabric.Circle(Object.assign(opts, { radius: a.radius || 50 }));
                    } else if (a.shape === 'rect') {
                        obj = new fabric.Rect(Object.assign(opts, { width: a.width || 160, height: a.height || 100, rx: a.rx || 0, ry: a.ry || 0 }));
                    } else if (a.shape === 'triangle') {
                        obj = new fabric.Triangle(Object.assign(opts, { width: a.width || 120, height: a.height || 120 }));
                    }
                    if (obj) c.add(obj);
                }
                
                if (a.type === 'add_decoration' && a.style === 'stripes') {
                    // Añadir líneas deportivas
                    const color = a.color || '#ffffff';
                    for (let i = 0; i < 3; i++) {
                        const stripe = new fabric.Rect({
                            left: (c.width / 2) - 40 + (i * 40),
                            top: c.height / 2,
                            width: 15,
                            height: 380,
                            fill: color,
                            originX: 'center',
                            originY: 'center',
                            angle: a.angle || 0,
                            opacity: 0.8
                        });
                        c.add(stripe);
                    }
                }
            } catch (err) { 
                console.error('Error executing action:', err); 
            }
        }
        c.renderAll();
        if (window.syncTextureTo3D) window.syncTextureTo3D();
        if (window.saveHistory) window.saveHistory();
    }

    // --- Procesamiento de Lenguaje Natural Local (Canva AI) ---
    async function handleUserPrompt(prompt) {
        appendMessage('user', prompt);
        
        // Mostrar overlay de carga
        if (aiLoadingOverlay) aiLoadingOverlay.classList.remove('hidden');

        // Simular tiempo de procesamiento de la IA (1.5 segundos)
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (aiLoadingOverlay) aiLoadingOverlay.classList.add('hidden');

        const normalized = prompt.toLowerCase();
        let actions = [];
        let responseMsg = "";

        // 1. Estilo Minecraft / Pixel / Creeper
        if (normalized.includes('minecraft') || normalized.includes('creeper') || normalized.includes('pixel')) {
            actions = [
                { type: 'clear' },
                { type: 'set_canvas_bg', color: '#388e3c' }, // Verde pasto Creeper
                // Cara del Creeper (Ojo Izquierdo, Ojo Derecho, Nariz, Boca/Líneas)
                { type: 'add_shape', shape: 'rect', width: 45, height: 45, color: '#111111', left: 230, top: 300 }, // Ojo Izq
                { type: 'add_shape', shape: 'rect', width: 45, height: 45, color: '#111111', left: 330, top: 300 }, // Ojo Der
                { type: 'add_shape', shape: 'rect', width: 45, height: 60, color: '#111111', left: 280, top: 345 }, // Nariz/Centro boca
                { type: 'add_shape', shape: 'rect', width: 30, height: 70, color: '#111111', left: 242, top: 380 }, // Boca Izq
                { type: 'add_shape', shape: 'rect', width: 30, height: 70, color: '#111111', left: 318, top: 380 }, // Boca Der
                { type: 'add_text', text: 'MINECRAFT', top: 180, color: '#ffffff', fontSize: 36, fontFamily: 'Impact', fontWeight: '800' },
                { type: 'add_text', text: 'CREEPER EDITION', top: 480, color: '#ffeb3b', fontSize: 20, fontFamily: 'Courier New', fontWeight: 'bold' }
            ];
            responseMsg = "🟩 ¡Ssshhhh... BOOM! Diseñé una camiseta de Minecraft estilo Creeper. Apliqué el fondo verde pixelado clásico, construí los ojos y la boca del Creeper usando bloques vectoriales negros de precisión y añadí el texto 'MINECRAFT' en una fuente blocky impactante. ¡Cuidado no explote!";
        }
        // 2. Estilo Deportivo
        else if (normalized.includes('deport') || normalized.includes('futbol') || normalized.includes('fútbol') || normalized.includes('sport')) {
            actions = [
                { type: 'clear' },
                { type: 'set_canvas_bg', color: '#1b4332' }, // Verde deportivo premium
                { type: 'add_decoration', style: 'stripes', color: '#ffffff', angle: -25 }, // Rayas deportivas diagonales
                { type: 'add_text', text: 'VEXEL ATHLETIC', top: 200, color: '#ffffff', fontSize: 34, fontFamily: 'Inter', fontWeight: '800' },
                { type: 'add_text', text: '10', top: 350, color: '#ffeb3b', fontSize: 130, fontFamily: 'Impact', fontWeight: '800' },
                { type: 'add_text', text: 'CHAMPIONS', top: 480, color: '#ffffff', fontSize: 24, fontFamily: 'Inter', fontWeight: '600' }
            ];
            responseMsg = "⚽ ¡Hecho! Diseñé un estilo deportivo premium con fondo verde atlético, franjas deportivas diagonales blancas, el texto destacado y el icónico número '10' en el centro. ¡Listo para la cancha!";
        } 
        // 2. Estilo Cyberpunk / Futurista
        else if (normalized.includes('cyber') || normalized.includes('futur') || normalized.includes('neon') || normalized.includes('neón')) {
            actions = [
                { type: 'clear' },
                { type: 'set_canvas_bg', color: '#09090e' }, // Fondo negro ciberespacio
                { type: 'add_shape', shape: 'circle', radius: 110, color: '#e040fb', opacity: 0.3, top: 320 }, // Halo neón
                { type: 'add_shape', shape: 'circle', radius: 80, color: '#00e5ff', opacity: 0.2, top: 320 },  // Halo secundario
                { type: 'add_shape', shape: 'rect', width: 280, height: 8, color: '#00e5ff', top: 410 }, // Barra láser
                { type: 'add_text', text: 'CYBERPUNK', top: 260, color: '#00e5ff', fontSize: 42, fontFamily: 'Courier New', fontWeight: '800' },
                { type: 'add_text', text: 'VEXEL NEON', top: 340, color: '#ffffff', fontSize: 26, fontFamily: 'Courier New', fontWeight: 'bold' },
                { type: 'add_text', text: 'SYSTEM OVERRIDE', top: 440, color: '#e040fb', fontSize: 18, fontFamily: 'Courier New' }
            ];
            responseMsg = "⚡ ¡Estilo Cyberpunk cargado! Apliqué un fondo negro absoluto con halos neón concéntricos en tonos fucsia y cian, cruzados por un haz de luz láser y tipografía digital estilizada.";
        } 
        // 3. Estilo Minimalista / Simple
        else if (normalized.includes('minimal') || normalized.includes('simpl') || normalized.includes('elegante')) {
            actions = [
                { type: 'clear' },
                { type: 'set_canvas_bg', color: '#f7f7f9' }, // Blanco roto
                { type: 'add_shape', shape: 'rect', width: 260, height: 260, color: 'transparent', stroke: '#111111', strokeWidth: 2, top: 340 }, // Cuadro delgado
                { type: 'add_shape', shape: 'triangle', width: 80, height: 80, color: '#111111', top: 330 }, // Triángulo minimalista
                { type: 'add_text', text: 'ESSENTIALS', top: 430, color: '#111111', fontSize: 22, fontFamily: 'Inter', fontWeight: '600' },
                { type: 'add_text', text: 'V E X E L', top: 220, color: '#777777', fontSize: 16, fontFamily: 'Inter', fontWeight: '300' }
            ];
            responseMsg = "🖤 ¡Listo! Creé una composición minimalista con fondo blanco hueso, un marco cuadrado ultra delgado, geometría lineal triangular negra y textos espaciados de alta costura.";
        }
        // 4. Estilo Retro / Vintage / Ochentas
        else if (normalized.includes('retro') || normalized.includes('vintage') || normalized.includes('80')) {
            actions = [
                { type: 'clear' },
                { type: 'set_canvas_bg', color: '#ffb703' }, // Naranja retro
                { type: 'add_shape', shape: 'circle', radius: 100, color: '#fb8500', top: 300 }, // Sol retro
                { type: 'add_shape', shape: 'rect', width: 320, height: 35, color: '#219ebc', top: 410 }, // Franjas vintage
                { type: 'add_shape', shape: 'rect', width: 320, height: 15, color: '#023047', top: 430 },
                { type: 'add_text', text: 'RETRO WAVE', top: 250, color: '#ffffff', fontSize: 38, fontFamily: 'Arial Black', fontWeight: 'bold' },
                { type: 'add_text', text: 'SUMMER 1986', top: 380, color: '#023047', fontSize: 18, fontFamily: 'Arial' }
            ];
            responseMsg = "🌅 ¡Estilo Retro generado! He colocado un fondo naranja atardecer con el clásico sol de fondo, franjas horizontales en tonos azul océano y tipografía en bloque retro.";
        }
        // 5. Comando genérico de cambiar color / fondo
        else if (normalized.includes('fondo') || normalized.includes('color')) {
            let color = '#ffffff';
            let colorName = 'blanco';
            
            if (normalized.includes('negro')) { color = '#000000'; colorName = 'negro'; }
            else if (normalized.includes('rojo')) { color = '#ef4444'; colorName = 'rojo'; }
            else if (normalized.includes('azul')) { color = '#3b82f6'; colorName = 'azul'; }
            else if (normalized.includes('verde')) { color = '#22c55e'; colorName = 'verde'; }
            else if (normalized.includes('amarillo')) { color = '#eab308'; colorName = 'amarillo'; }
            else if (normalized.includes('morado') || normalized.includes('purpura')) { color = '#a855f7'; colorName = 'morado'; }
            else if (normalized.includes('rosa') || normalized.includes('rosado')) { color = '#ec4899'; colorName = 'rosado'; }
            
            actions = [{ type: 'set_canvas_bg', color: color }];
            responseMsg = `🎨 Entendido. He cambiado el color de fondo de la prenda a **${colorName}** (${color}) para tu diseño.`;
        }
        // 6. Comando para agregar texto personalizado
        else if (normalized.includes('texto') || normalized.includes('escribe') || normalized.includes('escribir')) {
            // Extraer texto entre comillas o al final
            let userText = "Vexel Style";
            const match = prompt.match(/["'«»](.+?)["'«»]/);
            if (match && match[1]) {
                userText = match[1];
            } else {
                const parts = prompt.split(/(?:texto|escribe|escribir)\s+/i);
                if (parts.length > 1) userText = parts[1];
            }

            actions = [
                { type: 'add_text', text: userText, color: '#ffffff', fontSize: 40, fontFamily: 'Inter', fontWeight: 'bold' }
            ];
            responseMsg = `✍️ ¡Texto agregado! He añadido la capa de texto vectorial **"${userText}"** al centro del lienzo. Puedes moverlo o cambiar su tamaño.`;
        }
        // 7. Comando para agregar formas vectoriales específicas
        else if (normalized.includes('circulo') || normalized.includes('círculo')) {
            actions = [{ type: 'add_shape', shape: 'circle', radius: 60, color: '#e040fb' }];
            responseMsg = "🔵 He añadido un círculo vectorial en color magenta al lienzo.";
        }
        else if (normalized.includes('rectangulo') || normalized.includes('rectángulo') || normalized.includes('cuadrado')) {
            actions = [{ type: 'add_shape', shape: 'rect', width: 150, height: 100, color: '#00e5ff' }];
            responseMsg = "🟩 He añadido un rectángulo vectorial en color cian al lienzo.";
        }
        else if (normalized.includes('triangulo') || normalized.includes('triángulo')) {
            actions = [{ type: 'add_shape', shape: 'triangle', width: 120, height: 120, color: '#ffeb3b' }];
            responseMsg = "🔺 He añadido un triángulo vectorial en color amarillo al lienzo.";
        }
        // 8. Respuesta genérica
        else {
            actions = [
                { type: 'clear' },
                { type: 'set_canvas_bg', color: '#120d24' },
                { type: 'add_shape', shape: 'circle', radius: 90, color: '#e040fb', opacity: 0.4 },
                { type: 'add_text', text: prompt.substring(0, 20).toUpperCase(), top: 300, color: '#ffffff', fontSize: 32, fontFamily: 'Inter', fontWeight: 'bold' },
                { type: 'add_text', text: 'Diseño Vectorial IA', top: 380, color: '#00e5ff', fontSize: 20, fontFamily: 'Inter' }
            ];
            responseMsg = `✨ He interpretado tu solicitud ("${prompt}") guiándome por mis instrucciones principales. Al ser una IA vectorial con acceso a todas las herramientas de la app, he generado e integrado esta composición personalizada de alta fidelidad. ¡Puedes editar cada vector generado a tu gusto!`;
        }

        // Ejecutar las acciones sobre el canvas
        await executeActions(actions);
        appendMessage('system', responseMsg);
    }

    // Exponer la función del asistente globalmente
    window.__ai_executeActions = executeActions;
    window.__ai_processWithAI = async (prompt) => {
        await handleUserPrompt(prompt);
        return { ok: true, message: 'Processed locally' };
    };
});
