// topic-js/translation.js

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

    // Board Abbreviation Mapper
    const boardMapper = {
        'DB': 'ঢাকা', 'RB': 'রাজশাহী', 'JB': 'যশোর', 'CB': 'কুমিল্লা', 
        'CtgB': 'চট্টগ্রাম', 'SB': 'সিলেট', 'BB': 'বরিশাল', 'DinB': 'দিনাজপুর', 
        'MB': 'ময়মনসিংহ', 'All': 'সকল বোর্ড', 'MadB': 'মাদ্রাসা'
    };

    const engToBnNum = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    const standardizeYear = (y) => y.split('').map(c => engToBnNum[c] || c).join('');

    // State
    let allPassages = [];
    let currentDeck = [];
    let favorites = JSON.parse(localStorage.getItem('translation_favorites')) || [];
    let fcIndex = 0;

    // Elements
    const searchInput = document.getElementById('global-search');
    const searchClear = document.getElementById('clearSearch');
    const filterBoard = document.getElementById('filter-board');
    const filterYear = document.getElementById('filter-year');
    const btnFavFilter = document.getElementById('toggle-favorites');
    
    const passageGrid = document.getElementById('passage-grid');
    const fcEnText = document.getElementById('fc-en-text');
    const fcBnText = document.getElementById('fc-bn-text');
    const fcBnContainer = document.getElementById('fc-bn-container');
    const fcBoardsText = document.getElementById('fc-boards-text');
    const fcCounter = document.getElementById('fc-counter');
    const fcFavBtn = document.getElementById('fc-fav-btn');
    const revealBtn = document.getElementById('reveal-btn');

    // Fetch
    fetch('/topic-data/translation/translation.json')
        .then(res => res.json())
        .then(data => {
            allPassages = data;
            populateFilters(allPassages);
            currentDeck = [...allPassages];
            renderArchive();
            initFocusMode();
        })
        .catch(err => {
            console.error(err);
            if(passageGrid) passageGrid.innerHTML = `<div class="empty-state bn-text"><p>তথ্য লোড করতে সমস্যা হয়েছে!</p></div>`;
        });

    function populateFilters(data) {
        const boards = new Set();
        const years = new Set();

        data.forEach((item, index) => {
            item._id = `trans_${index}`; // Assign unique ID for favorites
            item._boards = [];
            item._years = [];
            
            if (item.boards) {
                // Regex to catch patterns like "DB '25", "BB '17", "All '18"
                const matches = item.boards.match(/([A-Za-z]+)\s*'(\d{2})/g) || [];
                
                matches.forEach(match => {
                    const parts = match.split("'");
                    const bCode = parts[0].trim();
                    const yCode = parts[1].trim();
                    
                    const actualBoard = boardMapper[bCode] || bCode;
                    const cleanY = standardizeYear(yCode);
                    
                    boards.add(actualBoard);
                    years.add(cleanY);
                    
                    item._boards.push(actualBoard);
                    item._years.push(cleanY);
                });
            }
        });

        [...boards].sort().forEach(b => filterBoard.add(new Option(b, b)));
        [...years].sort((a,b) => b.localeCompare(a)).forEach(y => filterYear.add(new Option("২০" + y, y)));
    }

    function applyFilters() {
        const term = searchInput.value.trim().toLowerCase();
        const fBoard = filterBoard.value;
        const fYear = filterYear.value;
        const onlyFavs = btnFavFilter.classList.contains('active');

        if (searchClear) searchClear.style.display = term.length > 0 ? 'block' : 'none';

        currentDeck = allPassages.filter(item => {
            const textMatch = term === '' || 
                              item.en.toLowerCase().includes(term) || 
                              item.bn.includes(term);
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            const yearMatch = fYear === 'all' || item._years.includes(fYear);
            const favMatch = !onlyFavs || favorites.includes(item._id);

            return textMatch && boardMatch && yearMatch && favMatch;
        });

        renderArchive();
        initFocusMode();
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

    // --- ARCHIVE VIEW ---
    function renderArchive() {
        if (!passageGrid) return;
        if (currentDeck.length === 0) {
            passageGrid.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো অনুচ্ছেদ পাওয়া যায়নি</h3>
                </div>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        passageGrid.innerHTML = currentDeck.map(item => {
            const isFav = favorites.includes(item._id);
            return `
            <div class="passage-card">
                <div class="passage-header">
                    ${item.boards ? `<span class="passage-boards bn-text"><i data-lucide="tag" style="width:14px;height:14px;"></i> ${item.boards}</span>` : '<span></span>'}
                    <div class="card-actions">
                        <button class="btn-copy" data-text="${item.bn}" title="বঙ্গানুবাদ কপি করুন">
                            <i data-lucide="copy"></i>
                        </button>
                        <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${item._id}" title="সংরক্ষণ করুন">
                            <i data-lucide="bookmark"></i>
                        </button>
                    </div>
                </div>
                <div class="passage-body">
                    <p class="en-text original-text">${item.en}</p>
                    <div class="translation-divider"></div>
                    <p class="bn-text translated-text">${item.bn}</p>
                </div>
            </div>
        `}).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Stagger animation
        gsap.fromTo("#passage-grid .passage-card", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );

        // Copy Listeners
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-text');
                navigator.clipboard.writeText(text);
                const icon = e.currentTarget.querySelector('i');
                icon.setAttribute('data-lucide', 'check');
                lucide.createIcons();
                setTimeout(() => {
                    icon.setAttribute('data-lucide', 'copy');
                    lucide.createIcons();
                }, 2000);
            });
        });

        // Fav Listeners
        document.querySelectorAll('.btn-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                toggleFavorite(id);
                e.currentTarget.classList.toggle('active');
                if(btnFavFilter.classList.contains('active')) applyFilters();
            });
        });
    }

    // --- FOCUS MODE (PRACTICE) ---
    function initFocusMode() {
        if (!fcEnText) return;
        fcIndex = 0;
        
        if (currentDeck.length === 0) {
            fcEnText.textContent = "কোনো অনুচ্ছেদ নেই";
            fcBnText.textContent = "";
            fcCounter.textContent = "0 / 0";
            return;
        }
        updateFocusUI();
    }

    function updateFocusUI() {
        if(currentDeck.length === 0) return;
        const item = currentDeck[fcIndex];
        
        // Reset Reveal State
        fcBnContainer.classList.add('bn-content-hidden');
        revealBtn.style.display = 'inline-flex';
        
        fcEnText.textContent = item.en;
        fcBnText.textContent = item.bn;
        fcBoardsText.textContent = item.boards ? item.boards : '';
        fcCounter.textContent = `${fcIndex + 1} / ${currentDeck.length}`;
        
        if(favorites.includes(item._id)) {
            fcFavBtn.classList.add('active');
        } else {
            fcFavBtn.classList.remove('active');
        }

        // Animate content change
        gsap.fromTo(".focus-content", {opacity: 0, y: 10}, {opacity: 1, y:0, duration: 0.3});
    }

    if (revealBtn) {
        revealBtn.addEventListener('click', () => {
            revealBtn.style.display = 'none';
            fcBnContainer.classList.remove('bn-content-hidden');
            gsap.fromTo(fcBnContainer, {opacity: 0, y: -10}, {opacity: 1, y: 0, duration: 0.4});
        });
    }

    document.getElementById('fc-next')?.addEventListener('click', () => {
        if(currentDeck.length <= 1) return;
        fcIndex = (fcIndex + 1) % currentDeck.length;
        updateFocusUI();
    });

    document.getElementById('fc-prev')?.addEventListener('click', () => {
        if(currentDeck.length <= 1) return;
        fcIndex = (fcIndex - 1 + currentDeck.length) % currentDeck.length;
        updateFocusUI();
    });

    fcFavBtn?.addEventListener('click', () => {
        if(currentDeck.length === 0) return;
        const currentId = currentDeck[fcIndex]._id;
        toggleFavorite(currentId);
        updateFocusUI();
        renderArchive(); // Sync with archive
    });

    function toggleFavorite(id) {
        if(favorites.includes(id)) {
            favorites = favorites.filter(favId => favId !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem('translation_favorites', JSON.stringify(favorites));
    }
});