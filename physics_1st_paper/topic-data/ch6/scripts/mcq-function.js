// topic-data/ch8/scripts/mcq-function.js

document.addEventListener("DOMContentLoaded", () => {
    const mcqContainer = document.getElementById('dynamic-mcq-container');
    const regenBtn = document.getElementById('regen-mcq-btn');
    
    const searchInput = document.getElementById('mcq-search');
    const boardFilterSelect = document.getElementById('mcq-board-filter');
    const yearFilterSelect = document.getElementById('mcq-year-filter');
    const typeFilterSelect = document.getElementById('mcq-type-filter');
    
    const modeSelect = document.getElementById('mcq-mode-select');
    const serialSelect = document.getElementById('mcq-serial-select');
    const answerSelect = document.getElementById('mcq-answer-select');

    let allMcqData = [];

    // --- Banglish to Bangla Mapper (Letter by Letter) ---
    const banglishToBangla = (text) => {
        const map = {
            'kh': 'খ', 'gh': 'ঘ', 'chh': 'ছ', 'ch': 'চ', 'jh': 'ঝ', 'th': 'থ', 'dh': 'ধ', 'ph': 'ফ', 'bh': 'ভ', 'sh': 'শ', 'ng': 'ঙ',
            'k': 'ক', 'g': 'গ', 'c': 'চ', 'j': 'জ', 't': 'ট', 'd': 'ড', 'n': 'ন', 'p': 'প', 'f': 'ফ', 'b': 'ব', 'm': 'ম',
            'z': 'য', 'y': 'য়', 'r': 'র', 'l': 'ল', 'v': 'ভ', 's': 'স', 'h': 'হ',
            'a': 'া', 'i': 'ি', 'u': 'ু', 'e': 'ে', 'o': 'ো', 'ou': 'ৌ', 'oi': 'ৈ'
        };
        let out = text.toLowerCase();
        // Sort keys by length descending to match multicharacter first
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
            // Regex to catch e.g., "Dhaka Board 2023"
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

    // --- Filter Populator ---
    const populateFilters = (data) => {
        const allBoards = new Set();
        const allYears = new Set();
        
        data.forEach(item => {
            const { boards, years } = extractBoardAndYear(item.board);
            boards.forEach(b => allBoards.add(b));
            years.forEach(y => allYears.add(y));
        });

        // Save current selections
        const currBoard = boardFilterSelect.value;
        const currYear = yearFilterSelect.value;

        boardFilterSelect.innerHTML = '<option value="all">সকল বোর্ড</option>';
        [...allBoards].sort().forEach(board => {
            const opt = document.createElement('option');
            opt.value = board; opt.textContent = board;
            boardFilterSelect.appendChild(opt);
        });

        yearFilterSelect.innerHTML = '<option value="all">সকল সাল</option>';
        [...allYears].sort((a,b)=>b-a).forEach(year => { // Sort descending for years
            const opt = document.createElement('option');
            opt.value = year; opt.textContent = year;
            yearFilterSelect.appendChild(opt);
        });

        if ([...allBoards].includes(currBoard)) boardFilterSelect.value = currBoard;
        if ([...allYears].includes(currYear)) yearFilterSelect.value = currYear;
    };

    const renderMCQs = async () => {
        if (!mcqContainer) return;

        const currentMode = modeSelect.value; // 'practice' or 'teach'
        const serialOrder = serialSelect.value; 
        const showAllAnswers = answerSelect ? answerSelect.value === 'show' : false;
        
        const selectedBoard = boardFilterSelect.value;
        const selectedYear = yearFilterSelect.value;
        const selectedType = typeFilterSelect.value; // 'all', 'static', 'dynamic'
        
        let searchTextRaw = searchInput.value.trim().toLowerCase();
        let searchTextNorm = banglishToBangla(searchTextRaw);

        mcqContainer.innerHTML = '<div class="bn-text" style="text-align:center; padding: 20px;">লোড হচ্ছে...</div>';
        
        try {
            if (allMcqData.length === 0) {
                // Removed nocache parameter for performance improvement
                const response = await fetch('../topic-data/ch8/mcq.json');
                if(response.ok) allMcqData = await response.json();
                else throw new Error("Local fetch failed");
                populateFilters(allMcqData);
            }

            // INTERSECTION FILTERING
            let displayData = allMcqData.filter(item => {
                const { boards, years } = extractBoardAndYear(item.board);
                
                // 1. Check Board (If selected, MUST be in boards)
                if (selectedBoard !== 'all' && !boards.includes(selectedBoard)) return false;
                
                // 2. Check Year (If selected, MUST be in years)
                if (selectedYear !== 'all' && !years.includes(selectedYear)) return false;
                
                // 3. Check Type (Dynamic / Static)
                if (selectedType !== 'all' && item.type !== selectedType) return false;

                // 4. Check Search
                if (searchTextRaw !== '') {
                    const contentStr = `${item.question} ${item.explanation} ${item.rawOptions ? item.rawOptions.join(' ') : ''}`.toLowerCase();
                    if (!contentStr.includes(searchTextRaw) && !contentStr.includes(searchTextNorm)) {
                        return false;
                    }
                }

                return true;
            });

            // Sort Serial
            if (serialOrder === 'random') {
                for (let i = displayData.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [displayData[i], displayData[j]] = [displayData[j], displayData[i]];
                }
            }

            mcqContainer.innerHTML = ''; 
            
            if (displayData.length === 0) {
                mcqContainer.innerHTML = '<div class="bn-text" style="text-align:center; padding: 20px;">এই শর্তে কোনো প্রশ্ন পাওয়া যায়নি।</div>';
                return;
            }

            // DocumentFragment prevents heavy DOM thrashing when adding numerous items
            const fragment = document.createDocumentFragment();

            displayData.forEach((item, index) => {
                let rawData;
                
                if (item.type === 'dynamic' && window.Ch8Generators && window.Ch8Generators[item.generator]) {
                    rawData = window.Ch8Generators[item.generator]();
                } else if (item.type === 'static') {
                    rawData = { question: item.question, rawOptions: item.rawOptions, explanation: item.explanation };
                }

                if (rawData) {
                    let processedOptions = rawData.rawOptions.map((opt, i) => ({ text: opt, isCorrect: i === 0 }));

                    for (let i = processedOptions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [processedOptions[i], processedOptions[j]] = [processedOptions[j], processedOptions[i]];
                    }

                    const mcqCard = document.createElement('div');
                    mcqCard.className = 'mcq-card';
                    
                    let tagsHTML = '';
                    if (item.board) {
                        item.board.split(',').forEach(b => {
                            if(b.trim()) tagsHTML += `<span class="board-tag">${b.trim()}</span>`;
                        });
                    }
                    if (item.type === 'dynamic') {
                        tagsHTML += `<span class="board-tag" style="background:var(--accent-color);color:#fff;"><i data-lucide="refresh-cw" style="width:12px;height:12px;display:inline;"></i> পরিবর্তনশীল (Dynamic)</span>`;
                    } else {
                        tagsHTML += `<span class="board-tag" style="background:var(--text-gray);color:#fff;">বইয়ের প্রশ্ন (Static)</span>`;
                    }

                    let optionsHTML = '';
                    processedOptions.forEach((opt) => {
                        // Pre-reveal logic if requested
                        let cls = 'bn-text mcq-option';
                        if (showAllAnswers) {
                            cls += ' selected';
                            if (opt.isCorrect) cls += ' reveal-correct';
                        }
                        optionsHTML += `<button class="${cls}" data-correct="${opt.isCorrect}">${opt.text}</button>`;
                    });

                    // In Teach mode, replace the default answer feedback with a continuous show
                    mcqCard.innerHTML = `
                        ${tagsHTML ? `<div style="margin-bottom: 10px;">${tagsHTML}</div>` : ''}
                        <div class="mcq-question bn-text">${index + 1}. ${rawData.question}</div>
                        <div class="mcq-options">${optionsHTML}</div>
                        
                        ${currentMode === 'teach' && !showAllAnswers ? `
                            <button class="action-btn outline bn-text show-ans-btn" style="margin-top:15px;">
                                <i data-lucide="eye"></i> উত্তর ও ব্যাখ্যা দেখুন
                            </button>
                        ` : ''}

                        <div class="mcq-feedback bn-text ${currentMode === 'teach' || showAllAnswers ? 'teach-mode' : ''} ${(currentMode === 'teach' && showAllAnswers) ? 'show' : ''}">
                            ${currentMode === 'teach' || showAllAnswers ? `<strong><i data-lucide="check-circle"></i> সঠিক উত্তর:</strong> ${processedOptions.find(o=>o.isCorrect).text}<br><br>` : ''}
                            <strong><i data-lucide="book-open"></i> ব্যাখ্যা:</strong><br> ${rawData.explanation}
                        </div>
                    `;

                    const optionBtns = mcqCard.querySelectorAll('.mcq-option');
                    const showAnsBtn = mcqCard.querySelector('.show-ans-btn');
                    const feedbackDiv = mcqCard.querySelector('.mcq-feedback');

                    // If NOT pre-showing, attach click handlers
                    if (!showAllAnswers) {
                        optionBtns.forEach(btn => {
                            btn.addEventListener('click', function() {
                                if (mcqCard.querySelector('.mcq-option.selected')) return;

                                const isCorrect = this.getAttribute('data-correct') === 'true';
                                this.classList.add('selected', isCorrect ? 'correct' : 'wrong');

                                optionBtns.forEach(b => {
                                    if (b.getAttribute('data-correct') === 'true') {
                                        b.classList.add('reveal-correct');
                                        if(!isCorrect && currentMode === 'practice') b.innerHTML += ' <span style="font-weight:bold;">(সঠিক)</span>';
                                    } else {
                                        b.classList.add('selected'); // lock
                                    }
                                });

                                if(showAnsBtn) showAnsBtn.style.display = 'none';

                                feedbackDiv.classList.add('show');
                                if (currentMode === 'practice') {
                                    feedbackDiv.classList.remove('teach-mode');
                                    feedbackDiv.classList.add(isCorrect ? 'correct-fb' : 'wrong-fb');
                                    feedbackDiv.innerHTML = `
                                        <strong>${isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল উত্তর!'}</strong> <br><br>
                                        <strong>ব্যাখ্যা:</strong> ${rawData.explanation}
                                    `;
                                }
                                if(window.queueMathJaxRendering) window.queueMathJaxRendering(feedbackDiv);
                            });
                        });

                        if (showAnsBtn) {
                            showAnsBtn.addEventListener('click', () => {
                                optionBtns.forEach(b => {
                                    if (b.getAttribute('data-correct') === 'true') b.classList.add('reveal-correct');
                                    b.classList.add('selected'); 
                                });
                                showAnsBtn.style.display = 'none';
                                feedbackDiv.classList.add('show');
                                if(window.queueMathJaxRendering) window.queueMathJaxRendering(feedbackDiv);
                            });
                        }
                    }

                    fragment.appendChild(mcqCard);
                }
            });

            mcqContainer.appendChild(fragment);

            if (typeof lucide !== 'undefined') lucide.createIcons();
            if(window.queueMathJaxRendering) window.queueMathJaxRendering(mcqContainer);

        } catch (error) {
            mcqContainer.innerHTML = '<div class="bn-text" style="color:red;">MCQ লোড করতে সমস্যা হয়েছে। JSON ফাইলটি চেক করুন।</div>';
            console.error(error);
        }
    };

    // Debounce for search
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(renderMCQs, 300);
    });

    [boardFilterSelect, yearFilterSelect, typeFilterSelect, modeSelect, serialSelect, answerSelect].forEach(el => {
        if(el) el.addEventListener('change', renderMCQs);
    });
    
    if(regenBtn) regenBtn.addEventListener('click', renderMCQs);

    setTimeout(() => { renderMCQs(); }, 100);
});