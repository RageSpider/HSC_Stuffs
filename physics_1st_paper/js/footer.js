// js/footer.js
document.addEventListener("footerLoaded", () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const siteMap = [
        { file: 'ch1.html', title: 'ভৌত জগৎ ও পরিমাপ', category: 'physics' },
        { file: 'ch2.html', title: 'ভেক্টর ও ভেক্টর রাশি', category: 'physics' },
        { file: 'ch3.html', title: 'গতিবিদ্যা', category: 'physics' },
        { file: 'ch4.html', title: 'নিউটনীয় বলবিদ্যা', category: 'physics' },
        { file: 'ch5.html', title: 'কাজ, শক্তি ও ক্ষমতা', category: 'physics' },
        { file: 'ch6.html', title: 'মহাকর্ষ ও অভিকর্ষ', category: 'physics' },
        { file: 'ch7.html', title: 'পদার্থের গাঠনিক ধর্ম', category: 'physics' },
        { file: 'ch8.html', title: 'পর্যাবৃত্ত গতি', category: 'physics' },
        { file: 'ch9.html', title: 'তরঙ্গ', category: 'physics' },
        { file: 'ch10.html', title: 'আদর্শ গ্যাস ও গতিতত্ত্ব', category: 'physics' }
    ];

    let visitHistory = JSON.parse(localStorage.getItem('physicsVisits')) || {};
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