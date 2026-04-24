// js/footer.js
document.addEventListener("footerLoaded", () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const siteMap = [
        { file: 'ch1.html', title: 'তাপগতিবিদ্যা', category: 'physics2' },
        { file: 'ch2.html', title: 'স্থির তড়িৎ', category: 'physics2' },
        { file: 'ch3.html', title: 'চলতড়িৎ', category: 'physics2' },
        { file: 'ch4.html', title: 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া', category: 'physics2' },
        { file: 'ch5.html', title: 'তড়িৎচৌম্বক আবেশ', category: 'physics2' },
        { file: 'ch6.html', title: 'জ্যামিতিক আলোকবিজ্ঞান', category: 'physics2' },
        { file: 'ch7.html', title: 'ভৌত আলোকবিজ্ঞান', category: 'physics2' },
        { file: 'ch8.html', title: 'আধুনিক পদার্থবিজ্ঞান', category: 'physics2' },
        { file: 'ch9.html', title: 'পরমাণু ও নিউক্লিয়ার', category: 'physics2' },
        { file: 'ch10.html', title: 'সেমিকন্ডাক্টর ও ইলেকট্রনিক্স', category: 'physics2' },
        { file: 'ch11.html', title: 'জ্যোতির্বিজ্ঞান', category: 'physics2' }
    ];

    // Unique LocalStorage key for Physics 2nd Paper
    let visitHistory = JSON.parse(localStorage.getItem('physics2Visits')) || {};
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