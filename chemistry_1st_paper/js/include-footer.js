// js/include-footer.js
document.addEventListener("DOMContentLoaded", () => {
    // Dynamically check if we are in the Netlify subfolder or local root
    const basePath = window.location.pathname.startsWith('/chemistry_1st_paper') 
        ? '/chemistry_1st_paper' 
        : '';

    fetch(`${basePath}/components/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load footer');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            // Dispatch event to initialize footer scripts
            document.dispatchEvent(new Event('footerLoaded'));
        })
        .catch(error => console.error('Error loading footer:', error));
});