// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Render Icons globally
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // 2. GSAP Animations for Smooth & Premium Feel
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Entry Animation Timeline (Removed the floating shape keyframes)
        const tl = gsap.timeline();
        tl.fromTo(".hero-content .badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
          .fromTo(".hero-content h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-content p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-buttons", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

        // Staggered Entry for the 5 Special Cards
        const cards = gsap.utils.toArray('.chapter-card');
        if(cards.length > 0) {
            gsap.fromTo(cards, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".special-grid",
                        start: "top 80%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out"
                }
            );
        }
    }
});