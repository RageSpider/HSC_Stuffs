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

    // 3. Setup Site Database for Algorithmic Suggestions (Tailored for Chemistry)
    const siteMap = [
        { file: 'chapter/1-safety.html', title: 'ল্যাবরেটরির নিরাপদ ব্যবহার', category: 'chapter' },
        { file: 'chapter/2-qualitative.html', title: 'গুণগত রসায়ন', category: 'chapter' },
        { file: 'chapter/3-periodic.html', title: 'পর্যায়বৃত্ত ধর্ম ও বন্ধন', category: 'chapter' },
        { file: 'chapter/4-changes.html', title: 'রাসায়নিক পরিবর্তন', category: 'chapter' },
        { file: 'chapter/5-working.html', title: 'কর্মমুখী রসায়ন', category: 'chapter' },
        { file: 'topic/quantum-numbers.html', title: 'কোয়ান্টাম সংখ্যা ক্যালকুলেটর', category: 'tool' },
        { file: 'topic/periodic-table.html', title: 'পর্যায় সারণি (Interactive)', category: 'tool' },
        { file: 'topic/ph-math.html', title: 'pH ও বাফার ম্যাথ', category: 'math' },
        { file: 'topic/solubility.html', title: 'দ্রাব্যতা ও Ksp', category: 'math' },
        { file: 'topic/board-questions.html', title: 'বিগত বছরের বোর্ড প্রশ্ন', category: 'resource' }
    ];

    // Mock tracking variables (In a real app, read from localStorage)
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const topVisitedFiles = []; // e.g., ['chapter/2-qualitative.html']

    // 4. Generate Quick Links (Always show core tools & resources)
    const quickLinksList = document.getElementById('quick-links-list');
    if (quickLinksList) {
        const quickLinks = siteMap.filter(p => p.category === 'tool' || p.category === 'resource').slice(0, 5);
        let quickLinksHtml = '';
        quickLinks.forEach(pageData => {
            quickLinksHtml += `<li><a href="${pageData.file}">${pageData.title}</a></li>`;
        });
        quickLinksList.innerHTML = quickLinksHtml;
    }

    // 5. Generate Suggestions (Aro Dekhte Paro - The algorithm)
    const suggestionList = document.getElementById('suggestion-links-list');
    if (suggestionList) {
        let favoriteCategory = 'chapter'; // default fallback
        if (topVisitedFiles.length > 0) {
            const topPageData = siteMap.find(p => p.file === topVisitedFiles[0]);
            if (topPageData) favoriteCategory = topPageData.category;
        }

        // Filter for unvisited related pages
        const suggestions = siteMap.filter(p => p.category === favoriteCategory && !topVisitedFiles.includes(p.file) && p.file !== currentFile).slice(0, 5);
                                   
        if (suggestions.length < 5) {
            const extra = siteMap.filter(p => !topVisitedFiles.includes(p.file) && !suggestions.includes(p) && p.file !== currentFile).slice(0, 5 - suggestions.length);
            suggestions.push(...extra);
        }

        let suggestionHtml = '';
        suggestions.forEach(pageData => {
            suggestionHtml += `<li><a href="${pageData.file}">${pageData.title}</a></li>`;
        });
        suggestionList.innerHTML = suggestionHtml;
    }
});