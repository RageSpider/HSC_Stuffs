// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // Heavy JS Canvas removed. Background is now 100% Pure CSS.

    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.fromTo(".hero-content .badge", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
          .fromTo(".hero-content h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-content p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-buttons", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-rings", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }, "-=0.8");

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header, 
                { y: 40, opacity: 0 },
                { scrollTrigger: { trigger: header, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
        });

        const hexWrappers = document.querySelectorAll('.hex-wrapper');
        if (hexWrappers.length > 0) {
            gsap.fromTo(hexWrappers,
                { scale: 0.6, opacity: 0 },
                { 
                    scrollTrigger: { trigger: '.hex-ring-container', start: "top 80%" }, 
                    scale: 1, opacity: 1, 
                    duration: 0.7, stagger: 0.1, ease: "back.out(1.5)" 
                }
            );
        }
        
        gsap.fromTo('.hex-center-logo',
            { scale: 0.5, opacity: 0 },
            { 
                scrollTrigger: { trigger: '.hex-ring-container', start: "top 60%" }, 
                scale: 1, opacity: 0.15, duration: 1.5, ease: "power2.out", delay: 0.5
            }
        );
    }
});