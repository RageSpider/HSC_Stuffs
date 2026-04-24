// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Init Lucide Icons globally
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // 2. Spotlight Card Hover Effect Logic
    const cardsContainer = document.getElementById('cards-container');
    const cards = document.querySelectorAll('.subject-card');

    // Set the specific color variable for each card based on its data attribute
    cards.forEach(card => {
        const color = card.getAttribute('data-color');
        if (color) {
            card.style.setProperty('--card-color', color);
        }
    });

    // Track mouse to update the radial gradient position
    if (cardsContainer) {
        cardsContainer.addEventListener('mousemove', (e) => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // 3. GSAP Animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        // Hero Content Parallax & Fade In
        tl.fromTo(".gateway-content .badge", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
          .fromTo(".gradient-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".gateway-desc", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".scroll-indicator", { y: 30, opacity: 0 }, { y: 0, opacity: 0.7, duration: 0.8, ease: "power3.out" }, "-=0.4");

        // Subtle Parallax on Aurora blobs based on mouse movement
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            
            gsap.to(".aurora-1", { x: x, y: y, duration: 2, ease: "power2.out" });
            gsap.to(".aurora-2", { x: -x, y: -y, duration: 2, ease: "power2.out" });
            gsap.to(".aurora-3", { x: x * 1.5, y: y * -1.5, duration: 2, ease: "power2.out" });
        });

        // Spotlight Grid Stagger Animation on Scroll
        gsap.fromTo(cards,
            { y: 60, opacity: 0 },
            { 
                scrollTrigger: { trigger: ".spotlight-grid", start: "top 85%" }, 
                y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" 
            }
        );
    }
});