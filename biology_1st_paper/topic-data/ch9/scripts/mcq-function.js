// topic-data/ch9/scripts/mcq-function.js

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
        const boards = new Set();
        const years = new Set();
        const topics = new Set();
        
        data.forEach(item => {
            if(item.type) topics.add(item.type);
            if(item.board) {
                const parts = item.board.split(',');
                parts.forEach(p => {
                    const bMatch = p.match(/([A-Za-z\s]+)\s+Board/i);
                    if(bMatch) boards.add(bMatch[1].trim());
                    else if (p.toLowerCase().includes('medical') || p.toLowerCase().includes('dental')) boards.add('Medical/Dental');
                    
                    const yMatch = p.match(/\b(20\d{2})\b/);
                    if(yMatch) years.add(yMatch[1]);
                });
            }
        });

        boardFilter.innerHTML = '<option value="all">সব সোর্স</option>';
        yearFilter.innerHTML = '<option value="all">সব সাল</option>';
        typeFilter.innerHTML = '<option value="all">সব টপিক</option>';

        boards.forEach(b => { const opt = document.createElement('option'); opt.value = b; opt.textContent = b + " বোর্ড"; opt.className = 'bn-text'; boardFilter.appendChild(opt); });
        Array.from(years).sort((a,b)=>b-a).forEach(y => { const opt = document.createElement('option'); opt.value = y; opt.textContent = y; opt.className = 'en-text'; yearFilter.appendChild(opt); });
        topics.forEach(t => { const opt = document.createElement('option'); opt.value = t; opt.textContent = t; opt.className = 'bn-text'; typeFilter.appendChild(opt); });
    };

    // TARGETING CH9 DIRECTORY
    fetch('../topic-data/ch9/mcq.json')
        .then(res => res.json())
        .then(data => { 
            allMcqData = data; 
            populateFilters(data);
            renderMCQs(); 
        })
        .catch(err => { container.innerHTML = '<div style="color:var(--ch-accent); text-align:center; padding: 20px;" class="bn-text flow-card">সিস্টেম এরর!</div>'; });

    function renderMCQs() {
        container.innerHTML = '';
        let filtered = allMcqData;
        const searchTerm = searchInput.value.trim().toLowerCase();
        const banSearchTerm = banglishToBangla(searchTerm);

        if (searchTerm) {
            filtered = filtered.filter(m => m.question.toLowerCase().includes(searchTerm) || m.question.includes(banSearchTerm));
        }
        if (boardFilter.value !== 'all') {
            filtered = filtered.filter(m => m.board && m.board.toLowerCase().includes(boardFilter.value.toLowerCase().replace('/dental','').replace(' বোর্ড','')));
        }
        if (yearFilter.value !== 'all') {
            filtered = filtered.filter(m => m.board && m.board.includes(yearFilter.value));
        }
        if (typeFilter.value !== 'all') {
            filtered = filtered.filter(m => m.type === typeFilter.value);
        }

        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding: 30px;" class="bn-text flow-card">কোনো ডাটা পাওয়া যায়নি।</div>';
            return;
        }

        const isStudyMode = modeSelect.value === 'study';

        filtered.forEach((mcq, index) => {
            const card = document.createElement('div');
            card.className = 'academic-card flow-card bn-text';
            
            const hlQuestion = highlightMatch(mcq.question, searchTerm, banSearchTerm);

            let badgeHtml = '';
            if(mcq.board) badgeHtml += `<span class="card-badge-item bn-text">${mcq.board}</span>`;
            if(mcq.type) badgeHtml += `<span class="card-badge-item bn-text" style="color:var(--ch-accent); border-left-color:var(--ch-accent); background:transparent;">${mcq.type}</span>`;

            let optionsHtml = '';
            mcq.rawOptions.forEach((opt, oIndex) => {
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
                <button class="check-ans-btn bn-text">যাচাই করুন</button>
                <div class="feedback-box bn-text" style="display: ${isStudyMode ? 'block' : 'none'};">
                    <strong>সঠিক ডাটা:</strong> ${mcq.rawOptions[mcq.correctIndex]}<br>
                    <span style="color:var(--text-muted); font-size:0.95rem; margin-top:8px; display:block;"><strong>মেকানিজম:</strong> ${mcq.explanation}</span>
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
                    if (selectedIndex === -1) { inputs.forEach(inp => inp.disabled = false); alert("একটি ইনপুট দিন।"); return; }

                    if (selectedIndex === mcq.correctIndex) {
                        labels[selectedIndex].classList.add('correct');
                        labels[selectedIndex].style.background = "var(--ch-bg-soft)";
                        labels[selectedIndex].style.borderLeftColor = "var(--ch-primary)";
                    } else {
                        labels[selectedIndex].classList.add('wrong');
                        labels[selectedIndex].style.borderLeftColor = "red";
                        
                        labels[mcq.correctIndex].classList.add('correct');
                        labels[mcq.correctIndex].style.background = "var(--ch-bg-soft)";
                        labels[mcq.correctIndex].style.borderLeftColor = "var(--ch-primary)";
                    }
                    feedback.style.display = 'block';
                    btn.style.display = 'none';
                });
            } else {
                card.querySelector('.check-ans-btn').style.display = 'none';
                const labels = card.querySelectorAll('label');
                labels[mcq.correctIndex].classList.add('correct');
                labels[mcq.correctIndex].style.background = "var(--ch-bg-soft)";
                labels[mcq.correctIndex].style.borderLeftColor = "var(--ch-primary)";
            }

            container.appendChild(card);
        });
    }

    let t; searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderMCQs, 300); });
    [boardFilter, yearFilter, typeFilter, modeSelect].forEach(el => el.addEventListener('change', renderMCQs));
};