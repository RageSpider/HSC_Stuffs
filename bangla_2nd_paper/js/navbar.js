// js/navbar.js
document.addEventListener('navbarLoaded', () => {
    const navbar = document.getElementById('main-nav');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');

    // Smooth Full-to-Pill Transition Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('top-state');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('top-state');
        }
    });

    // Helper: Close Mobile Menu
    const closeMobileMenu = () => {
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        
        if (hamburgerBtn) {
            const icon = hamburgerBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    };

    // Mobile Hamburger Toggle
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                navMenu.classList.add('active');
                navOverlay.classList.add('active');
                const icon = hamburgerBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'x');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // Close menu when clicking on the blurred overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Mobile Dropdown Click Handler (Accordion)
    dropdownWrappers.forEach(wrapper => {
        const toggleLink = wrapper.querySelector('.nav-item');
        toggleLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const href = toggleLink.getAttribute('href');
                // If it's not a real link (javascript:void(0)), toggle the accordion
                if (href === 'javascript:void(0)') {
                    e.preventDefault();
                    wrapper.classList.toggle('open');
                } else if(href && href.startsWith('#')) {
                    // It's a real anchor link, scroll and close menu
                    setTimeout(() => closeMobileMenu(), 300);
                }
            }
        });
    });

    // Close menu on regular link click in mobile
    const normalLinks = document.querySelectorAll('.nav-menu > li > a:not(.nav-item:has(.drop-icon))');
    normalLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // ==========================================
    // GLOBAL DARK MODE LOGIC (Managed by Navbar)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (themeToggleBtn) {
        const moonIcon = themeToggleBtn.querySelector('.moon-icon');
        const sunIcon = themeToggleBtn.querySelector('.sun-icon');

        // Check for saved user preference, default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        
        // Initial Icon State
        if(savedTheme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }

        // Toggle Event
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme); // Save preference

            // Swap icons smoothly
            if(newTheme === 'dark') {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        });
    }
});