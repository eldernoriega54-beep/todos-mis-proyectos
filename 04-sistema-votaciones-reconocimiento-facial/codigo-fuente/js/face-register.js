const video = document.getElementById('videoElement');
const overlay = document.getElementById('overlay');
const btnStartCamera = document.getElementById('btn-start-camera');
const btnRegister = document.getElementById('btn-register');
const inputEmail = document.getElementById('input-email');
const inputName = document.getElementById('input-name');
const statusMessage = document.getElementById('status-message');
const loadingModels = document.getElementById('loading-models');
const mainContent = document.getElementById('main-content');
const canvas = document.createElement('canvas');

let currentStream = null;

if (loadingModels) loadingModels.classList.add('hidden');
if (mainContent) {
    mainContent.classList.remove('hidden', 'opacity-0');
    mainContent.classList.add('opacity-100');
}

function checkForm() {
    const email = inputEmail ? inputEmail.value.trim() : '';
    if (email !== '' && inputName && inputName.value.trim() !== '' && currentStream !== null) {
        btnRegister.disabled = false;
    } else {
        btnRegister.disabled = true;
    }
}

if (inputEmail) inputEmail.addEventListener('input', checkForm);
if (inputName) inputName.addEventListener('input', checkForm);

async function startCamera() {
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 360 } }
        });
        video.srcObject = currentStream;
        if (btnStartCamera) btnStartCamera.classList.add('hidden');
        if (btnRegister) btnRegister.classList.remove('hidden');
        checkForm();
    } catch (err) {
        console.error("Camera error:", err);
        Swal.fire('Error', 'No se pudo acceder a la camara. Asegurate de permitir los permisos.', 'error');
    }
}

if (btnStartCamera) btnStartCamera.addEventListener('click', startCamera);

// Recuadro guia para el rostro
function drawOverlay() {
    if (!overlay) return;
    overlay.innerHTML = '';
    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;border:2px solid #22c55e;border-radius:50%;width:50%;height:80%;top:10%;left:25%;box-shadow:0 0 0 4000px rgba(0,0,0,0.35);';
    overlay.appendChild(box);
}
video.addEventListener('play', drawOverlay);

// Capturar y registrar
if (btnRegister) btnRegister.addEventListener('click', async () => {
    const email = inputEmail ? inputEmail.value.trim() : '';
    const name = inputName ? inputName.value.trim() : '';

    if (!email || !name || !currentStream) return;

    btnRegister.disabled = true;
    btnRegister.innerText = "Registrando...";

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const imagenBase64 = canvas.toDataURL('image/jpeg', 0.85);

    try {
        if (statusMessage) {
            statusMessage.innerText = 'Enviando y registrando rostro...';
            statusMessage.classList.remove('hidden', 'text-red-600', 'text-green-600');
            statusMessage.classList.add('text-indigo-600');
        }

        const response = await fetch('api/face_register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: name, email: email, imagen_base64: imagenBase64 })
        });
        const result = await response.json();

        if (result.status === 'success') {
            stopCamera();
            if (statusMessage) {
                statusMessage.innerText = 'Registro exitoso! Ahora reconocemos tu rostro...';
                statusMessage.classList.remove('text-indigo-600', 'text-red-600');
                statusMessage.classList.add('text-green-600');
            }

            // Ir a la pantalla de reconocimiento facial (index.html)
            // donde se vive la experiencia completa de identificacion
            setTimeout(() => {
                window.location.assign('index.html');
            }, 1500);
        } else {
            if (statusMessage) {
                statusMessage.innerText = "Error: " + result.message;
                statusMessage.classList.remove('text-indigo-600', 'text-green-600');
                statusMessage.classList.add('text-red-600');
            }
            btnRegister.disabled = false;
            btnRegister.innerText = "Guardar y Registrar Rostro";
        }
    } catch(err) {
        console.error(err);
        if (statusMessage) {
            statusMessage.innerText = "Error conectando con el servidor.";
            statusMessage.classList.remove('hidden', 'text-indigo-600', 'text-green-600');
            statusMessage.classList.add('text-red-600');
        }
        btnRegister.disabled = false;
        btnRegister.innerText = "Guardar y Registrar Rostro";
    }
});

function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        currentStream = null;
    }
}

window.addEventListener('beforeunload', stopCamera);
