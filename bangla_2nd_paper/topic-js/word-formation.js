// topic-js/word-formation.js

window.switchTab = function(targetId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pseudo-page').forEach(p => {
        p.classList.remove('active');
        gsap.set(p, { opacity: 0 }); // Reset for GSAP
    });
    
    const targetBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
    const targetPage = document.getElementById(targetId);
    
    if (targetBtn) targetBtn.classList.add('active');
    if (targetPage) {
        targetPage.classList.add('active');
        gsap.to(targetPage, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }

    window.scrollTo({ top: document.querySelector('.pages-container').offsetTop - 100, behavior: 'smooth' });
};

document.addEventListener("DOMContentLoaded", () => {
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.switchTab(e.currentTarget.getAttribute('data-target'));
        });
    });

    // Banglish Map
    const banglaToEnglishMap = {
        'অ':'o', 'আ':'a', 'ই':'i', 'ঈ':'i', 'উ':'u', 'ঊ':'u', 'ঋ':'ri', 'এ':'e', 'ঐ':'oi', 'ও':'o', 'ঔ':'ou',
        'ক':'k', 'খ':'kh', 'গ':'g', 'ঘ':'gh', 'ঙ':'ng',
        'চ':'c', 'ছ':'ch', 'জ':'j', 'ঝ':'jh', 'ঞ':'n',
        'ট':'t', 'ঠ':'th', 'ড':'d', 'ঢ':'dh', 'ণ':'n',
        'ত':'t', 'থ':'th', 'দ':'d', 'ধ':'dh', 'ন':'n',
        'প':'p', 'ফ':'f', 'ব':'b', 'ভ':'bh', 'ম':'m',
        'য':'j', 'র':'r', 'ল':'l',
        'শ':'s', 'ষ':'s', 'স':'s', 'হ':'h',
        'ড়':'r', 'ঢ়':'rh', 'য়':'y', 'ৎ':'t', 'ং':'ng', 'ঃ':'h', 'ঁ':'n',
        'া':'a', 'ি':'i', 'ী':'i', 'ু':'u', 'ূ':'u', 'ৃ':'ri', 'ে':'e', 'ৈ':'oi', 'ো':'o', 'ৌ':'ou',
        '্':'', '্য':'y', '্র':'r'
    };

    function toBanglish(word) {
        let res = '';
        for(let char of word) { res += banglaToEnglishMap[char] || char; }
        return res.toLowerCase().replace(/sh/g, 's').replace(/ch/g, 'c'); 
    }

    let globalProttoyData = []; 
    let globalSamasData = [];

    const toBanglaDigits = str => str.replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);
    const boardNames = {'ঢা.':'ঢাকা', 'রা.':'রাজশাহী', 'য.':'যশোর', 'কু.':'কুমিল্লা', 'চ.':'চট্টগ্রাম', 'সি.':'সিলেট', 'ব.':'বরিশাল', 'দি.':'দিনাজপুর', 'ম.':'ময়মনসিংহ'};

    // --- RULES RENDERER ---
    const renderRules = (data) => {
        const container = document.querySelector('.rules-container');
        if (!container) return;
        let html = '';
        data.forEach(rule => {
            const boardsHtml = rule.boards && rule.boards.length > 0 
                ? rule.boards.map(b => `<span class="board-tag bn-text">${b}</span>`).join('') 
                : '';
                
            html += `
                <div class="rule-card">
                    <h3 class="rule-question bn-text">${rule.question}</h3>
                    ${boardsHtml ? `<div class="rule-boards">${boardsHtml}</div>` : ''}
                    <div class="rule-answer bn-text">${rule.answer}</div>
                </div>
            `;
        });
        container.innerHTML = html;

        gsap.fromTo(".rule-card", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }
        );
    };

    // --- PROTTOY LOGIC ---
    const populateProttoyFilters = (data) => {
        const boards = new Set();
        const types = new Set();

        data.forEach(item => {
            item._boards = [];
            types.add(item.type);
            if(item.boards) {
                const boardMatches = item.boards.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.)/g) || [];
                boardMatches.forEach(b => { boards.add(b); item._boards.push(b); });
            }
            item._banglishSearch = toBanglish(item.word + " " + item.breakdown);
        });

        const typeSelect = document.getElementById('typeFilter');
        [...types].sort().forEach(t => typeSelect.add(new Option(t, t)));

        const boardSelect = document.getElementById('boardFilter');
        [...boards].sort().forEach(b => boardSelect.add(new Option(boardNames[b] || b, b)));
    };

    const renderProttoy = (data) => {
        const container = document.getElementById('prottoy-grid');
        if (!container) return;

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো তথ্য পাওয়া যায়নি</h3>
                    <p>আপনার খোঁজার শর্তের সাথে মিলে এমন কোনো তথ্য নেই।</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        let html = '';
        data.forEach(item => {
            const parts = item.breakdown.split('+');
            const root = parts[0] ? parts[0].trim() : '';
            const suffix = parts[1] ? parts[1].trim() : '';
            const thirdPart = parts[2] ? ` <span class="plus">+</span> <span class="suffix">${parts[2].trim()}</span>` : '';

            html += `
                <div class="word-card">
                    <span class="card-type-badge bn-text">${item.type}</span>
                    <div class="word-equation bn-text">
                        <span class="root">${root}</span>
                        <span class="plus">+</span>
                        <span class="suffix">${suffix}</span>
                        ${thirdPart}
                    </div>
                    <i data-lucide="arrow-down" class="equation-arrow"></i>
                    <div class="word-result bn-text">${item.word}</div>
                    ${item.boards ? `<span class="word-boards bn-text">${item.boards}</span>` : ''}
                </div>
            `;
        });
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        gsap.fromTo("#prottoy-grid .word-card", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
    };

    // --- SAMAS LOGIC ---
    const populateSamasFilters = (data) => {
        const boards = new Set();
        const types = new Set();

        data.forEach(item => {
            item._boards = [];
            types.add(item.type);
            if(item.boards) {
                const boardMatches = item.boards.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.)/g) || [];
                boardMatches.forEach(b => { boards.add(b); item._boards.push(b); });
            }
            item._banglishSearch = toBanglish(item.word + " " + item.breakdown);
        });

        const typeSelect = document.getElementById('samasTypeFilter');
        [...types].sort().forEach(t => typeSelect.add(new Option(t, t)));

        const boardSelect = document.getElementById('samasBoardFilter');
        [...boards].sort().forEach(b => boardSelect.add(new Option(boardNames[b] || b, b)));
    };

    const renderSamas = (data) => {
        const container = document.getElementById('samas-grid');
        if (!container) return;

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো তথ্য পাওয়া যায়নি</h3>
                    <p>আপনার খোঁজার শর্তের সাথে মিলে এমন কোনো তথ্য নেই।</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        let html = '';
        data.forEach(item => {
            html += `
                <div class="samas-card">
                    <div class="samas-word bn-text">${item.word}</div>
                    <i data-lucide="arrow-down" class="equation-arrow"></i>
                    <div class="samas-breakdown bn-text">${item.breakdown}</div>
                    <div class="samas-type bn-text">${item.type}</div>
                    ${item.boards ? `<span class="word-boards bn-text">${item.boards}</span>` : ''}
                </div>
            `;
        });
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        gsap.fromTo("#samas-grid .samas-card", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
    };

    // --- FETCH DATA ---
    fetch('../topic-data/word-formation/word-formation_rules.json')
        .then(res => res.json())
        .then(data => renderRules(data))
        .catch(err => console.error(err));

    fetch('../topic-data/word-formation/word-formation_practice.json')
        .then(res => res.json())
        .then(data => {
            globalProttoyData = data;
            populateProttoyFilters(data);
            renderProttoy(data);
        })
        .catch(err => console.error(err));

    fetch('../topic-data/word-formation/word-formation_samas.json')
        .then(res => res.json())
        .then(data => {
            globalSamasData = data;
            populateSamasFilters(data);
            renderSamas(data);
        })
        .catch(err => console.error(err));

    // --- FILTER LOGIC (Debounced) ---
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Prottoy Filter
    const searchInput = document.getElementById('wordSearch');
    const clearBtn = document.getElementById('clearSearch');
    const typeFilter = document.getElementById('typeFilter');
    const boardFilter = document.getElementById('boardFilter');

    const applyProttoyFilters = () => {
        const term = searchInput.value.trim().toLowerCase();
        const simplifiedTerm = term.replace(/sh/g, 's').replace(/ch/g, 'c');
        const fType = typeFilter.value;
        const fBoard = boardFilter.value;

        clearBtn.style.display = term.length > 0 ? 'block' : 'none';

        const filtered = globalProttoyData.filter(item => {
            const textMatch = term === '' || item.word.includes(term) || item.breakdown.includes(term) || item._banglishSearch.includes(simplifiedTerm);
            const typeMatch = fType === 'all' || item.type === fType;
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            return textMatch && typeMatch && boardMatch;
        });
        renderProttoy(filtered);
    };

    const debouncedProttoy = debounce(applyProttoyFilters, 300);
    if (searchInput) searchInput.addEventListener('input', debouncedProttoy);
    if (typeFilter) typeFilter.addEventListener('change', applyProttoyFilters);
    if (boardFilter) boardFilter.addEventListener('change', applyProttoyFilters);
    if (clearBtn) clearBtn.addEventListener('click', () => { searchInput.value = ''; applyProttoyFilters(); searchInput.focus(); });

    // Samas Filter
    const samasSearchInput = document.getElementById('samasSearch');
    const samasClearBtn = document.getElementById('samasClearSearch');
    const samasTypeFilter = document.getElementById('samasTypeFilter');
    const samasBoardFilter = document.getElementById('samasBoardFilter');

    const applySamasFilters = () => {
        const term = samasSearchInput.value.trim().toLowerCase();
        const simplifiedTerm = term.replace(/sh/g, 's').replace(/ch/g, 'c');
        const fType = samasTypeFilter.value;
        const fBoard = samasBoardFilter.value;

        samasClearBtn.style.display = term.length > 0 ? 'block' : 'none';

        const filtered = globalSamasData.filter(item => {
            const textMatch = term === '' || item.word.includes(term) || item.breakdown.includes(term) || item._banglishSearch.includes(simplifiedTerm);
            const typeMatch = fType === 'all' || item.type === fType;
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            return textMatch && typeMatch && boardMatch;
        });
        renderSamas(filtered);
    };

    const debouncedSamas = debounce(applySamasFilters, 300);
    if (samasSearchInput) samasSearchInput.addEventListener('input', debouncedSamas);
    if (samasTypeFilter) samasTypeFilter.addEventListener('change', applySamasFilters);
    if (samasBoardFilter) samasBoardFilter.addEventListener('change', applySamasFilters);
    if (samasClearBtn) samasClearBtn.addEventListener('click', () => { samasSearchInput.value = ''; applySamasFilters(); samasSearchInput.focus(); });
});