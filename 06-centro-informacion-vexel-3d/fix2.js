const fs = require('fs');
let c = fs.readFileSync('d:/centro de informacion vexel 3d/contacto.html', 'utf8');
c = c.replace(/<form id="contact-form">/, '<form id="contact-form">\n                    <input type="hidden" name="access_key" value="9a936433-b47b-414a-a19c-bdf9621b5d70">\n                    <input type="checkbox" name="botcheck" class="hidden" style="display: none;">');
c = c.replace(/<input type="text" id="cf-name"/g, '<input type="text" name="name" id="cf-name"');
c = c.replace(/<input type="email" id="cf-email"/g, '<input type="email" name="email" id="cf-email"');
c = c.replace(/<select id="cf-subject"/g, '<select name="subject" id="cf-subject"');
c = c.replace(/<textarea id="cf-message"/g, '<textarea name="message" id="cf-message"');

const js = `document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const result = document.getElementById('form-success');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    result.style.display = 'none';

    const formData = new FormData(this);
    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        result.style.display = 'flex';
        if(res.ok) {
            result.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Enviado correctamente!';
            result.style.color = '#22c55e';
            result.style.borderColor = '#22c55e';
            result.style.background = 'rgba(46, 213, 115, 0.1)';
            this.reset();
        } else {
            result.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + data.message;
            result.style.color = '#ef4444';
            result.style.borderColor = '#ef4444';
            result.style.background = 'rgba(239, 68, 68, 0.1)';
        }
    } catch(err) {
        result.style.display = 'flex';
        result.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Error al enviar';
        result.style.color = '#ef4444';
        result.style.borderColor = '#ef4444';
        result.style.background = 'rgba(239, 68, 68, 0.1)';
    }
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    setTimeout(()=>{
        result.style.display='none';
    }, 5000);
});`;

c = c.replace(/document\.getElementById\('contact-form'\)\.addEventListener\('submit', function\(e\) \{[\s\S]*?\}\);/, js);
fs.writeFileSync('d:/centro de informacion vexel 3d/contacto.html', c, 'utf8');
console.log("contacto.html updated successfully!");
