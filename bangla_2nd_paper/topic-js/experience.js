// topic-js/experience.js

document.addEventListener("DOMContentLoaded", () => {
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.addEventListener('navbarLoaded', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });

    // Banglish Mapping Logic
    const banglaToEnglishMap = {
        'অ':'o', 'আ':'a', 'ই':'i', 'ঈ':'i', 'উ':'u', 'ঊ':'u', 'ঋ':'ri', 'এ':'e', 'ঐ':'oi', 'ও':'o', 'ঔ':'ou',
        'ক':'k', 'খ':'kh', 'গ':'g', 'ঘ':'gh', 'ঙ':'ng', 'চ':'c', 'ছ':'ch', 'জ':'j', 'ঝ':'jh', 'ঞ':'n',
        'ট':'t', 'ঠ':'th', 'ড':'d', 'ঢ':'dh', 'ণ':'n', 'ত':'t', 'থ':'th', 'দ':'d', 'ধ':'dh', 'ন':'n',
        'প':'p', 'ফ':'f', 'ব':'b', 'ভ':'bh', 'ম':'m', 'য':'j', 'র':'r', 'ল':'l', 'শ':'s', 'ষ':'s', 'স':'s', 'হ':'h',
        'ড়':'r', 'ঢ়':'rh', 'য়':'y', 'ৎ':'t', 'ং':'ng', 'ঃ':'h', 'ঁ':'n',
        'া':'a', 'ি':'i', 'ী':'i', 'ু':'u', 'ূ':'u', 'ৃ':'ri', 'ে':'e', 'ৈ':'oi', 'ো':'o', 'ৌ':'ou',
        '্':'', '্য':'y', '্র':'r'
    };

    function toBanglish(word) {
        let res = '';
        for(let char of word) { res += banglaToEnglishMap[char] || char; }
        return res.toLowerCase().replace(/sh/g, 's').replace(/ch/g, 'c'); 
    }

    const engToBnNum = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    const standardizeYear = (y) => y.split('').map(c => engToBnNum[c] || c).join('');
    const boardNames = {'ঢা.':'ঢাকা', 'রা.':'রাজশাহী', 'য.':'যশোর', 'কু.':'কুমিল্লা', 'চ.':'চট্টগ্রাম', 'সি.':'সিলেট', 'ব.':'বরিশাল', 'দি.':'দিনাজপুর', 'ম.':'ময়মনসিংহ', 'সকল':'সকল বোর্ড', 'বা.':'মাদ্রাসা/কারিগরী'};

    // State
    let allEntries = [];
    let currentEntries = [];
    let favorites = JSON.parse(localStorage.getItem('experience_favorites')) || [];

    // Elements
    const searchInput = document.getElementById('global-search');
    const searchClear = document.getElementById('clearSearch');
    const filterBoard = document.getElementById('filter-board');
    const filterYear = document.getElementById('filter-year');
    const btnFavFilter = document.getElementById('toggle-favorites');
    const container = document.getElementById('experience-container');

    // Fetch
    fetch('/topic-data/experience/experience.json')
        .then(res => res.json())
        .then(data => {
            allEntries = data;
            populateFilters(allEntries);
            currentEntries = [...allEntries];
            renderData();
        })
        .catch(err => {
            console.error(err);
            if(container) container.innerHTML = `<div class="empty-state bn-text"><p>তথ্য লোড করতে সমস্যা হয়েছে!</p></div>`;
        });

    function populateFilters(data) {
        const boards = new Set();
        const years = new Set();

        data.forEach(item => {
            item._boards = [];
            item._years = [];
            
            if (item.boards && Array.isArray(item.boards)) {
                item.boards.forEach(bStr => {
                    const bMatches = bStr.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.|বা\.|সকল)/g) || [];
                    bMatches.forEach(b => { boards.add(b); item._boards.push(b); });
                    
                    const yMatches = bStr.match(/'([০-৯]{2}|[0-9]{2})/g) || [];
                    yMatches.forEach(y => {
                        const cleanY = standardizeYear(y.replace("'", ""));
                        years.add(cleanY);
                        item._years.push(cleanY);
                    });
                });
            }
            item._banglishSearch = toBanglish(item.question);
        });

        [...boards].sort().forEach(b => filterBoard.add(new Option(boardNames[b] || b, b)));
        [...years].sort((a,b) => b.localeCompare(a)).forEach(y => filterYear.add(new Option("২০" + y, y)));
    }

    function applyFilters() {
        const term = searchInput.value.trim().toLowerCase();
        const simplifiedTerm = term.replace(/sh/g, 's').replace(/ch/g, 'c');
        const fBoard = filterBoard.value;
        const fYear = filterYear.value;
        const onlyFavs = btnFavFilter.classList.contains('active');

        if (searchClear) searchClear.style.display = term.length > 0 ? 'block' : 'none';

        currentEntries = allEntries.filter(item => {
            const textMatch = term === '' || 
                              item.question.toLowerCase().includes(term) || 
                              item._banglishSearch.includes(simplifiedTerm);
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            const yearMatch = fYear === 'all' || item._years.includes(fYear);
            const favMatch = !onlyFavs || favorites.includes(item.id);

            return textMatch && boardMatch && yearMatch && favMatch;
        });

        renderData();
    }

    const debounce = (fn, delay) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; };
    
    if(searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
    if(filterBoard) filterBoard.addEventListener('change', applyFilters);
    if(filterYear) filterYear.addEventListener('change', applyFilters);
    
    if (searchClear) {
        searchClear.addEventListener('click', () => { 
            searchInput.value = ''; 
            applyFilters(); 
            searchInput.focus(); 
        });
    }

    if(btnFavFilter) {
        btnFavFilter.addEventListener('click', () => {
            btnFavFilter.classList.toggle('active');
            applyFilters();
        });
    }

    function renderData() {
        if (!container) return;

        if (currentEntries.length === 0) {
            container.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো অভিজ্ঞতা পাওয়া যায়নি</h3>
                    <p>আপনার খোঁজার শর্তের সাথে মিলে এমন কোনো তথ্য নেই।</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        let html = '';
        currentEntries.forEach((item) => {
            const isFav = favorites.includes(item.id);
            const boardsHtml = (item.boards && item.boards.length > 0) 
                ? `${item.boards.map(b => `<span class="board-tag bn-text">${b}</span>`).join('')}` 
                : '';

            html += `
                <div class="experience-item" data-id="${item.id}">
                    <div class="experience-header-clickable">
                        <div class="experience-title-area">
                            <h3 class="experience-question bn-text">${item.question}</h3>
                            <div class="experience-meta bn-text">${boardsHtml}</div>
                        </div>
                        <div class="experience-controls">
                            <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${item.id}" title="পছন্দ তালিকায় যুক্ত করুন">
                                <i data-lucide="heart"></i>
                            </button>
                            <i data-lucide="chevron-down" class="chevron-icon"></i>
                        </div>
                    </div>
                    <div class="experience-answer-wrapper">
                        <div class="experience-answer bn-text">${item.answer}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Stagger animation
        gsap.fromTo(".experience-item", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );

        // Attach event listeners
        document.querySelectorAll('.experience-item').forEach(item => {
            const header = item.querySelector('.experience-header-clickable');
            const favBtn = item.querySelector('.btn-fav');
            const answerWrapper = item.querySelector('.experience-answer-wrapper');
            
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent accordion from triggering
                const id = parseInt(favBtn.getAttribute('data-id'));
                toggleFavorite(id);
                favBtn.classList.toggle('active');
                if(btnFavFilter.classList.contains('active')) applyFilters();
            });

            header.addEventListener('click', () => {
                const isExpanded = item.classList.contains('expanded');
                if (isExpanded) {
                    item.classList.remove('expanded');
                    gsap.to(answerWrapper, {
                        height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut",
                        onComplete: () => { answerWrapper.style.display = 'none'; }
                    });
                } else {
                    item.classList.add('expanded');
                    answerWrapper.style.display = 'block';
                    gsap.fromTo(answerWrapper, 
                        {height: 0, opacity: 0}, 
                        {height: "auto", opacity: 1, duration: 0.4, ease: "power2.out"}
                    );
                }
            });
        });
    }

    function toggleFavorite(id) {
        if(favorites.includes(id)) {
            favorites = favorites.filter(favId => favId !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem('experience_favorites', JSON.stringify(favorites));
    }
});