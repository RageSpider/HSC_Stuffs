// topic-data/ch8/scripts/cq-function.js

document.addEventListener("DOMContentLoaded", () => {
    const subTabBtns = document.querySelectorAll('.cq-sub-tab-btn');
    const cqContainer = document.getElementById('cq-container');
    
    const searchInput = document.getElementById('cq-search');
    const boardFilterSelect = document.getElementById('cq-board-filter');
    const yearFilterSelect = document.getElementById('cq-year-filter');
    const typeFilterSelect = document.getElementById('cq-type-filter');
    
    let currentCqType = 'ka'; // Tracks Ka, Kha, Ga-Gha
    let cachedCqData = { 'ka': [], 'kha': [], 'ga-gha': [] };

    // --- Banglish to Bangla Mapper (Letter by Letter) ---
    const banglishToBangla = (text) => {
        const map = {
            'kh': 'খ', 'gh': 'ঘ', 'chh': 'ছ', 'ch': 'চ', 'jh': 'ঝ', 'th': 'থ', 'dh': 'ধ', 'ph': 'ফ', 'bh': 'ভ', 'sh': 'শ', 'ng': 'ঙ',
            'k': 'ক', 'g': 'গ', 'c': 'চ', 'j': 'জ', 't': 'ট', 'd': 'ড', 'n': 'ন', 'p': 'প', 'f': 'ফ', 'b': 'ব', 'm': 'ম',
            'z': 'য', 'y': 'য়', 'r': 'র', 'l': 'ল', 'v': 'ভ', 's': 'স', 'h': 'হ',
            'a': 'া', 'i': 'ি', 'u': 'ু', 'e': 'ে', 'o': 'ো', 'ou': 'ৌ', 'oi': 'ৈ'
        };
        let out = text.toLowerCase();
        // Sort keys by length descending so multicharacter matches (e.g. 'kh') evaluate before single (e.g. 'k')
        const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
        for (let key of sortedKeys) {
            out = out.split(key).join(map[key]);
        }
        return out;
    };

    // --- Extractor for Board and Year ---
    const extractBoardAndYear = (boardStr) => {
        if (!boardStr) return { boards: [], years: [] };
        const parts = boardStr.split(',');
        const boards = new Set();
        const years = new Set();
        parts.forEach(p => {
            const trimmed = p.trim();
            const match = trimmed.match(/([A-Za-z\s]+Board)\s+(\d{4})/i);
            if (match) {
                boards.add(match[1].trim());
                years.add(match[2].trim());
            } else if (trimmed) {
                const yMatch = trimmed.match(/(\d{4})/);
                if (yMatch) years.add(yMatch[1]);
                const bMatch = trimmed.replace(/\d{4}/, '').trim();
                if (bMatch) boards.add(bMatch);
            }
        });
        return { boards: [...boards], years: [...years] };
    };

    const populateFilters = (data) => {
        const allBoards = new Set();
        const allYears = new Set();
        const allTopics = new Set();
        
        data.forEach(item => {
            const { boards, years } = extractBoardAndYear(item.board);
            boards.forEach(b => allBoards.add(b));
            years.forEach(y => allYears.add(y));
            if (item.type) allTopics.add(item.type);
        });

        // Retain selection
        const currBoard = boardFilterSelect.value;
        const currYear = yearFilterSelect.value;
        const currTopic = typeFilterSelect.value;

        boardFilterSelect.innerHTML = '<option value="all">সকল বোর্ড</option>';
        [...allBoards].sort().forEach(board => {
            const opt = document.createElement('option');
            opt.value = board; opt.textContent = board;
            boardFilterSelect.appendChild(opt);
        });
        
        yearFilterSelect.innerHTML = '<option value="all">সকল সাল</option>';
        [...allYears].sort((a,b)=>b-a).forEach(year => {
            const opt = document.createElement('option');
            opt.value = year; opt.textContent = year;
            yearFilterSelect.appendChild(opt);
        });

        typeFilterSelect.innerHTML = '<option value="all">সকল টপিক</option>';
        [...allTopics].sort().forEach(topic => {
            const opt = document.createElement('option');
            opt.value = topic; opt.textContent = topic.toUpperCase();
            typeFilterSelect.appendChild(opt);
        });
        
        if([...allBoards].includes(currBoard)) boardFilterSelect.value = currBoard;
        if([...allYears].includes(currYear)) yearFilterSelect.value = currYear;
        if([...allTopics].includes(currTopic)) typeFilterSelect.value = currTopic;
    };

    const renderCQs = async (type) => {
        currentCqType = type;
        cqContainer.innerHTML = '<div class="bn-text" style="text-align:center; padding: 20px;">লোড হচ্ছে...</div>';
        
        try {
            if (cachedCqData[type].length === 0) {
                // Removed nocache query to boost loading speed after first pull
                const response = await fetch(`../topic-data/ch8/cq/${type}.json`);
                if(response.ok) {
                    cachedCqData[type] = await response.json();
                } else {
                    throw new Error(`Fetch failed for ${type}.json`);
                }
            }

            const data = cachedCqData[type];
            populateFilters(data);

            const selectedBoard = boardFilterSelect.value;
            const selectedYear = yearFilterSelect.value;
            const selectedTopic = typeFilterSelect.value;
            let searchTextRaw = searchInput.value.trim().toLowerCase();
            let searchTextNorm = banglishToBangla(searchTextRaw);

            // INTERSECTION FILTERING
            let displayData = data.filter(item => {
                const { boards, years } = extractBoardAndYear(item.board);
                
                // 1. Board
                if (selectedBoard !== 'all' && !boards.includes(selectedBoard)) return false;
                
                // 2. Year
                if (selectedYear !== 'all' && !years.includes(selectedYear)) return false;
                
                // 3. Topic Type
                if (selectedTopic !== 'all' && item.type !== selectedTopic) return false;

                // 4. Search
                if (searchTextRaw !== '') {
                    let contentStr = '';
                    if (type === 'ka' || type === 'kha') {
                        contentStr = `${item.question} ${item.answer}`.toLowerCase();
                    } else if (type === 'ga-gha') {
                        contentStr = item.stem.toLowerCase();
                        item.questions.forEach(q => {
                            contentStr += ` ${q.question} ${q.answer}`.toLowerCase();
                        });
                    }
                    if (!contentStr.includes(searchTextRaw) && !contentStr.includes(searchTextNorm)) {
                        return false;
                    }
                }

                return true;
            });

            cqContainer.innerHTML = ''; 
            
            if (displayData.length === 0) {
                cqContainer.innerHTML = '<div class="bn-text" style="text-align:center; padding: 20px;">এই শর্তে কোনো প্রশ্ন পাওয়া যায়নি।</div>';
                return;
            }

            // Using DocumentFragment to optimize performance and stop lag
            const fragment = document.createDocumentFragment();

            displayData.forEach((item) => {
                const card = document.createElement('div');
                card.className = 'cq-card';
                
                let tagsHTML = '';
                if (item.board) {
                    item.board.split(',').forEach(b => {
                        if(b.trim()) tagsHTML += `<span class="board-tag">${b.trim()}</span>`;
                    });
                }
                if (item.type) {
                    tagsHTML += `<span class="board-tag" style="background:var(--accent-color);color:#fff;">টপিক: ${item.type}</span>`;
                }

                if (type === 'ka' || type === 'kha') {
                    card.innerHTML = `
                        ${tagsHTML ? `<div style="margin-bottom: 10px;">${tagsHTML}</div>` : ''}
                        <div class="cq-question bn-text"><span class="cq-q-badge">${type === 'ka' ? 'ক' : 'খ'}</span> ${item.question}</div>
                        <button class="action-btn outline bn-text cq-show-btn">
                            <i data-lucide="eye"></i> উত্তর দেখুন
                        </button>
                        <div class="cq-answer bn-text">${item.answer}</div>
                    `;
                } else if (type === 'ga-gha') {
                    let subQHTML = '';
                    item.questions.forEach(q => {
                        subQHTML += `
                            <div style="margin-top: 20px; border-top: 1px dashed var(--border-color); padding-top: 15px;">
                                <div class="cq-question bn-text"><span class="cq-q-badge">${q.type === 'ga' ? 'গ' : 'ঘ'}</span> ${q.question}</div>
                                <button class="action-btn outline bn-text cq-show-btn">
                                    <i data-lucide="eye"></i> সমাধান দেখুন
                                </button>
                                <div class="cq-answer bn-text">${q.answer.replace(/\n/g, '<br>')}</div>
                            </div>
                        `;
                    });

                    card.innerHTML = `
                        ${tagsHTML ? `<div style="margin-bottom: 10px;">${tagsHTML}</div>` : ''}
                        <div class="cq-stem bn-text"><strong>উদ্দীপক:</strong><br>${item.stem}</div>
                        ${subQHTML}
                    `;
                }

                // Add listeners
                const showBtns = card.querySelectorAll('.cq-show-btn');
                showBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const answerDiv = this.nextElementSibling;
                        if(answerDiv.classList.contains('show')) {
                            answerDiv.classList.remove('show');
                            this.innerHTML = `<i data-lucide="eye"></i> ${type === 'ga-gha' ? 'সমাধান' : 'উত্তর'} দেখুন`;
                        } else {
                            answerDiv.classList.add('show');
                            this.innerHTML = `<i data-lucide="eye-off"></i> লুকিয়ে রাখুন`;
                            if(window.queueMathJaxRendering) window.queueMathJaxRendering(answerDiv);
                        }
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    });
                });

                fragment.appendChild(card);
            });

            cqContainer.appendChild(fragment);

            if (typeof lucide !== 'undefined') lucide.createIcons();
            if(window.queueMathJaxRendering) window.queueMathJaxRendering(cqContainer);

        } catch (error) {
            cqContainer.innerHTML = '<div class="bn-text" style="color:red;">CQ ডাটা লোড করতে সমস্যা হয়েছে।</div>';
            console.error(error);
        }
    };

    // Sub-tab Listeners
    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCQs(btn.getAttribute('data-cq'));
        });
    });

    // Debounce for search
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => renderCQs(currentCqType), 300);
    });

    [boardFilterSelect, yearFilterSelect, typeFilterSelect].forEach(el => {
        if(el) el.addEventListener('change', () => renderCQs(currentCqType));
    });

    // Initial Load
    renderCQs('ka');
});