// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Init Lucide Icons globally
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // Note: Lenis smooth scroll removed. Relying on reliable Native Scrolling.

    // 2. GSAP Hero Section Intro Animations
    const tl = gsap.timeline();
    tl.fromTo(".hero-content .badge", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(".hero-content h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(".hero-content p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .fromTo(".hero-buttons", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

    // 3. Scroll-Triggered Section Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header, 
            { y: 40, opacity: 0 },
            { 
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                },
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out" 
            }
        );
    });

    // 4. Modern Cards Stagger Animation (Scroll-Triggered)
    gsap.utils.toArray('.modern-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.modern-card');
        gsap.fromTo(cards,
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%", // Triggers when the top of grid hits 85% of viewport
                },
                y: 0, 
                opacity: 1, 
                duration: 0.6, 
                stagger: 0.1, 
                ease: "power3.out"
            }
        );
    });
});