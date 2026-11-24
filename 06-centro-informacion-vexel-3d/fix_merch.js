const fs = require('fs');
let c = fs.readFileSync('d:/centro de informacion vexel 3d/merch.html', 'utf8');

const modalHtml = `
    <!-- Modal de Pedido (Web3Forms) -->
    <div id="merch-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center; backdrop-filter:blur(5px);">
        <div style="background:#120d24; padding:40px; border-radius:20px; border:1px solid var(--accent); width:90%; max-width:500px; position:relative;">
            <button onclick="document.getElementById('merch-modal').style.display='none'" style="position:absolute; top:15px; right:20px; background:transparent; border:none; color:#fff; font-size:1.5rem; cursor:pointer;">&times;</button>
            <h2 style="color:#fff; margin-bottom:20px; text-align:center;"><i class="fa-solid fa-cart-shopping" style="color:var(--accent);"></i> Enviar Pedido</h2>
            <form id="merch-form">
                <input type="hidden" name="access_key" value="9a936433-b47b-414a-a19c-bdf9621b5d70">
                <input type="checkbox" name="botcheck" class="hidden" style="display:none;">
                <input type="hidden" name="subject" value="Nuevo Pedido de Merch">
                
                <div style="margin-bottom:15px;">
                    <label style="color:var(--text-secondary); display:block; margin-bottom:5px;">Nombre completo</label>
                    <input type="text" name="name" required style="width:100%; padding:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:var(--text-secondary); display:block; margin-bottom:5px;">Correo electrónico</label>
                    <input type="email" name="email" required style="width:100%; padding:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff;">
                </div>
                <div style="margin-bottom:20px;">
                    <label style="color:var(--text-secondary); display:block; margin-bottom:5px;">Detalles del Pedido (Prenda, Talla, etc.)</label>
                    <textarea name="message" required rows="4" style="width:100%; padding:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff;"></textarea>
                </div>
                <button type="submit" style="width:100%; padding:15px; background:var(--accent); color:#fff; border:none; border-radius:8px; font-weight:bold; font-size:1.1rem; cursor:pointer;"><i class="fa-solid fa-paper-plane"></i> Confirmar Pedido</button>
                <div id="merch-result" style="display:none; margin-top:15px; text-align:center; padding:10px; border-radius:8px;"></div>
            </form>
        </div>
    </div>
    <script>
        // Interceptar clicks en Diseñar Ahora para abrir el formulario
        document.querySelectorAll('.btn-disenar').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('merch-modal').style.display='flex';
            });
        });

        document.getElementById('merch-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const result = document.getElementById('merch-result');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Enviando...';
            submitBtn.disabled = true;
            result.style.display = 'none';

            const formData = new FormData(this);
            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                result.style.display = 'block';
                if(res.ok) {
                    result.innerHTML = '¡Pedido enviado correctamente!';
                    result.style.color = '#22c55e';
                    result.style.background = 'rgba(46, 213, 115, 0.1)';
                    this.reset();
                    setTimeout(() => document.getElementById('merch-modal').style.display='none', 3000);
                } else {
                    result.innerHTML = data.message;
                    result.style.color = '#ef4444';
                    result.style.background = 'rgba(239, 68, 68, 0.1)';
                }
            } catch(err) {
                result.style.display = 'block';
                result.innerHTML = 'Error al enviar pedido';
                result.style.color = '#ef4444';
                result.style.background = 'rgba(239, 68, 68, 0.1)';
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    </script>
`;

if(!c.includes('merch-modal')) {
    c = c.replace('</body>', modalHtml + '\n</body>');
    fs.writeFileSync('d:/centro de informacion vexel 3d/merch.html', c, 'utf8');
}
