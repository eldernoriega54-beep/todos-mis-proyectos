const video = document.getElementById('videoElement');
const btnReset = document.getElementById('btn-reset');
const canvas = document.createElement('canvas');

// UI Elements
const resEmail = document.getElementById('res-email');
const resName = document.getElementById('res-name');
const resId = document.getElementById('res-id');
const resVoted = document.getElementById('res-voted');
const statusBadge = document.getElementById('status-badge');
const scanStatus = document.getElementById('scan-status');
const scannerLine = document.getElementById('scanner-line');
const resultsContainer = document.getElementById('results-container');
const redirectMessage = document.getElementById('redirect-message');

const fallbackLogin = document.getElementById('fallback-login');
const btnOpenEmailLogin = document.getElementById('btn-open-email-login');
const btnFallbackLogin = document.getElementById('btn-fallback-login');

let currentStream = null;
let scanInterval = null;
let isProcessing = false;
let cameraErrorCount = 0;
let redirectTimeout = null;
let yaReconocido = false;

// Iniciar cÃ¡mara automÃ¡ticamente al cargar
document.addEventListener('DOMContentLoaded', () => {
    startCamera();
});

// ===============================
// UTILIDADES
// ===============================
function setText(el, value) {
    if (el) el.innerText = value;
}

function showElement(el) {
    if (el) el.classList.remove('hidden');
}

function hideElement(el) {
    if (el) el.classList.add('hidden');
}

function safeSetClass(el, className) {
    if (el) el.className = className;
}

function safeDisplay(el, displayValue) {
    if (el) el.style.display = displayValue;
}

function redirectToBallot() {
    stopCamera();

    try {
        window.location.assign('votar.html');
    } catch (e) {
        console.error('FallÃ³ location.assign, intentando href...', e);
        window.location.href = 'votar.html';
    }
}

function openFallbackLogin() {
    showElement(fallbackLogin);
    if (btnOpenEmailLogin) {
        btnOpenEmailLogin.classList.add('hidden');
    }
}

// ===============================
// CONTROLES DE CÃMARA
// ===============================
async function startCamera() {
    try {
        setText(statusBadge, 'Iniciando cÃ¡mara...');
        safeSetClass(
            statusBadge,
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-6 transition-colors'
        );

        currentStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });

        video.srcObject = currentStream;

        video.onloadedmetadata = () => {
            setText(statusBadge, 'Buscando rostro...');
            safeSetClass(
                statusBadge,
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-6 transition-colors'
            );

            setText(scanStatus, 'ðŸ” Escaneando...');
            safeDisplay(scannerLine, 'block');

            startAutoScan();
        };
    } catch (err) {
        console.error('Camera error:', err);

        setText(statusBadge, 'Error de cÃ¡mara');
        safeSetClass(
            statusBadge,
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-6 transition-colors'
        );

        setText(scanStatus, 'âŒ CÃ¡mara no disponible');
        safeDisplay(scannerLine, 'none');

        Swal.fire({
            title: 'Error de CÃ¡mara',
            text: 'No se pudo acceder a la cÃ¡mara. Si lo necesitas, puedes usar el botÃ³n "Entrar por correo".',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }
}

function stopCamera() {
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }

    if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        redirectTimeout = null;
    }

    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        currentStream = null;
    }

    safeDisplay(scannerLine, 'none');
    setText(scanStatus, 'â¹ï¸ Detenido');
}

function startAutoScan() {
    if (scanInterval) {
        clearInterval(scanInterval);
    }

    scanInterval = setInterval(async () => {
        if (isProcessing || !currentStream || yaReconocido) return;
        await verifyFace();
    }, 700);
}

// ===============================
// RECONOCIMIENTO
// ===============================
async function verifyFace() {
    if (!currentStream || video.readyState !== 4 || yaReconocido) return;

    isProcessing = true;
    setText(scanStatus, 'ðŸ“¸ Analizando...');

    canvas.width = 320;
    canvas.height = 240;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imagenBase64 = canvas.toDataURL('image/jpeg', 0.6);

    try {
        const response = await fetch('api/face_login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagen_base64: imagenBase64 })
        });

        const result = await response.json();
        console.log('Respuesta face_login:', result);

        if (result.status === 'success' && result.user && !yaReconocido) {
            yaReconocido = true;
            clearInterval(scanInterval);
            scanInterval = null;

            await handleSuccessfulRecognition(result.user);
        } else {
            cameraErrorCount++;
            setText(scanStatus, 'ðŸ” Buscando...');
        }
    } catch (error) {
        console.error('Error validando:', error);
        setText(scanStatus, 'âš ï¸ Error de red');
    } finally {
        isProcessing = false;
    }
}

// ===============================
// CUANDO RECONOCE EXITOSAMENTE
// ===============================
async function handleSuccessfulRecognition(user) {
    try {
        console.log('Usuario reconocido correctamente:', user);

        setText(statusBadge, 'âœ… Usuario Reconocido');
        safeSetClass(
            statusBadge,
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6 transition-colors'
        );

        setText(scanStatus, 'âœ“ Identificado');
        safeDisplay(scannerLine, 'none');

        if (resultsContainer) {
            resultsContainer.classList.remove('opacity-50');
        }

        setText(resEmail, user.email || user.correo || '---');
        setText(resName, user.nombre || 'Sin Nombre');
        setText(resId, user.id || '---');

        const votedElections = Array.isArray(user.voted_elections) ? user.voted_elections : [];
        const yaVoto = votedElections.length > 0;

        setText(resVoted, yaVoto ? `SÃ­ (${votedElections.length})` : 'No');

        localStorage.setItem('current_voter_id', user.id || '');
        localStorage.setItem('current_voter_name', user.nombre || '');
        localStorage.setItem('voted_elections', JSON.stringify(votedElections));

        localStorage.setItem('usuario_votante', JSON.stringify({
            id: user.id || '',
            nombre: user.nombre || '',
            correo: user.email || user.correo || '',
            voto_emitido: yaVoto,
            voted_elections: votedElections,
            estado: user.estado || 'Activo'
        }));

        hideElement(redirectMessage);

        if (yaVoto) {
            setText(statusBadge, 'âš ï¸ Usted ya votÃ³');
            safeSetClass(
                statusBadge,
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-6 transition-colors'
            );

            setText(scanStatus, 'â›” Voto ya registrado');
            safeDisplay(scannerLine, 'none');

            if (scanInterval) {
                clearInterval(scanInterval);
                scanInterval = null;
            }

            if (redirectTimeout) {
                clearTimeout(redirectTimeout);
                redirectTimeout = null;
            }

            stopCamera();

            Swal.fire({
                title: 'Usted ya votÃ³',
                text: 'Este usuario ya emitiÃ³ su voto y no puede volver a ingresar a la boleta.',
                icon: 'info',
                confirmButtonText: 'Entendido'
            });

            return;
        }

        showElement(redirectMessage);

        Swal.fire({
            title: 'Â¡Bienvenido!',
            text: `${user.nombre || 'Usuario'}, redirigiendo a la boleta...`,
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });

        redirectTimeout = setTimeout(() => {
            redirectToBallot();
        }, 1200);
    } catch (error) {
        console.error('Error dentro de handleSuccessfulRecognition:', error);

        const votedElections = Array.isArray(user?.voted_elections) ? user.voted_elections : [];
        const yaVoto = votedElections.length > 0;

        if (!yaVoto) {
            redirectTimeout = setTimeout(() => {
                redirectToBallot();
            }, 800);
        }
    }
}

// ===============================
// RESET UI
// ===============================
function resetUI() {
    yaReconocido = false;
    isProcessing = false;
    cameraErrorCount = 0;

    if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        redirectTimeout = null;
    }

    setText(statusBadge, 'Buscando rostro...');
    safeSetClass(
        statusBadge,
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-6 transition-colors'
    );

    setText(scanStatus, 'ðŸ” Escaneando...');

    setText(resEmail, '---');
    setText(resName, '---');
    setText(resId, '---');
    setText(resVoted, '---');

    if (resultsContainer) {
        resultsContainer.classList.add('opacity-50');
    }

    hideElement(redirectMessage);

    if (!currentStream) {
        startCamera();
    } else {
        safeDisplay(scannerLine, 'block');

        if (scanInterval) {
            clearInterval(scanInterval);
            scanInterval = null;
        }

        startAutoScan();
    }
}

if (btnReset) {
    btnReset.addEventListener('click', () => {
        resetUI();
    });
}

window.addEventListener('beforeunload', () => {
    stopCamera();
});

// ===============================
// BOTÃ“N MANUAL: ENTRAR POR CORREO
// ===============================
if (btnOpenEmailLogin) {
    btnOpenEmailLogin.addEventListener('click', () => {
        openFallbackLogin();
    });
}

// ===============================
// LOGIN POR CORREO (SIN CONTRASEÃ‘A)
// ===============================
// login por correo: acepta cualquier dominio
function buildFallbackEmail() {
    const emailField = document.getElementById('fallback-email');
    return emailField ? emailField.value.trim() : '';
}


if (btnFallbackLogin) {
    btnFallbackLogin.addEventListener('click', async () => {
        const fallEmail = buildFallbackEmail();

        if (!fallEmail) {
            Swal.fire('Atencion', 'Por favor ingresa tu correo electronico completo.', 'warning');
            return;
        }

        btnFallbackLogin.disabled = true;
        btnFallbackLogin.innerText = 'Verificando...';

        try {
            const res = await fetch('api/email_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fallEmail })
            });

            const data = await res.json();
            console.log('Respuesta email_login fallback:', data);

            if (data.status === 'success' && data.user) {
                stopCamera();

                localStorage.setItem('current_voter_id', data.user.id || '');
                localStorage.setItem('current_voter_name', data.user.nombre || '');
                localStorage.setItem('voted_elections', JSON.stringify(data.user.voted_elections || []));

                localStorage.setItem('usuario_votante', JSON.stringify({
                    id: data.user.id || '',
                    nombre: data.user.nombre || '',
                    correo: data.user.email || data.user.correo || '',
                    voto_emitido: Array.isArray(data.user.voted_elections) ? data.user.voted_elections.length > 0 : false,
                    voted_elections: data.user.voted_elections || [],
                    estado: data.user.estado || 'Activo'
                }));

                window.location.assign('votar.html');
            } else {
                Swal.fire('Error', 'Error de acceso: ' + (data.message || 'No autorizado'), 'error');
            }
        } catch (e) {
            console.error('Error fallback login:', e);
            Swal.fire('Error', 'Error de conexiÃ³n con el servidor.', 'error');
        } finally {
            btnFallbackLogin.disabled = false;
            btnFallbackLogin.innerText = 'Verificar y Votar';
        }
    });
}
