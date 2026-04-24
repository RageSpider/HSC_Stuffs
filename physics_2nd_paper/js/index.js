// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Init Lucide Icons globally
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // 2. GSAP Hero Section Intro Animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.fromTo(".hero-content .badge", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
          .fromTo(".hero-content h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-content p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-buttons", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".electromagnetic-core", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.25, duration: 2, ease: "power2.out" }, "-=0.8");

        // 3. Scroll-Triggered Section Headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header, 
                { y: 40, opacity: 0 },
                { scrollTrigger: { trigger: header, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
        });

        // 4. Unique 11-Item Cards Stagger Animation (Scroll-Triggered)
        gsap.utils.toArray('.physics2-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.p2-card');
            gsap.fromTo(cards,
                { y: 40, opacity: 0 },
                { scrollTrigger: { trigger: grid, start: "top 85%" }, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
        });
    }
});