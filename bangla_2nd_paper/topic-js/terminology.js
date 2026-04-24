window.switchTab = function(targetId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pseudo-page').forEach(p => {
        p.classList.remove('active');
        gsap.set(p, { opacity: 0, display: 'none' }); 
    });
    
    const targetBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
    const targetPage = document.getElementById(targetId);
    
    if (targetBtn) targetBtn.classList.add('active');
    if (targetPage) {
        targetPage.classList.add('active');
        gsap.set(targetPage, { display: 'block' });
        gsap.to(targetPage, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.addEventListener('navbarLoaded', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });

    // Banglish Mapping Logic (from correction)
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
    let allWords = [];
    let currentDeck = [];
    let favorites = JSON.parse(localStorage.getItem('term_favorites')) || [];
    let fcIndex = 0;

    // Elements
    const searchInput = document.getElementById('global-search');
    const searchClear = document.getElementById('clearSearch');
    const filterBoard = document.getElementById('filter-board');
    const filterYear = document.getElementById('filter-year');
    const btnFavFilter = document.getElementById('toggle-favorites');
    
    const wordGrid = document.getElementById('word-grid');
    const fcCard = document.getElementById('flashcard');
    const fcFrontText = document.getElementById('fc-front-text');
    const fcBackText = document.getElementById('fc-back-text');
    const fcBoardsText = document.getElementById('fc-boards-text');
    const fcCounter = document.getElementById('fc-counter');
    const fcFavBtn = document.getElementById('fc-fav-btn');

    // Fetch
    fetch('/topic-data/terminology/terminology.json')
        .then(res => res.json())
        .then(data => {
            allWords = data.sort((a, b) => a.en.localeCompare(b.en));
            populateFilters(allWords);
            currentDeck = [...allWords];
            renderDictionary();
            initFlashcards();
        })
        .catch(err => {
            console.error(err);
            if(wordGrid) wordGrid.innerHTML = `<div class="empty-state bn-text"><p>তথ্য লোড করতে সমস্যা হয়েছে!</p></div>`;
        });

    function populateFilters(data) {
        const boards = new Set();
        const years = new Set();

        data.forEach(item => {
            item._boards = [];
            item._years = [];
            
            if (item.boards) {
                const bMatches = item.boards.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.|বা\.|সকল)/g) || [];
                bMatches.forEach(b => { boards.add(b); item._boards.push(b); });
                
                const yMatches = item.boards.match(/'([০-৯]{2}|[0-9]{2})/g) || [];
                yMatches.forEach(y => {
                    const cleanY = standardizeYear(y.replace("'", ""));
                    years.add(cleanY);
                    item._years.push(cleanY);
                });
            }
            item._banglishSearch = toBanglish(item.bn);
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

        currentDeck = allWords.filter(word => {
            const textMatch = term === '' || 
                              word.en.toLowerCase().includes(term) || 
                              word.bn.includes(term) || 
                              word._banglishSearch.includes(simplifiedTerm);
            const boardMatch = fBoard === 'all' || word._boards.includes(fBoard);
            const yearMatch = fYear === 'all' || word._years.includes(fYear);
            const favMatch = !onlyFavs || favorites.includes(word.en);

            return textMatch && boardMatch && yearMatch && favMatch;
        });

        renderDictionary();
        initFlashcards();
    }

    const debounce = (fn, delay) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; };
    
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    filterBoard.addEventListener('change', applyFilters);
    filterYear.addEventListener('change', applyFilters);
    
    if (searchClear) {
        searchClear.addEventListener('click', () => { 
            searchInput.value = ''; 
            applyFilters(); 
            searchInput.focus(); 
        });
    }

    btnFavFilter.addEventListener('click', () => {
        btnFavFilter.classList.toggle('active');
        applyFilters();
    });

    function renderDictionary() {
        if (!wordGrid) return;
        if (currentDeck.length === 0) {
            wordGrid.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো পারিভাষিক শব্দ পাওয়া যায়নি</h3>
                </div>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        wordGrid.innerHTML = currentDeck.map(word => {
            const isFav = favorites.includes(word.en);
            return `
            <div class="word-card">
                <div class="word-header">
                    <span class="word-en en-text">${word.en}</span>
                    <button class="btn-fav ${isFav ? 'active' : ''}" data-word="${word.en}">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
                <div class="word-bn bn-text">${word.bn}</div>
                ${word.boards ? `<div class="word-boards bn-text"><i data-lucide="tag" style="width:14px;height:14px;"></i> ${word.boards}</div>` : ''}
            </div>
        `}).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Stagger animation
        gsap.fromTo("#word-grid .word-card", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" }
        );

        document.querySelectorAll('.btn-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const w = e.currentTarget.getAttribute('data-word');
                toggleFavorite(w);
                e.currentTarget.classList.toggle('active');
                if(btnFavFilter.classList.contains('active')) applyFilters();
            });
        });
    }

    // Flashcards
    function initFlashcards() {
        if (!fcCard) return;
        fcIndex = 0;
        fcCard.classList.remove('flipped');
        
        if (currentDeck.length === 0) {
            fcFrontText.textContent = "কোনো শব্দ নেই";
            fcBackText.textContent = "";
            fcCounter.textContent = "0 / 0";
            return;
        }
        updateFlashcardUI();
    }

    function updateFlashcardUI() {
        if(currentDeck.length === 0) return;
        const word = currentDeck[fcIndex];
        
        fcFrontText.textContent = word.en;
        fcBackText.textContent = word.bn;
        fcBoardsText.textContent = word.boards ? word.boards : '';
        fcCounter.textContent = `${fcIndex + 1} / ${currentDeck.length}`;
        
        if(favorites.includes(word.en)) {
            fcFavBtn.classList.add('active');
        } else {
            fcFavBtn.classList.remove('active');
        }
    }

    if(fcCard) {
        fcCard.addEventListener('click', (e) => {
            if(e.target.closest('.fc-fav-btn')) return; 
            fcCard.classList.toggle('flipped');
        });
    }

    document.getElementById('fc-next')?.addEventListener('click', () => {
        if(currentDeck.length <= 1) return;
        fcCard.classList.remove('flipped');
        setTimeout(() => {
            fcIndex = (fcIndex + 1) % currentDeck.length;
            updateFlashcardUI();
        }, 200);
    });

    document.getElementById('fc-prev')?.addEventListener('click', () => {
        if(currentDeck.length <= 1) return;
        fcCard.classList.remove('flipped');
        setTimeout(() => {
            fcIndex = (fcIndex - 1 + currentDeck.length) % currentDeck.length;
            updateFlashcardUI();
        }, 200);
    });

    fcFavBtn?.addEventListener('click', () => {
        if(currentDeck.length === 0) return;
        const currentWord = currentDeck[fcIndex].en;
        toggleFavorite(currentWord);
        updateFlashcardUI();
        renderDictionary(); // Keep dictionary in sync
    });

    function toggleFavorite(wordEn) {
        if(favorites.includes(wordEn)) {
            favorites = favorites.filter(w => w !== wordEn);
        } else {
            favorites.push(wordEn);
        }
        localStorage.setItem('term_favorites', JSON.stringify(favorites));
    }
});