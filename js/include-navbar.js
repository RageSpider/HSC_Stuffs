// js/include-navbar.js (Main Website)
document.addEventListener("DOMContentLoaded", () => {
    fetch('/components/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load navbar');
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            document.dispatchEvent(new Event('navbarLoaded'));
        })
        .catch(error => console.error('Error loading navbar:', error));
});
