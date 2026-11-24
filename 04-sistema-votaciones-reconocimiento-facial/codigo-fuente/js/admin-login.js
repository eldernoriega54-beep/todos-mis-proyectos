const btnLoginPass = document.getElementById('btn-login-pass');
const errorMsgPass = document.getElementById('error-msg-pass');

// Pass Logic
btnLoginPass.addEventListener('click', async () => {
    const user = document.getElementById('admin-user').value.trim();
    const pass = document.getElementById('admin-pass').value.trim();
    
    if(!user || !pass) {
        errorMsgPass.innerText = 'Llena ambos campos.';
        errorMsgPass.classList.remove('hidden');
        return;
    }

    btnLoginPass.disabled = true;
    btnLoginPass.innerText = 'Verificando...';

    try {
        const res = await fetch('api/admin_auth.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ method: 'password', usuario: user, contrasena: pass })
        });
        const data = await res.json();
        
        if (data.status === 'success') {
            // Save admin session token inside localStorage to protect admin.html view
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', data.usuario);
            window.location.href = 'admin.html';
        } else {
            errorMsgPass.innerText = data.message;
            errorMsgPass.classList.remove('hidden');
        }
    } catch(e) {
        errorMsgPass.innerText = 'Error de conexión.';
        errorMsgPass.classList.remove('hidden');
    }
    
    btnLoginPass.disabled = false;
    btnLoginPass.innerText = 'Ingresar al Panel';
});
