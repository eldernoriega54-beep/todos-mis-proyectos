/* =============================================
   Video Background Controller
   ============================================= */
(function () {
  'use strict';

  var VIDEO_SRC = 'fondo%20y%20videos/video%20de%20fondo%20unido.mp4';
  var LS_TIME   = 'btpir_vtime';
  var SS_TAB    = 'btpir_tab';

  function isNewTab() {
    try {
      if (!sessionStorage.getItem(SS_TAB)) {
        sessionStorage.setItem(SS_TAB, '1');
        return true;
      }
    } catch (e) {}
    return false;
  }

  function getSavedTime() {
    if (isNewTab()) {
      try { localStorage.setItem(LS_TIME, '0'); } catch (e) {}
      return 0;
    }
    try {
      var t = parseFloat(localStorage.getItem(LS_TIME) || '0');
      return (isNaN(t) || t < 0) ? 0 : t;
    } catch (e) { return 0; }
  }

  function init() {
    var container = document.getElementById('video-bg-container');
    if (!container) return;

    var savedTime = getSavedTime();

    var v = document.createElement('video');
    v.className   = 'bg-video';
    v.src         = VIDEO_SRC;
    v.muted       = true;
    v.loop        = true;
    v.playsInline = true;
    v.preload     = 'auto';
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');

    v.addEventListener('timeupdate', function () {
      try { localStorage.setItem(LS_TIME, v.currentTime); } catch (e) {}
    });

    container.appendChild(v);

    function startPlay() {
      if (savedTime > 0.5) {
        try { v.currentTime = savedTime; } catch (e) {}
      }
      var p = v.play();
      if (p !== undefined) {
        p.catch(function () {
          document.addEventListener('click', function () { v.play(); }, { once: true });
        });
      }
    }

    if (v.readyState >= 1) {
      startPlay();
    } else {
      v.addEventListener('loadedmetadata', startPlay, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* =============================================
   Navegación - Menú Hamburger
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  var toggle   = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
});

/* =============================================
   Animaciones scroll reveal
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-aos]').forEach(function (el) {
    observer.observe(el);
  });
});

/* =============================================
   Acordeón
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.acc-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item   = header.closest('.acc-item');
      var body   = item.querySelector('.acc-body');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.acc-item').forEach(function (it) {
        it.classList.remove('open');
        it.querySelector('.acc-body').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
});

/* ==========================================================================
   VENTANA FLOTANTE ANIMADA: EXPERIENCIA & CONVERSIÓN DE VOTACIONES
   Aparece en TODAS las páginas (Inicio, Contacto, Logros, etc.)
   Especialmente optimizada si vienen desde el sitio de votaciones.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  // Excluir solo el panel de administración
  if (window.location.pathname.toLowerCase().indexOf('admin') !== -1) {
    return;
  }

  // Detectar si el usuario viene de la página de votaciones
  var ref = (document.referrer || '').toLowerCase();
  var isFromVotaciones = ref.indexOf('votaciones') !== -1 || ref.indexOf('chevez-votaciones') !== -1 || window.location.search.indexOf('votaciones') !== -1;

  // Si no viene de votaciones, respetar si ya lo cerró en la misma pestaña
  if (!isFromVotaciones) {
    try {
      if (sessionStorage.getItem('btpir_modal_cerrado')) {
        return;
      }
    } catch (e) {}
  }

  // INYECCIÓN DE ESTILOS BLINDADOS (Funciona 100% independiente del CSS del servidor)
  var styleId = 'estilos-ventana-flotante-btpir';
  if (!document.getElementById(styleId)) {
    var s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      @keyframes modalOverlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalPopUp {
        0% { transform: scale(0.7) translateY(40px); opacity: 0; }
        60% { transform: scale(1.03) translateY(-6px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 25px rgba(0, 212, 232, 0.4), inset 0 0 15px rgba(125, 249, 255, 0.15); }
        50% { box-shadow: 0 0 45px rgba(0, 212, 232, 0.8), inset 0 0 25px rgba(125, 249, 255, 0.35); }
      }
      @keyframes robotFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(4deg); }
      }

      #ventana-flotante-wrap {
        position: fixed !important;
        inset: 0 !important;
        z-index: 9999999 !important;
        background: rgba(3, 8, 22, 0.88) !important;
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 1rem !important;
        animation: modalOverlayFadeIn 0.35s ease forwards;
      }

      #ventana-flotante-card {
        background: linear-gradient(145deg, #07193b 0%, #030d22 100%) !important;
        border: 2px solid #7DF9FF !important;
        border-radius: 24px !important;
        max-width: 520px !important;
        width: 100% !important;
        padding: 2.2rem 2rem !important;
        position: relative !important;
        text-align: center !important;
        color: #ffffff !important;
        animation: modalPopUp 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, pulseGlow 3s infinite ease-in-out !important;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      }

      #ventana-btn-cerrar {
        position: absolute !important;
        top: 14px !important;
        right: 16px !important;
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(125, 249, 255, 0.4) !important;
        color: #e0f7ff !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        font-size: 1.4rem !important;
        font-weight: 300 !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.2s ease !important;
        line-height: 1 !important;
      }
      #ventana-btn-cerrar:hover {
        background: rgba(255, 80, 80, 0.35) !important;
        border-color: #ff8888 !important;
        color: #ffffff !important;
        transform: rotate(90deg) !important;
      }

      .flotante-robot-icon {
        font-size: 3.2rem !important;
        color: #7DF9FF !important;
        margin-bottom: 0.6rem !important;
        display: inline-block !important;
        animation: robotFloat 3s infinite ease-in-out !important;
        filter: drop-shadow(0 0 15px rgba(125, 249, 255, 0.8)) !important;
      }

      .flotante-badge {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        background: rgba(125, 249, 255, 0.15) !important;
        border: 1px solid #7DF9FF !important;
        color: #7DF9FF !important;
        font-size: 0.78rem !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1.2px !important;
        padding: 0.35rem 1rem !important;
        border-radius: 50px !important;
        margin-bottom: 0.9rem !important;
      }

      .flotante-titulo {
        font-size: 1.45rem !important;
        font-weight: 900 !important;
        color: #ffffff !important;
        line-height: 1.25 !important;
        margin-bottom: 0.8rem !important;
        letter-spacing: -0.3px !important;
      }
      .flotante-titulo span {
        color: #7DF9FF !important;
        text-shadow: 0 0 18px rgba(125, 249, 255, 0.6) !important;
      }

      .flotante-cuerpo {
        font-size: 0.92rem !important;
        color: #C8E8F0 !important;
        line-height: 1.65 !important;
        margin-bottom: 1.1rem !important;
      }

      .flotante-caja-destacada {
        background: rgba(125, 249, 255, 0.08) !important;
        border: 1px solid rgba(125, 249, 255, 0.3) !important;
        border-left: 4px solid #7DF9FF !important;
        border-radius: 10px !important;
        padding: 0.85rem 1rem !important;
        font-size: 0.88rem !important;
        color: #E0F7FF !important;
        text-align: left !important;
        margin-bottom: 1.4rem !important;
        display: flex !important;
        align-items: flex-start !important;
        gap: 10px !important;
      }

      .flotante-acciones {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
      }

      .flotante-btn-accion {
        background: linear-gradient(135deg, #00D4E8 0%, #0088CC 100%) !important;
        color: #030d22 !important;
        font-weight: 800 !important;
        font-size: 1.05rem !important;
        padding: 0.95rem 1.4rem !important;
        border-radius: 14px !important;
        text-decoration: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        box-shadow: 0 6px 25px rgba(0, 212, 232, 0.5) !important;
        border: none !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
      }
      .flotante-btn-accion:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 10px 35px rgba(0, 212, 232, 0.8) !important;
      }

      .flotante-btn-secundario {
        background: transparent !important;
        border: 1px solid rgba(125, 249, 255, 0.3) !important;
        color: #C8E8F0 !important;
        font-size: 0.88rem !important;
        padding: 0.65rem 1rem !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      .flotante-btn-secundario:hover {
        background: rgba(255, 255, 255, 0.08) !important;
        color: #ffffff !important;
        border-color: #7DF9FF !important;
      }

      @media (max-width: 500px) {
        #ventana-flotante-card {
          padding: 1.6rem 1.2rem !important;
          border-radius: 18px !important;
        }
        .flotante-robot-icon { font-size: 2.5rem !important; }
        .flotante-titulo { font-size: 1.22rem !important; }
        .flotante-cuerpo { font-size: 0.86rem !important; }
        .flotante-caja-destacada { font-size: 0.82rem !important; padding: 0.7rem 0.8rem !important; }
        .flotante-btn-accion { font-size: 0.95rem !important; padding: 0.85rem 1rem !important; }
      }
    `;
    document.head.appendChild(s);
  }

  // Aparecer de inmediato si viene de votaciones, o con 600ms de animación en general
  var delay = isFromVotaciones ? 150 : 600;

  setTimeout(function () {
    // Si ya existe en el DOM no duplicar
    if (document.getElementById('ventana-flotante-wrap')) return;

    var overlay = document.createElement('div');
    overlay.id = 'ventana-flotante-wrap';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    var isContactoPage = window.location.pathname.toLowerCase().indexOf('contacto.html') !== -1;
    var botonHref = isContactoPage ? '#formContacto' : 'contacto.html';

    overlay.innerHTML = `
      <div id="ventana-flotante-card">
        <button id="ventana-btn-cerrar" aria-label="Cerrar">&times;</button>
        <div class="flotante-robot-icon"><i class="fa-solid fa-robot"></i></div>
        <br/>
        <div class="flotante-badge"><i class="fa-solid fa-award"></i> BTPIR · Robótica Oficial</div>
        
        <h3 class="flotante-titulo">¿Te ha gustado la <span>experiencia</span> con nosotros?</h3>
        
        <p class="flotante-cuerpo">
          ¡Acabas de conocer lo que somos capaces de crear! En el <strong>CEMG Eduardo Hernández Chévez</strong> no solo aprendes teoría: <strong>construyes robots reales, programas sistemas con inteligencia artificial y compites en olimpiadas de tecnología</strong>.
        </p>

        <div class="flotante-caja-destacada">
          <i class="fa-solid fa-graduation-cap" style="color:#7DF9FF; font-size:1.3rem; margin-top:2px;"></i>
          <div>
            <strong>¿Quieres estudiar con nosotros?</strong><br/>
            Si vienes a conocer los requisitos de ingreso y asegurar tu cupo para el nuevo período, completa el formulario de orientación ahora mismo.
          </div>
        </div>

        <div class="flotante-acciones">
          <a href="${botonHref}" class="flotante-btn-accion" id="flotante-btn-ir-formulario">
            <i class="fa-solid fa-file-signature"></i> ¡Quiero Ingresar! Llenar Formulario
          </a>
          <button class="flotante-btn-secundario" id="ventana-btn-explorar">
            Continuar explorando la web
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    function cerrarVentana() {
      overlay.style.transition = 'opacity 0.25s ease';
      overlay.style.opacity = '0';
      try {
        sessionStorage.setItem('btpir_modal_cerrado', '1');
      } catch (e) {}
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 260);
    }

    var btnCerrar = document.getElementById('ventana-btn-cerrar');
    var btnExplorar = document.getElementById('ventana-btn-explorar');
    var btnIrForm = document.getElementById('flotante-btn-ir-formulario');

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarVentana);
    if (btnExplorar) btnExplorar.addEventListener('click', cerrarVentana);

    if (btnIrForm) {
      btnIrForm.addEventListener('click', function (e) {
        if (isContactoPage) {
          e.preventDefault();
          cerrarVentana();
          var formCard = document.getElementById('form-card') || document.getElementById('formContacto');
          if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            formCard.style.boxShadow = '0 0 35px #7DF9FF';
            setTimeout(function() {
              formCard.style.boxShadow = '';
            }, 1800);
          }
        } else {
          try { sessionStorage.setItem('btpir_modal_cerrado', '1'); } catch (err) {}
        }
      });
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        cerrarVentana();
      }
    });
  }, delay);
});
