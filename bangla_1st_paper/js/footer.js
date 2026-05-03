// js/footer.js
document.addEventListener("footerLoaded", () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Site Data for recommendations using the updated underscore links
    const siteMap = [
        { file: 'oporichita.html', title: 'অপরিচিতা', category: 'prose' },
        { file: 'bilashi.html', title: 'বিলাসী', category: 'prose' },
        { file: 'raincoat.html', title: 'রেইনকোট', category: 'prose' },
        { file: 'sonar_tori.html', title: 'সোনার তরী', category: 'poetry' },
        { file: 'bidrohi.html', title: 'বিদ্রোহী', category: 'poetry' },
        { file: 'atharo_bochor_boyosh.html', title: 'আঠার বছর বয়স', category: 'poetry' },
        { file: 'lalshalu.html', title: 'লালসালু (উপন্যাস)', category: 'sahopath' },
        { file: 'sirajuddaula.html', title: 'সিরাজউদ্দৌলা (নাটক)', category: 'sahopath' },
        { file: 'board-questions.html', title: 'বোর্ড প্রশ্ন বিশ্লেষণ', category: 'resource' }
    ];

    let currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const prefix = (currentFile === 'index.html' || currentFile === '') ? 'topic/' : '';

    const quickLinksList = document.getElementById('quick-links-list');
    if (quickLinksList) {
        // Just take the first 5 elements for quick links
        const quickLinks = siteMap.slice(0, 5);
        quickLinksList.innerHTML = quickLinks.map(p => `<li><a href="${prefix}${p.file}">${p.title}</a></li>`).join('');
    }

    const suggestionList = document.getElementById('suggestion-links-list');
    if (suggestionList) {
        // Take the last few or specific ones for suggestions
        const suggestions = siteMap.filter(p => p.category === 'sahopath' || p.category === 'resource').concat(siteMap.slice(5, 7)).slice(0, 5);
        suggestionList.innerHTML = suggestions.map(p => `<li><a href="${prefix}${p.file}">${p.title}</a></li>`).join('');
    }
});