// topic-data/jouboner_gaan/scripts/cq-function.js

window.loadCQ = function() {
    const subTabBtns = document.querySelectorAll('.cq-sub-tab-btn');
    const container = document.getElementById('cq-container');
    const searchInput = document.getElementById('cq-search');
    const boardFilter = document.getElementById('cq-board-filter');
    const yearFilter = document.getElementById('cq-year-filter');
    const typeFilter = document.getElementById('cq-type-filter');

    let currentType = 'ka';
    let cachedData = { 'ka': [], 'kha': [], 'ga-gha': [] };

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

    const populateFilters = (dataObj) => {
        const boardSet = new Set();
        const yearSet = new Set();
        const topicSet = new Set();
        
        const allData = [...dataObj['ka'], ...dataObj['kha'], ...dataObj['ga-gha']];
        allData.forEach(item => {
            if(item.topic) topicSet.add(item.topic);
            
            let boardStrings = [];
            if (item.board) boardStrings.push(item.board);
            if (item.questions?.ga?.board) boardStrings.push(item.questions.ga.board);
            if (item.questions?.gha?.board) boardStrings.push(item.questions.gha.board);

            boardStrings.forEach(bStr => {
                const parts = bStr.split(',');
                parts.forEach(part => {
                    // Fix: Regex that properly captures Bengali and English digits without failing on word boundaries
                    const yearMatch = part.match(/(20[0-9]{2}|২০[০-৯]{2})/);
                    if(yearMatch) yearSet.add(yearMatch[1]);

                    // Fix: Strip the captured year to isolate the board name
                    const boardName = part.replace(/(20[0-9]{2}|২০[০-৯]{2})/g, '').trim();
                    if(boardName) boardSet.add(boardName);
                });
            });
        });

        // Clear existing
        if (boardFilter) boardFilter.innerHTML = '<option value="all">সব বোর্ড</option>';
        if (yearFilter) yearFilter.innerHTML = '<option value="all">সব সাল</option>';
        if (typeFilter) typeFilter.innerHTML = '<option value="all">সব টপিক</option>';

        Array.from(boardSet).sort().forEach(b => { 
            const opt = document.createElement('option'); 
            opt.value = b; opt.textContent = b; opt.className='bn-text'; 
            if (boardFilter) boardFilter.appendChild(opt); 
        });

        Array.from(yearSet).sort((a,b) => b.localeCompare(a)).forEach(y => { 
            const opt = document.createElement('option'); 
            opt.value = y; opt.textContent = y; opt.className='en-text'; 
            if (yearFilter) yearFilter.appendChild(opt); 
        });
        
        topicSet.forEach(t => { 
            const opt = document.createElement('option'); 
            opt.value = t; opt.textContent = t; opt.className='bn-text'; 
            if (typeFilter) typeFilter.appendChild(opt); 
        });
    };

    Promise.all([
        fetch('../topic-data/jouboner_gaan/cq/ka.json').then(r => r.json()),
        fetch('../topic-data/jouboner_gaan/cq/kha.json').then(r => r.json()),
        fetch('../topic-data/jouboner_gaan/cq/ga-gha.json').then(r => r.json())
    ]).then(([ka, kha, gagha]) => {
        cachedData['ka'] = ka || []; 
        cachedData['kha'] = kha || []; 
        cachedData['ga-gha'] = gagha || [];
        populateFilters(cachedData);
        renderCQs();
    }).catch(err => { if(container) container.innerHTML = '<div style="color:var(--ch-primary); text-align:center; padding: 40px; font-weight: bold;" class="bn-text">ডেটা লোড করতে ব্যর্থ হয়েছে।</div>'; });

    const createAccordion = (q, a, typeLabel) => {
        const item = document.createElement('div');
        item.className = 'accordion-item bn-text';

        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.innerHTML = `<span><span style="color:var(--ch-primary); margin-right:8px;" class="bn-text">${typeLabel}</span> ${q}</span> <span class="icon-wrap" style="transition:0.3s;"><i data-lucide="chevron-down" style="width:18px; color:var(--text-muted);"></i></span>`;

        const body = document.createElement('div');
        body.className = 'accordion-body';
        body.innerHTML = `<div style="padding: 15px 0; color: var(--text-muted); line-height: 1.8;" class="bn-text">${a}</div>`;

        header.addEventListener('click', () => {
            const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
            body.style.maxHeight = isOpen ? '0px' : body.scrollHeight + 'px';
            header.querySelector('.icon-wrap').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        });

        item.appendChild(header); item.appendChild(body);
        return item;
    };

    function renderCQs() {
        if(!container) return;
        container.innerHTML = '';
        let data = cachedData[currentType];
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const banSearchTerm = banglishToBangla(searchTerm);
        
        const bVal = boardFilter ? boardFilter.value : 'all';
        const yVal = yearFilter ? yearFilter.value : 'all';
        const tVal = typeFilter ? typeFilter.value : 'all';

        if (searchTerm) {
            data = data.filter(m => {
                const targetText = currentType === 'ga-gha' ? m.stem : m.question;
                return targetText.toLowerCase().includes(searchTerm) || targetText.includes(banSearchTerm);
            });
        }
        
        // Strict Intersection Filter (AND Logic)
        if (bVal !== 'all' || yVal !== 'all') {
            data = data.filter(m => {
                let boardStrings = [];
                if (m.board) boardStrings.push(m.board);
                if (m.questions?.ga?.board) boardStrings.push(m.questions.ga.board);
                if (m.questions?.gha?.board) boardStrings.push(m.questions.gha.board);

                if (boardStrings.length === 0) return false;

                // Does ANY string in the array contain a comma-separated part that satisfies BOTH conditions?
                return boardStrings.some(bStr => {
                    const parts = bStr.split(',');
                    return parts.some(part => {
                        const matchesBoard = bVal === 'all' || part.includes(bVal);
                        const matchesYear = yVal === 'all' || part.includes(yVal);
                        return matchesBoard && matchesYear;
                    });
                });
            });
        }
        
        if (tVal !== 'all') {
            data = data.filter(m => m.topic === tVal);
        }

        if (data.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding: 40px; border: 1px dashed var(--border-color);" class="bn-text">কোনো প্রশ্ন পাওয়া যায়নি।</div>';
            return;
        }

        data.forEach((item, index) => {
            const block = document.createElement('div');
            block.className = 'academic-card bn-text';
            block.id = item.id;

            let badgeHtml = '';
            let rootBoard = item.board;
            if(!rootBoard && currentType === 'ga-gha' && item.questions) {
                rootBoard = item.questions.ga?.board || item.questions.gha?.board;
            }

            if(rootBoard) {
                const parts = rootBoard.split(',');
                parts.forEach(part => {
                    badgeHtml += `<span class="card-badge-item bn-text">${part.trim()}</span>`;
                });
            }
            if(item.topic) {
                badgeHtml += `<span class="card-badge-item bn-text" style="background:var(--bg-main); color:var(--text-dark); border: 1px solid var(--border-color);">${item.topic}</span>`;
            }
            
            if (badgeHtml) {
                block.innerHTML = `<div class="card-badges">${badgeHtml}</div>`;
            }

            if (currentType === 'ga-gha') {
                const hlStem = highlightMatch(item.stem, searchTerm, banSearchTerm);
                const stemDiv = document.createElement('div');
                stemDiv.style.padding = '20px'; stemDiv.style.background = 'var(--bg-main)'; stemDiv.style.border = '1px solid var(--border-color)'; stemDiv.style.borderRadius = '8px'; stemDiv.style.marginBottom = '20px'; stemDiv.style.color = 'var(--text-dark)'; stemDiv.className = 'bn-text';
                stemDiv.innerHTML = `<strong>উদ্দীপক ${index+1}:</strong><br><br>${hlStem}`;
                block.appendChild(stemDiv);

                if (item.questions && item.questions.ga) {
                    block.appendChild(createAccordion(item.questions.ga.question, item.questions.ga.answer || 'উত্তর যুক্ত করা হয়নি।', '(গ)'));
                }
                if (item.questions && item.questions.gha) {
                    block.appendChild(createAccordion(item.questions.gha.question, item.questions.gha.answer || 'উত্তর যুক্ত করা হয়নি।', '(ঘ)'));
                }
            } else {
                const hlQ = highlightMatch(item.question, searchTerm, banSearchTerm);
                block.appendChild(createAccordion(hlQ, item.answer || 'উত্তর যুক্ত করা হয়নি।', `Q${index+1}:`));
            }
            if (container) container.appendChild(block);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.getAttribute('data-cq');
            renderCQs();
        });
    });

    if (searchInput) {
        let t; searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderCQs, 300); });
    }
    
    [boardFilter, yearFilter, typeFilter].forEach(el => {
        if (el) el.addEventListener('change', renderCQs);
    });
};