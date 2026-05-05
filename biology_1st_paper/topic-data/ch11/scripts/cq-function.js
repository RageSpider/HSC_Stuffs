// topic-data/ch12/scripts/cq-function.js

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
        const boards = new Set();
        const years = new Set();
        const topics = new Set();
        
        const allData = [...dataObj['ka'], ...dataObj['kha'], ...dataObj['ga-gha']];
        allData.forEach(item => {
            if(item.type) topics.add(item.type);
            if(item.board) {
                const parts = item.board.split(',');
                parts.forEach(p => {
                    const bMatch = p.match(/([A-Za-z\s]+)\s+Board/i);
                    if(bMatch) boards.add(bMatch[1].trim());
                    const yMatch = p.match(/\b(20\d{2})\b/);
                    if(yMatch) years.add(yMatch[1]);
                });
            }
        });

        boardFilter.innerHTML = '<option value="all">সব সোর্স</option>';
        yearFilter.innerHTML = '<option value="all">সব সাল</option>';
        typeFilter.innerHTML = '<option value="all">সব যুগ/টপিক</option>';

        boards.forEach(b => { const opt = document.createElement('option'); opt.value = b; opt.textContent = b + " বোর্ড"; opt.className='bn-text'; boardFilter.appendChild(opt); });
        Array.from(years).sort((a,b)=>b-a).forEach(y => { const opt = document.createElement('option'); opt.value = y; opt.textContent = y; opt.className='en-text'; yearFilter.appendChild(opt); });
        topics.forEach(t => { const opt = document.createElement('option'); opt.value = t; opt.textContent = t; opt.className='bn-text'; typeFilter.appendChild(opt); });
    };

    // TARGETING CH12 DIRECTORY
    Promise.all([
        fetch('../topic-data/ch12/cq/ka.json').then(r => r.json()),
        fetch('../topic-data/ch12/cq/kha.json').then(r => r.json()),
        fetch('../topic-data/ch12/cq/ga-gha.json').then(r => r.json())
    ]).then(([ka, kha, gagha]) => {
        cachedData['ka'] = ka; cachedData['kha'] = kha; cachedData['ga-gha'] = gagha;
        populateFilters(cachedData);
        renderCQs();
    }).catch(err => { container.innerHTML = '<div style="color:var(--ch-accent); text-align:center; padding: 20px;" class="bn-text strata-card">ডেটাবেস এরর!</div>'; });

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
        container.innerHTML = '';
        let data = cachedData[currentType];
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const banSearchTerm = banglishToBangla(searchTerm);

        if (searchTerm) {
            data = data.filter(m => {
                const targetText = currentType === 'ga-gha' ? m.stem : m.question;
                return targetText.toLowerCase().includes(searchTerm) || targetText.includes(banSearchTerm);
            });
        }
        if (boardFilter.value !== 'all') data = data.filter(m => m.board && m.board.toLowerCase().includes(boardFilter.value.toLowerCase().replace(' বোর্ড','')));
        if (yearFilter.value !== 'all') data = data.filter(m => m.board && m.board.includes(yearFilter.value));
        if (typeFilter.value !== 'all') data = data.filter(m => m.type === typeFilter.value);

        if (data.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding: 30px;" class="bn-text strata-card">কোনো অ্যানালাইসিস পাওয়া যায়নি।</div>';
            return;
        }

        data.forEach((item, index) => {
            const block = document.createElement('div');
            block.className = 'academic-card strata-card bn-text';
            block.id = item.id;

            let badgeHtml = '';
            if(item.board) badgeHtml += `<span class="card-badge-item strata-edge bn-text">${item.board}</span>`;
            if(item.type) badgeHtml += `<span class="card-badge-item strata-edge bn-text" style="color:var(--ch-accent); background:transparent;">${item.type}</span>`;
            
            block.innerHTML = `<div class="card-badges">${badgeHtml}</div>`;

            if (currentType === 'ga-gha') {
                const hlStem = highlightMatch(item.stem, searchTerm, banSearchTerm);
                const stemDiv = document.createElement('div');
                stemDiv.style.padding = '20px'; stemDiv.style.background = 'var(--bg-main)'; 
                stemDiv.style.border = '1px solid var(--border-color)';
                stemDiv.style.borderRadius = '12px 2px 12px 2px'; 
                stemDiv.style.marginBottom = '20px'; stemDiv.style.color = 'var(--text-dark)'; stemDiv.className = 'bn-text';
                stemDiv.innerHTML = `<strong>অবজারভেশন ${index+1}:</strong><br><br>${hlStem}`;
                block.appendChild(stemDiv);

                item.questions.forEach(q => {
                    const label = q.type === 'ga' ? '(গ)' : '(ঘ)';
                    block.appendChild(createAccordion(q.question, q.answer, label));
                });
            } else {
                const hlQ = highlightMatch(item.question, searchTerm, banSearchTerm);
                block.appendChild(createAccordion(hlQ, item.answer, `Q${index+1}:`));
            }
            container.appendChild(block);
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

    let t; searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderCQs, 300); });
    [boardFilter, yearFilter, typeFilter].forEach(el => el.addEventListener('change', renderCQs));
};