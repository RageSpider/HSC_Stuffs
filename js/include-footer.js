// js/include-footer.js (Main Website)
document.addEventListener("DOMContentLoaded", () => {
    fetch('/components/footer.html')
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
