// js/include-navbar.js
document.addEventListener("DOMContentLoaded", () => {
    const basePath = window.location.pathname.startsWith('/physics_1st_paper') ? '/physics_1st_paper' : '';
    fetch(`${basePath}/components/navbar.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load navbar');
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            const navLinks = document.querySelectorAll('#main-nav a');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/')) {
                    link.setAttribute('href', basePath + href);
                }
            });
            document.dispatchEvent(new Event('navbarLoaded'));
        })
        .catch(error => console.error('Error loading navbar:', error));
});
