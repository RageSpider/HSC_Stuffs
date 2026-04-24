// js/include-footer.js
document.addEventListener("DOMContentLoaded", () => {
    const basePath = window.location.pathname.startsWith('/english_2nd_paper') ? '/english_2nd_paper' : '';
    fetch(`${basePath}/components/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load footer');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            document.dispatchEvent(new Event('footerLoaded'));
        })
        .catch(error => console.error('Error loading footer:', error));
});
