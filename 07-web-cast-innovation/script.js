document.addEventListener("DOMContentLoaded", () => {
    // 1. Array of all available videos
    const videos = [
        "videos/20260418_115308.mp4",
        "videos/20260418_115623.mp4",
        "videos/20260418_114817.mp4",
        "videos/Bee-bot, blue-bot and pro-bot.mp4"
    ];

    const bgVideo = document.getElementById("bg-video");
    let currentVideoIndex = 0;

    // Initialize first video
    if (bgVideo) {
        bgVideo.src = videos[currentVideoIndex];
        
        // When one video ends, play the next one
        bgVideo.addEventListener("ended", () => {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            
            // Fade out
            bgVideo.style.opacity = 0;
            
            setTimeout(() => {
                bgVideo.src = videos[currentVideoIndex];
                bgVideo.play().catch(e => console.log("Autoplay prevented", e));
                
                // Fade in
                bgVideo.style.opacity = 1;
            }, 500); // Wait 500ms for transition
        });
    }

    // 2. Scroll Animations
    const scrollElements = document.querySelectorAll(".scroll-reveal");

    const elementInView = (el, scrollOffset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) - scrollOffset);
    };

    const displayScrollElement = (element) => {
        element.classList.add("visible");
    };

    const hideScrollElement = (element) => {
        element.classList.remove("visible");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 150)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    // Use Intersection Observer for better performance and correct re-showing
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                } else {
                    entry.target.classList.remove("visible");
                }
            });
        }, {
            threshold: 0.15
        });

        scrollElements.forEach((el) => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        window.addEventListener("scroll", () => {
            handleScrollAnimation();
        });
        // Trigger once on load
        handleScrollAnimation();
    }
});
