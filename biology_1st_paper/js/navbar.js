// js/navbar.js
document.addEventListener('navbarLoaded', () => {
    const navbar = document.getElementById('main-nav');
    
    // PC Scroll Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('top-state');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('top-state');
        }
    });

    // Mobile Fullscreen Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileNavBtn = document.getElementById('close-mobile-nav');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileMenuBtn && mobileNav && closeMobileNavBtn) {
        const toggleMobileMenu = () => {
            const isActive = mobileNav.classList.contains('active');
            if (isActive) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = ''; 
            } else {
                mobileNav.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        closeMobileNavBtn.addEventListener('click', toggleMobileMenu);
    }

    // Mobile Accordion Logic
    const accordions = document.querySelectorAll('.mob-accordion');
    accordions.forEach(acc => {
        const trigger = acc.querySelector('.mob-acc-trigger');
        trigger.addEventListener('click', () => {
            accordions.forEach(otherAcc => {
                if(otherAcc !== acc) otherAcc.classList.remove('open');
            });
            acc.classList.toggle('open');
        });
    });

    // Theme Logic for Biology 1st Paper
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (themeToggleBtn) {
        const moonIcon = themeToggleBtn.querySelector('.moon-icon');
        const sunIcon = themeToggleBtn.querySelector('.sun-icon');
        const savedTheme = localStorage.getItem('biology-theme') || 'light';
        
        htmlElement.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'dark') { moonIcon.style.display = 'none'; sunIcon.style.display = 'block'; } 
        else { moonIcon.style.display = 'block'; sunIcon.style.display = 'none'; }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('biology-theme', newTheme);
            
            if(newTheme === 'dark') { moonIcon.style.display = 'none'; sunIcon.style.display = 'block'; } 
            else { moonIcon.style.display = 'block'; sunIcon.style.display = 'none'; }
        });
    }
});