// js/footer.js
document.addEventListener('footerLoaded', () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});