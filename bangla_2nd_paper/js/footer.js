// js/footer.js
document.addEventListener('footerLoaded', () => {
    // 1. Set current year dynamically
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Render Lucide icons for the footer
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Setup Site Database for Algorithmic Suggestions
    const siteMap = [
        { file: 'pronunciation.html', title: 'উচ্চারণের নিয়ম', category: 'grammar' },
        { file: 'spelling.html', title: 'বানানের নিয়ম', category: 'grammar' },
        { file: 'grammar-classes.html', title: 'শব্দশ্রেণি', category: 'grammar' },
        { file: 'word-formation.html', title: 'শব্দ গঠন', category: 'grammar' },
        { file: 'syntax.html', title: 'বাক্যতত্ত্ব', category: 'grammar' },
        { file: 'correction.html', title: 'অপপ্রয়োগ ও শুদ্ধ প্রয়োগ', category: 'grammar' },
        { file: 'terminology.html', title: 'পারিভাষিক শব্দ', category: 'composition' },
        { file: 'translation.html', title: 'অনুবাদ', category: 'composition' },
        { file: 'diary.html', title: 'দিনলিপি', category: 'composition' },
        { file: 'experience.html', title: 'অভিজ্ঞতা বর্ণন', category: 'composition' },
        { file: 'report.html', title: 'প্রতিবেদন রচনা', category: 'composition' },
        { file: 'speech.html', title: 'ভাষণ লিখন', category: 'composition' },
        { file: 'email.html', title: 'ই-মেইল', category: 'composition' },
        { file: 'sms.html', title: 'ক্ষুদেবার্তা', category: 'composition' },
        { file: 'letter.html', title: 'পত্রলিখন ও আবেদনপত্র', category: 'composition' },
        { file: 'summary.html', title: 'সারাংশ ও সারমর্ম', category: 'composition' },
        { file: 'amplification.html', title: 'ভাব-সম্প্রসারণ', category: 'composition' },
        { file: 'dialogue.html', title: 'সংলাপ রচনা', category: 'composition' },
        { file: 'story.html', title: 'খুদে গল্প লিখন', category: 'composition' },
        { file: 'essay.html', title: 'প্রবন্ধ-নিবন্ধ রচনা', category: 'composition' }
    ];

    // Read visit history
    let visitHistory = JSON.parse(localStorage.getItem('pageVisits')) || {};
    
    // Determine current file
    const pathArray = window.location.pathname.split('/');
    let currentFile = pathArray[pathArray.length - 1];
    if (currentFile === '') currentFile = 'index.html';

    // Update visit count
    if (currentFile !== 'index.html') {
        visitHistory[currentFile] = (visitHistory[currentFile] || 0) + 1;
        localStorage.setItem('pageVisits', JSON.stringify(visitHistory));
    }

    // Sort by visit count
    const sortedVisits = Object.entries(visitHistory).sort((a, b) => b[1] - a[1]);
    const topVisitedFiles = sortedVisits.map(item => item[0]);

    // 4. Generate Quick Links (Top 5 visited or fallback)
    const quickLinksList = document.getElementById('quick-links-list');
    if (quickLinksList) {
        let quickLinks = topVisitedFiles.map(file => siteMap.find(p => p.file === file)).filter(Boolean).slice(0, 5);
        if (quickLinks.length < 5) {
            const fallback = siteMap.filter(p => !quickLinks.includes(p)).slice(0, 5 - quickLinks.length);
            quickLinks.push(...fallback);
        }

        let quickLinksHtml = '';
        quickLinks.forEach(pageData => {
            const prefix = currentFile === 'index.html' || currentFile === '' ? 'topic/' : '';
            quickLinksHtml += `<li><a href="${prefix}${pageData.file}">${pageData.title}</a></li>`;
        });
        quickLinksList.innerHTML = quickLinksHtml;
    }

    // 5. Generate Suggestions (Aro Dekhte Paro)
    const suggestionList = document.getElementById('suggestion-links-list');
    if (suggestionList) {
        let favoriteCategory = 'composition'; // default fallback
        if (topVisitedFiles.length > 0) {
            const topPageData = siteMap.find(p => p.file === topVisitedFiles[0]);
            if (topPageData) favoriteCategory = topPageData.category;
        }

        // Filter for unvisited related pages
        const suggestions = siteMap.filter(p => p.category === favoriteCategory && !topVisitedFiles.includes(p.file)).slice(0, 5);
                                   
        if (suggestions.length < 5) {
            const extra = siteMap.filter(p => !topVisitedFiles.includes(p.file) && !suggestions.includes(p)).slice(0, 5 - suggestions.length);
            suggestions.push(...extra);
        }

        let suggestionHtml = '';
        suggestions.forEach(pageData => {
            const prefix = currentFile === 'index.html' || currentFile === '' ? 'topic/' : '';
            suggestionHtml += `<li><a href="${prefix}${pageData.file}">${pageData.title}</a></li>`;
        });
        suggestionList.innerHTML = suggestionHtml;
    }
});