// js/footer.js
document.addEventListener("footerLoaded", () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const siteMap = [
        { file: 'ch1.html', title: 'বিশ্ব ও বাংলাদেশ প্রেক্ষিত', category: 'ict' },
        { file: 'ch2.html', title: 'কমিউনিকেশন ও নেটওয়ার্কিং', category: 'ict' },
        { file: 'ch3.html', title: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', category: 'ict' },
        { file: 'ch4.html', title: 'ওয়েব ডিজাইন এবং HTML', category: 'ict' },
        { file: 'ch5.html', title: 'প্রোগ্রামিং ভাষা (C)', category: 'ict' },
        { file: 'ch6.html', title: 'ডাটাবেজ ম্যানেজমেন্ট সিস্টেম', category: 'ict' }
    ];

    // Unique LocalStorage key for ICT
    let visitHistory = JSON.parse(localStorage.getItem('ictVisits')) || {};
    let currentFile = 'index.html'; 
    
    const sortedVisits = Object.entries(visitHistory).sort((a, b) => b[1] - a[1]);
    const topVisitedFiles = sortedVisits.map(item => item[0]);

    const quickLinksList = document.getElementById('quick-links-list');
    if (quickLinksList) {
        let quickLinks = topVisitedFiles.map(file => siteMap.find(p => p.file === file)).filter(Boolean).slice(0, 5);
        if (quickLinks.length < 5) {
            const fallback = siteMap.filter(p => !quickLinks.includes(p)).slice(0, 5 - quickLinks.length);
            quickLinks.push(...fallback);
        }
        quickLinksList.innerHTML = quickLinks.map(p => `<li><a href="topic/${p.file}">${p.title}</a></li>`).join('');
    }

    const suggestionList = document.getElementById('suggestion-links-list');
    if (suggestionList) {
        let suggestions = siteMap.filter(p => !topVisitedFiles.includes(p.file)).slice(0, 5);
        suggestionList.innerHTML = suggestions.map(p => `<li><a href="topic/${p.file}">${p.title}</a></li>`).join('');
    }
});