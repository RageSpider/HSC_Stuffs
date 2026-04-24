// js/navbar.js
document.addEventListener("navbarLoaded", () => {
    const navbar = document.getElementById('main-nav');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled'); navbar.classList.remove('top-state');
        } else {
            navbar.classList.remove('scrolled'); navbar.classList.add('top-state');
        }
    });

    const closeMobileMenu = () => {
        navMenu.classList.remove('active'); navOverlay.classList.remove('active');
        if (hamburgerBtn) {
            const icon = hamburgerBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            if (isActive) closeMobileMenu();
            else {
                navMenu.classList.add('active'); navOverlay.classList.add('active');
                const icon = hamburgerBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'x');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

    dropdownWrappers.forEach(wrapper => {
        const toggleLink = wrapper.querySelector('.nav-item');
        toggleLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const href = toggleLink.getAttribute('href');
                if (href === 'javascript:void(0)') {
                    e.preventDefault(); wrapper.classList.toggle('open');
                } else if(href && href.startsWith('#')) {
                    setTimeout(() => closeMobileMenu(), 300);
                }
            }
        });
    });

    // Theme Logic for Physics
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    if (themeToggleBtn) {
        const moonIcon = themeToggleBtn.querySelector('.moon-icon');
        const sunIcon = themeToggleBtn.querySelector('.sun-icon');
        const savedTheme = localStorage.getItem('physics-theme') || 'light';
        
        htmlElement.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'dark') { moonIcon.style.display = 'none'; sunIcon.style.display = 'block'; } 
        else { moonIcon.style.display = 'block'; sunIcon.style.display = 'none'; }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('physics-theme', newTheme);
            if(newTheme === 'dark') { moonIcon.style.display = 'none'; sunIcon.style.display = 'block'; } 
            else { moonIcon.style.display = 'block'; sunIcon.style.display = 'none'; }
        });
    }
});