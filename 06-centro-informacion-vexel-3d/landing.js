document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Remove the class when it goes out of view to re-trigger on scroll back
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    // Navbar hide on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.glass-nav');

    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });

    // 2. Carousel Logic
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');

        if (nextButton && prevButton && slides.length > 0) {
            let currentSlideIndex = 0;

            const moveToSlide = (index) => {
                slides.forEach(slide => slide.classList.remove('current-slide'));
                slides[index].classList.add('current-slide');
            };

            nextButton.addEventListener('click', () => {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                moveToSlide(currentSlideIndex);
            });

            prevButton.addEventListener('click', () => {
                currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                moveToSlide(currentSlideIndex);
            });
        }
    }

    // 3. Particle System (Manta following cursor)
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    
    // Mouse coordinates
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        init();
    }
    window.addEventListener('resize', resize);

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 3 + 1;
            this.density = (Math.random() * 30) + 1;
            this.color = color;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            // Distance past which particles don't react
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            
            let directionX = (forceDirectionX * force * this.density);
            let directionY = (forceDirectionY * force * this.density);

            if (distance < mouse.radius) {
                // Move away from cursor
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to base
                if (this.x !== this.baseX) {
                    let dxBase = this.x - this.baseX;
                    this.x -= dxBase / 10;
                }
                if (this.y !== this.baseY) {
                    let dyBase = this.y - this.baseY;
                    this.y -= dyBase / 10;
                }
            }
        }
    }

    function init() {
        particles = [];
        let numberOfParticles = (canvas.width * canvas.height) / 9000;
        
        // Colors from the Google Antigravity image (Red, Blue, Purple)
        const colors = ['#E040FB', '#00d2ff', '#3a7bd5', '#ff0076'];

        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * innerWidth;
            let y = Math.random() * innerHeight;
            let color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        
        // Connect particles close to each other
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    opacityValue = 1 - (distance / 10000);
                    ctx.strokeStyle = `rgba(255,255,255,${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    resize();
    animate();
});
