// Lógica para reproducir los videos en bucle
const videos = [
    'assets/videos/vid1.mp4',
    'assets/videos/vid2.mp4',
    'assets/videos/vid3.mp4'
];

let currentVideoIndex = 0;
const videoElement = document.getElementById('bg-video');

if (videoElement) {
    // Inicializar el primer video
    videoElement.src = videos[currentVideoIndex];
    videoElement.load();
    videoElement.play().catch(e => console.log("Autoplay prevent prevented", e));

    // Event listener para cambiar al siguiente video cuando el actual termina
    videoElement.addEventListener('ended', () => {
        currentVideoIndex++;
        if (currentVideoIndex >= videos.length) {
            currentVideoIndex = 0; // Volver al primero para hacer el bucle
        }
        videoElement.src = videos[currentVideoIndex];
        videoElement.play();
    });
}

// Intersection Observer para animaciones de scroll
document.addEventListener('DOMContentLoaded', () => {
    // Animación hero original
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 1000); 
    }

    // Animaciones al hacer scroll
    const scrollElements = document.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right, .animated-card');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.1)) {
                displayScrollElement(el);
            }
        })
    }
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Run once on load
    handleScrollAnimation();
});
