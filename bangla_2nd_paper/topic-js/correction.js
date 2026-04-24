// topic-js/correction.js

window.switchTab = function(targetId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pseudo-page').forEach(p => {
        p.classList.remove('active');
        gsap.set(p, { opacity: 0 }); 
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
    const standardizeYear = (y) => {
        return y.split('').map(c => engToBnNum[c] || c).join('');
    };

    let globalSentences = []; 
    let globalPassages = [];
    const boardNames = {'ঢা.':'ঢাকা', 'রা.':'রাজশাহী', 'য.':'যশোর', 'কু.':'কুমিল্লা', 'চ.':'চট্টগ্রাম', 'সি.':'সিলেট', 'ব.':'বরিশাল', 'দি.':'দিনাজপুর', 'ম.':'ময়মনসিংহ', 'সকল':'সকল বোর্ড'};

    // --- SENTENCE CORRECTION LOGIC ---
    const populateSentenceFilters = (data) => {
        const boards = new Set();
        const years = new Set();
        
        data.forEach(item => {
            item._boards = [];
            item._years = [];
            
            let boardStrings = [];
            if (Array.isArray(item.boards)) {
                boardStrings = item.boards;
            } else if (typeof item.boards === 'string') {
                boardStrings = [item.boards];
            }

            boardStrings.forEach(boardStr => {
                const bMatches = boardStr.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.|সকল)/g) || [];
                bMatches.forEach(b => { boards.add(b); item._boards.push(b); });
                
                const yMatches = boardStr.match(/'([০-৯]{2}|[0-9]{2})/g) || [];
                yMatches.forEach(y => {
                    const cleanY = standardizeYear(y.replace("'", ""));
                    years.add(cleanY);
                    item._years.push(cleanY);
                });
            });
            
            item._banglishSearch = toBanglish((item.wrong || "") + " " + (item.correct || ""));
        });

        const boardSelect = document.getElementById('sentenceBoardFilter');
        if (boardSelect) {
            [...boards].sort().forEach(b => boardSelect.add(new Option(boardNames[b] || b, b)));
        }

        const yearSelect = document.getElementById('sentenceYearFilter');
        if (yearSelect) {
            [...years].sort((a,b) => b.localeCompare(a)).forEach(y => yearSelect.add(new Option("২০" + y, y)));
        }
    };

    const renderSentences = (data) => {
        const container = document.getElementById('sentence-grid');
        if (!container) return;

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো বাক্য পাওয়া যায়নি</h3>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        let html = '';
        data.forEach(item => {
            let boardsText = '';
            if (Array.isArray(item.boards)) {
                boardsText = item.boards.join(', ');
            } else if (typeof item.boards === 'string') {
                boardsText = item.boards;
            }

            html += `
                <div class="sentence-card">
                    <div class="wrong-sentence bn-text">
                        <i data-lucide="x-circle"></i>
                        <span>${item.wrong}</span>
                    </div>
                    <i data-lucide="arrow-down" class="correction-arrow"></i>
                    <div class="correct-sentence bn-text">
                        <i data-lucide="check-circle-2"></i>
                        <span>${item.correct}</span>
                    </div>
                    ${boardsText ? `<span class="word-boards bn-text">${boardsText}</span>` : ''}
                </div>
            `;
        });
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        gsap.fromTo("#sentence-grid .sentence-card", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
    };

    // --- PASSAGE CORRECTION LOGIC ---
    const populatePassageFilters = (data) => {
        const boards = new Set();
        const years = new Set();

        data.forEach(item => {
            item._boards = [];
            item._years = [];
            
            let boardStrings = [];
            if (Array.isArray(item.boards)) {
                boardStrings = item.boards;
            } else if (typeof item.boards === 'string') {
                boardStrings = [item.boards];
            }

            boardStrings.forEach(boardStr => {
                const bMatches = boardStr.match(/(ঢা\.|রা\.|য\.|কু\.|চ\.|সি\.|ব\.|দি\.|ম\.|সকল)/g) || [];
                bMatches.forEach(b => { boards.add(b); item._boards.push(b); });
                
                const yMatches = boardStr.match(/'([০-৯]{2}|[0-9]{2})/g) || [];
                yMatches.forEach(y => {
                    const cleanY = standardizeYear(y.replace("'", ""));
                    years.add(cleanY);
                    item._years.push(cleanY);
                });
            });

            item._banglishSearch = toBanglish((item.wrong || "") + " " + (item.correct || ""));
        });

        const boardSelect = document.getElementById('passageBoardFilter');
        if (boardSelect) {
            [...boards].sort().forEach(b => boardSelect.add(new Option(boardNames[b] || b, b)));
        }

        const yearSelect = document.getElementById('passageYearFilter');
        if (yearSelect) {
            [...years].sort((a,b) => b.localeCompare(a)).forEach(y => yearSelect.add(new Option("২০" + y, y)));
        }
    };

    const renderPassages = (data) => {
        const container = document.getElementById('passage-grid');
        if (!container) return;

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state bn-text">
                    <i data-lucide="search-x"></i>
                    <h3>কোনো অনুচ্ছেদ পাওয়া যায়নি</h3>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        let html = '';
        data.forEach(item => {
            let boardsText = '';
            if (Array.isArray(item.boards)) {
                boardsText = item.boards.join(', ');
            } else if (typeof item.boards === 'string') {
                boardsText = item.boards;
            }

            html += `
                <div class="passage-card">
                    ${boardsText ? `<span class="passage-boards bn-text">${boardsText}</span>` : ''}
                    <div class="passage-comparison">
                        <div class="passage-wrong">
                            <div class="passage-title bn-text"><i data-lucide="x-circle"></i> অশুদ্ধ অনুচ্ছেদ</div>
                            <div class="passage-text bn-text">${item.wrong}</div>
                        </div>
                        <div class="passage-correct">
                            <div class="passage-title bn-text"><i data-lucide="check-circle-2"></i> শুদ্ধ অনুচ্ছেদ</div>
                            <div class="passage-text bn-text">${item.correct}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        gsap.fromTo("#passage-grid .passage-card", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    };

    // --- FETCH DATA ---
    fetch('../topic-data/correction/correction_sentences.json')
        .then(res => res.json())
        .then(data => {
            globalSentences = data;
            populateSentenceFilters(data);
            renderSentences(data);
        })
        .catch(err => console.error(err));

    fetch('../topic-data/correction/correction_passages.json')
        .then(res => res.json())
        .then(data => {
            globalPassages = data;
            populatePassageFilters(data);
            renderPassages(data);
        })
        .catch(err => console.error(err));


    // --- DEBOUNCED FILTERS ---
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Sentence Filters
    const sentenceSearch = document.getElementById('sentenceSearch');
    const sentenceClear = document.getElementById('sentenceClearSearch');
    const sentenceBoard = document.getElementById('sentenceBoardFilter');
    const sentenceYear = document.getElementById('sentenceYearFilter');

    const applySentenceFilters = () => {
        const term = sentenceSearch ? sentenceSearch.value.trim().toLowerCase() : '';
        const simplifiedTerm = term.replace(/sh/g, 's').replace(/ch/g, 'c');
        const fBoard = sentenceBoard ? sentenceBoard.value : 'all';
        const fYear = sentenceYear ? sentenceYear.value : 'all';

        if (sentenceClear) {
            sentenceClear.style.display = term.length > 0 ? 'block' : 'none';
        }

        const filtered = globalSentences.filter(item => {
            const textMatch = term === '' || item.wrong.includes(term) || item.correct.includes(term) || item._banglishSearch.includes(simplifiedTerm);
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            const yearMatch = fYear === 'all' || item._years.includes(fYear);
            return textMatch && boardMatch && yearMatch;
        });
        renderSentences(filtered);
    };

    if (sentenceSearch) sentenceSearch.addEventListener('input', debounce(applySentenceFilters, 300));
    if (sentenceBoard) sentenceBoard.addEventListener('change', applySentenceFilters);
    if (sentenceYear) sentenceYear.addEventListener('change', applySentenceFilters);
    if (sentenceClear) sentenceClear.addEventListener('click', () => { sentenceSearch.value = ''; applySentenceFilters(); sentenceSearch.focus(); });

    // Passage Filters
    const passageSearch = document.getElementById('passageSearch');
    const passageClear = document.getElementById('passageClearSearch');
    const passageBoard = document.getElementById('passageBoardFilter');
    const passageYear = document.getElementById('passageYearFilter');

    const applyPassageFilters = () => {
        const term = passageSearch ? passageSearch.value.trim().toLowerCase() : '';
        const simplifiedTerm = term.replace(/sh/g, 's').replace(/ch/g, 'c');
        const fBoard = passageBoard ? passageBoard.value : 'all';
        const fYear = passageYear ? passageYear.value : 'all';

        if (passageClear) {
            passageClear.style.display = term.length > 0 ? 'block' : 'none';
        }

        const filtered = globalPassages.filter(item => {
            const textMatch = term === '' || item.wrong.includes(term) || item.correct.includes(term) || item._banglishSearch.includes(simplifiedTerm);
            const boardMatch = fBoard === 'all' || item._boards.includes(fBoard);
            const yearMatch = fYear === 'all' || item._years.includes(fYear);
            return textMatch && boardMatch && yearMatch;
        });
        renderPassages(filtered);
    };

    if (passageSearch) passageSearch.addEventListener('input', debounce(applyPassageFilters, 300));
    if (passageBoard) passageBoard.addEventListener('change', applyPassageFilters);
    if (passageYear) passageYear.addEventListener('change', applyPassageFilters);
    if (passageClear) passageClear.addEventListener('click', () => { passageSearch.value = ''; applyPassageFilters(); passageSearch.focus(); });
});