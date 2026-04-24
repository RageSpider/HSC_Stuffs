// topic-js/grammar-classes.js

// Make switchTab globally accessible for inline onclick handlers
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

    // Native Smooth Scroll
    window.scrollTo({ top: document.querySelector('.pages-container').offsetTop - 100, behavior: 'smooth' });
};

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.addEventListener('navbarLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // 2. Tab Button Event Listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.switchTab(e.currentTarget.getAttribute('data-target'));
        });
    });

    // 3. Banglish Phonetic Map for Smart Search
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

    // 4. Data Fetching & Rendering
    let globalGrammarData = []; 

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

    const populateFilters = (data) => {
        const classes = new Set();
        const boards = new Set();
        const years = new Set(); 
        
        const toBanglaDigits = str => str.replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]);

        data.forEach(item => {
            // Determine Grammar Class from Answer
            const mainClass = item.answer.split('-')[0].trim().split(' ')[0].trim();
            if(mainClass && !mainClass.includes(',')) {
                classes.add(mainClass);
                item._class = mainClass;
            } else {
                item._class = "mixed";
            }

            item._boards = [];
            item._years = [];
            
            if(item.boards) {
                const boardMatches = item.boards.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.)/g) || [];
                boardMatches.forEach(b => { boards.add(b); item._boards.push(b); });

                const yearMatches = item.boards.match(/'?[0-9০-৯]{2}(?![0-9০-৯])|(?:20|২০)[0-9০-৯]{2}/g) || [];
                yearMatches.forEach(y => { 
                    let cleanY = toBanglaDigits(y.replace(/'/g, ""));
                    if (cleanY.length === 2) cleanY = '২০' + cleanY;
                    item._years.push(cleanY); 
                    years.add(cleanY); 
                });
            }

            item._banglishSearch = toBanglish(item.question + " " + item.answer);
        });

        const classSelect = document.getElementById('classFilter');
        [...classes].filter(c => c.length > 2).sort().forEach(c => classSelect.add(new Option(c, c)));
        classSelect.add(new Option('মিশ্র (Mixed)', 'mixed'));

        const boardNames = {'ঢা.':'ঢাকা', 'রা.':'রাজশাহী', 'য.':'যশোর', 'কু.':'কুমিল্লা', 'চ.':'চট্টগ্রাম', 'সি.':'সিলেট', 'ব.':'বরিশাল', 'দি.':'দিনাজপুর', 'ম.':'ময়মনসিংহ'};
        const boardSelect = document.getElementById('boardFilter');
        [...boards].sort().forEach(b => boardSelect.add(new Option(boardNames[b] || b, b)));

        const yearSelect = document.getElementById('yearFilter');
        const sortedYears = [...years].sort((a, b) => b.localeCompare(a)); 
        sortedYears.forEach(y => yearSelect.add(new Option(y, y)));
    };

    const renderWords = (data) => {
        const container = document.querySelector('.word-grid');
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
            const badgeType = item.type === 'passage' ? 'অনুচ্ছেদ' : 'বাক্য';
            html += `
                <div class="word-card">
                    <span class="card-type-badge bn-text">${badgeType}</span>
                    <div class="word-question bn-text">${item.question}</div>
                    <div class="answer-badge bn-text"><i data-lucide="check-circle-2"></i> ${item.answer}</div>
                    ${item.boards ? `<span class="word-boards bn-text">${item.boards}</span>` : ''}
                </div>
            `;
        });
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        gsap.fromTo(".word-card", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
    };

    // FETCHING THE NEWLY RENAMED JSON FILES
    fetch('../topic-data/grammar-classes/grammar-classes_rules.json')
        .then(res => res.json())
        .then(data => renderRules(data))
        .catch(err => console.error('Error loading rules:', err));

    fetch('../topic-data/grammar-classes/grammar-classes_practice.json')
        .then(res => res.json())
        .then(data => {
            globalGrammarData = data;
            populateFilters(data);
            renderWords(data);
        })
        .catch(err => console.error('Error loading practice data:', err));

    // 5. Advanced Multi-Filter Logic with Debounce
    const searchInput = document.getElementById('wordSearch');
    const clearBtn = document.getElementById('clearSearch');
    const classFilter = document.getElementById('classFilter');
    const boardFilter = document.getElementById('boardFilter');
    const yearFilter = document.getElementById('yearFilter');

    // Debounce to improve typing performance
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const applyFilters = () => {
        const term = searchInput.value.trim().toLowerCase();
        const simplifiedTerm = term.replace(/sh/g, 's').replace(/ch/g, 'c');
        
        const fClass = classFilter.value;
        const fBoard = boardFilter.value;
        const fYear = yearFilter.value;

        clearBtn.style.display = term.length > 0 ? 'block' : 'none';

        const filtered = globalGrammarData.filter(item => {
            const textMatch = term === '' || 
                              item.question.includes(term) || 
                              item.answer.includes(term) || 
                              item._banglishSearch.includes(simplifiedTerm);
            
            const classMatch = fClass === 'all' || item._class === fClass;
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            const yearMatch = fYear === 'all' || item._years.includes(fYear);

            return textMatch && classMatch && boardMatch && yearMatch;
        });

        renderWords(filtered);
    };

    const debouncedApplyFilters = debounce(applyFilters, 300);

    if (searchInput) searchInput.addEventListener('input', debouncedApplyFilters);
    if (classFilter) classFilter.addEventListener('change', applyFilters);
    if (boardFilter) boardFilter.addEventListener('change', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            applyFilters();
            searchInput.focus();
        });
    }
});