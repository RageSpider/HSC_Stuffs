// js/include-navbar.js
document.addEventListener("DOMContentLoaded", () => {
    // Dynamically check if we are in the Netlify subfolder or local root
    const basePath = window.location.pathname.startsWith('/chemistry_1st_paper') 
        ? '/chemistry_1st_paper' 
        : '';

    fetch(`${basePath}/components/navbar.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load navbar');
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // --- FIX LINK ROUTING FOR NETLIFY SUBFOLDER ---
            const navLinks = document.querySelectorAll('#main-nav a');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                // If it's an absolute path, prepend the dynamic base path
                if (href && href.startsWith('/')) {
                    link.setAttribute('href', basePath + href);
                }
            });

            // Dispatch event to initialize navbar scripts
            document.dispatchEvent(new Event('navbarLoaded'));
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            document.getElementById('navbar-placeholder').innerHTML = '<p style="text-align:center; padding: 20px; color: red;">Failed to load navigation.</p>';
        });
});