// topic-data/jouboner_gaan/scripts/mcq-function.js

window.loadMCQ = function() {
    const container = document.getElementById('dynamic-mcq-container');
    const searchInput = document.getElementById('mcq-search');
    const boardFilter = document.getElementById('mcq-board-filter');
    const yearFilter = document.getElementById('mcq-year-filter');
    const typeFilter = document.getElementById('mcq-type-filter');
    const modeSelect = document.getElementById('mcq-mode-select');

    let allMcqData = [];

    const banglishToBangla = (text) => {
        const map = { 'kh':'খ','gh':'ঘ','chh':'ছ','ch':'চ','jh':'ঝ','th':'থ','dh':'ধ','ph':'ফ','bh':'ভ','sh':'শ','ng':'ঙ', 'k':'ক','g':'গ','c':'চ','j':'জ','t':'ট','d':'ড','n':'ন','p':'প','f':'ফ','b':'ব','m':'ম', 'z':'য','y':'য়','r':'র','l':'ল','s':'স','h':'হ','a':'া','i':'ি','u':'ু','e':'ে','o':'ো' };
        let out = text.toLowerCase();
        for (let [eng, ban] of Object.entries(map)) { out = out.split(eng).join(ban); }
        return out;
    };

    const highlightMatch = (text, term1, term2) => {
        if (!term1 && !term2) return text;
        let terms = [];
        if (term1) terms.push(term1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (term2 && term2 !== term1) terms.push(term2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (terms.length === 0) return text;
        const regex = new RegExp(`(?![^<]*>)(${terms.join('|')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight bn-text">$1</span>');
    };

    const populateFilters = (data) => {
        const boardSet = new Set();
        const yearSet = new Set();
        const topicSet = new Set();
        
        data.forEach(item => {
            if(item.topic) topicSet.add(item.topic); 
            
            if(item.board) {
                const parts = item.board.split(',');
                parts.forEach(part => {
                    // Fix: Regex that properly captures Bengali and English digits without failing on word boundaries
                    const yearMatch = part.match(/(20[0-9]{2}|২০[০-৯]{2})/);
                    if(yearMatch) yearSet.add(yearMatch[1]);

                    // Fix: Strip the captured year to isolate the board name
                    const boardName = part.replace(/(20[0-9]{2}|২০[০-৯]{2})/g, '').trim();
                    if(boardName) boardSet.add(boardName);
                });
            }
        });

        // Clear existing
        if (boardFilter) boardFilter.innerHTML = '<option value="all">সব বোর্ড</option>';
        if (yearFilter) yearFilter.innerHTML = '<option value="all">সব সাল</option>';
        if (typeFilter) typeFilter.innerHTML = '<option value="all">সব টপিক</option>';

        Array.from(boardSet).sort().forEach(b => { 
            const opt = document.createElement('option'); 
            opt.value = b; opt.textContent = b; opt.className = 'bn-text'; 
            if (boardFilter) boardFilter.appendChild(opt); 
        });

        Array.from(yearSet).sort((a,b) => b.localeCompare(a)).forEach(y => { 
            const opt = document.createElement('option'); 
            opt.value = y; opt.textContent = y; opt.className = 'en-text'; 
            if (yearFilter) yearFilter.appendChild(opt); 
        });
        
        topicSet.forEach(t => { 
            const opt = document.createElement('option'); 
            opt.value = t; opt.textContent = t; opt.className = 'bn-text'; 
            if (typeFilter) typeFilter.appendChild(opt); 
        });
    };

    fetch('../topic-data/jouboner_gaan/mcq.json')
        .then(res => res.json())
        .then(data => { 
            allMcqData = data; 
            populateFilters(data);
            renderMCQs(); 
        })
        .catch(err => { if(container) container.innerHTML = '<div style="color:var(--ch-primary); text-align:center; padding: 40px; font-weight: bold;" class="bn-text">ডেটা লোড করতে সমস্যা হয়েছে!</div>'; });

    function renderMCQs() {
        if (!container) return;
        container.innerHTML = '';
        let filtered = allMcqData;
        
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const banSearchTerm = banglishToBangla(searchTerm);

        const bVal = boardFilter ? boardFilter.value : 'all';
        const yVal = yearFilter ? yearFilter.value : 'all';
        const tVal = typeFilter ? typeFilter.value : 'all';

        if (searchTerm) {
            filtered = filtered.filter(m => m.question.toLowerCase().includes(searchTerm) || m.question.includes(banSearchTerm));
        }
        
        // Strict Intersection Filter (AND Logic)
        if (bVal !== 'all' || yVal !== 'all') {
            filtered = filtered.filter(m => {
                if (!m.board) return false;
                const parts = m.board.split(',');
                // Does ANY single comma-separated tag satisfy BOTH Board and Year?
                return parts.some(part => {
                    const matchesBoard = bVal === 'all' || part.includes(bVal);
                    const matchesYear = yVal === 'all' || part.includes(yVal);
                    return matchesBoard && matchesYear;
                });
            });
        }
        
        if (tVal !== 'all') {
            filtered = filtered.filter(m => m.topic === tVal);
        }

        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding: 40px; border: 1px dashed var(--border-color);" class="bn-text">কোনো প্রশ্ন পাওয়া যায়নি।</div>';
            return;
        }

        const isStudyMode = modeSelect ? modeSelect.value === 'study' : true;

        filtered.forEach((mcq, index) => {
            const card = document.createElement('div');
            card.className = 'academic-card bn-text';
            
            const hlQuestion = highlightMatch(mcq.question, searchTerm, banSearchTerm);

            let badgeHtml = '';
            if(mcq.board) {
                const parts = mcq.board.split(',');
                parts.forEach(part => {
                    // This puts EXACTLY "ঢাকা বোর্ড ২০২৩" into the tag visually
                    badgeHtml += `<span class="card-badge-item bn-text">${part.trim()}</span>`;
                });
            }
            if(mcq.topic) {
                badgeHtml += `<span class="card-badge-item bn-text" style="background:var(--bg-main); color:var(--text-dark); border: 1px solid var(--border-color);">${mcq.topic}</span>`;
            }

            let optionsHtml = '';
            mcq.options.forEach((opt, oIndex) => {
                optionsHtml += `
                    <label class="mcq-option-label bn-text">
                        <input type="radio" name="q${mcq.id}" value="${oIndex}" style="margin-right: 12px; accent-color: var(--ch-primary);">
                        ${opt}
                    </label>
                `;
            });

            card.innerHTML = `
                <div class="card-badges">${badgeHtml}</div>
                <div class="mcq-question bn-text">
                    <span style="color: var(--ch-primary); margin-right: 5px;" class="en-text">Q${index + 1}:</span> ${hlQuestion}
                </div>
                <div>${optionsHtml}</div>
                <button class="check-ans-btn bn-text">উত্তর যাচাই করো</button>
                <div class="feedback-box bn-text" style="display: ${isStudyMode ? 'block' : 'none'};">
                    <strong>সঠিক উত্তর:</strong> ${mcq.options[mcq.correctIndex]}<br>
                    <span style="color:var(--text-muted); font-size:0.95rem; margin-top:8px; display:block;"><strong>ব্যাখ্যা:</strong> ${mcq.explanation || 'কোনো ব্যাখ্যা দেওয়া নেই।'}</span>
                </div>
            `;

            if (!isStudyMode) {
                const btn = card.querySelector('.check-ans-btn');
                const feedback = card.querySelector('.feedback-box');
                const inputs = card.querySelectorAll('input[type="radio"]');
                const labels = card.querySelectorAll('label');

                btn.addEventListener('click', () => {
                    let selectedIndex = -1;
                    inputs.forEach((inp, i) => { if(inp.checked) selectedIndex = i; inp.disabled = true; });
                    if (selectedIndex === -1) { inputs.forEach(inp => inp.disabled = false); alert("একটি অপশন নির্বাচন করো।"); return; }

                    if (selectedIndex === mcq.correctIndex) {
                        labels[selectedIndex].classList.add('correct');
                    } else {
                        labels[selectedIndex].classList.add('wrong');
                        labels[mcq.correctIndex].classList.add('correct');
                    }
                    feedback.style.display = 'block';
                    btn.style.display = 'none';
                });
            } else {
                const checkBtn = card.querySelector('.check-ans-btn');
                if (checkBtn) checkBtn.style.display = 'none';
                const labels = card.querySelectorAll('label');
                if (labels[mcq.correctIndex]) labels[mcq.correctIndex].classList.add('correct');
            }

            if (container) container.appendChild(card);
        });
    }

    if (searchInput) {
        let t; searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderMCQs, 300); });
    }
    
    [boardFilter, yearFilter, typeFilter, modeSelect].forEach(el => {
        if (el) el.addEventListener('change', renderMCQs);
    });
};