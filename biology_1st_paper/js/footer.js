// js/footer.js
document.addEventListener("footerLoaded", () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Site Data for Biology 1st Paper
    const siteMap = [
        { file: 'ch1.html', title: 'কোষ ও এর গঠন' },
        { file: 'ch2.html', title: 'কোষ বিভাজন' },
        { file: 'ch4.html', title: 'অণুজীব' },
        { file: 'ch8.html', title: 'টিস্যু ও টিস্যুতন্ত্র' },
        { file: 'ch9.html', title: 'উদ্ভিদের শারীরতত্ত্ব' },
        { file: 'ch11.html', title: 'জীবপ্রযুক্তি' },
        { file: 'practical.html', title: 'ব্যবহারিক খাতা' },
        { file: 'board-questions.html', title: 'বোর্ড প্রশ্ন বিশ্লেষণ' }
    ];

    let currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const prefix = (currentFile === 'index.html' || currentFile === '') ? 'topic/' : '';

    const quickLinksList = document.getElementById('quick-links-list');
    if (quickLinksList) {
        const quickLinks = siteMap.slice(0, 5);
        quickLinksList.innerHTML = quickLinks.map(p => `<li><a href="${prefix}${p.file}">${p.title}</a></li>`).join('');
    }

    const suggestionList = document.getElementById('suggestion-links-list');
    if (suggestionList) {
        const suggestions = siteMap.slice(3, 8);
        suggestionList.innerHTML = suggestions.map(p => `<li><a href="${prefix}${p.file}">${p.title}</a></li>`).join('');
    }
});