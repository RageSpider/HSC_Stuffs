// js/navbar.js
document.addEventListener('navbarLoaded', () => {
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Scroll Logic (Floating Pill)
    const navbar = document.getElementById('main-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('top-state');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.add('top-state');
            }
        });
    }

    // 3. Mobile Menu Toggle Logic
    const mobileBtn = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');

    const closeMobileMenu = () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        
        // Reset hamburger icon
        if (mobileBtn) {
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
        
        // Close any open mobile accordions
        document.querySelectorAll('.nav-dropdown-wrapper').forEach(wrapper => {
            wrapper.classList.remove('open');
        });
    };

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                // Open menu
                navMenu.classList.add('active');
                if (navOverlay) navOverlay.classList.add('active');
                
                // Change icon to 'X'
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'x');
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }
        });
    }

    // Close menu when clicking on overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    // 4. Mobile Dropdown Accordion Logic
    const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
    dropdownWrappers.forEach(wrapper => {
        const link = wrapper.querySelector('.nav-item');
        if (link) {
            link.addEventListener('click', (e) => {
                // Only act as an accordion on mobile viewports
                if (window.innerWidth <= 900) {
                    e.preventDefault(); // Prevent jump to top
                    wrapper.classList.toggle('open');
                }
            });
        }
    });

    // 5. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (themeBtn) {
        const moonIcon = document.querySelector('.moon-icon');
        const sunIcon = document.querySelector('.sun-icon');
        const savedTheme = localStorage.getItem('chem-theme') || 'light';
        
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);

        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('chem-theme', newTheme);
            updateThemeIcons(newTheme);
        });

        function updateThemeIcons(theme) {
            if(theme === 'dark') {
                if (moonIcon) moonIcon.style.display = 'none';
                if (sunIcon) sunIcon.style.display = 'block';
            } else {
                if (moonIcon) moonIcon.style.display = 'block';
                if (sunIcon) sunIcon.style.display = 'none';
            }
        }
    }
});