document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll('.tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const mcqContainer = document.getElementById('dynamic-mcq-container');
    const regenBtn = document.getElementById('regen-mcq-btn');
    
    const modeSelect = document.getElementById('mcq-mode-select');
    const serialSelect = document.getElementById('mcq-serial-select');
    const sortSelect = document.getElementById('mcq-sort-select');
    const answerSelect = document.getElementById('mcq-answer-select');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            if (!target) return; 
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetContent = document.getElementById(target);
            if(targetContent) targetContent.classList.add('active');
        });
    });

    let mathJaxPromise = Promise.resolve();
    const queueMathJaxRendering = (element) => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            mathJaxPromise = mathJaxPromise.then(() => {
                return MathJax.typesetPromise([element]);
            }).catch((err) => {
                console.warn("MathJax Typeset Error:", err);
            });
        }
    };

    const extractNumber = (text) => {
        const match = text.match(/-?\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : 0;
    };

    const renderMCQs = async () => {
        if (!mcqContainer) return;

        const currentMode = modeSelect.value; 
        const serialOrder = serialSelect.value; 
        const optionSort = sortSelect.value; 
        const showAnswersDefault = answerSelect.value === 'show';

        mcqContainer.innerHTML = '<div class="bn-text" style="text-align:center; padding: 20px;">লোড হচ্ছে...</div>';
        
        try {
            let mcqData = [];
            const response = await fetch('../topic-data/ch8/mcq.json?nocache=' + new Date().getTime());
            if(response.ok) mcqData = await response.json();
            else throw new Error("Local fetch failed");

            if (serialOrder === 'random') {
                for (let i = mcqData.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [mcqData[i], mcqData[j]] = [mcqData[j], mcqData[i]];
                }
            }

            mcqContainer.innerHTML = ''; 

            mcqData.forEach((item, index) => {
                let rawData;
                
                if (item.type === 'dynamic' && window.Ch8Generators && window.Ch8Generators[item.generator]) {
                    rawData = window.Ch8Generators[item.generator]();
                } else if (item.type === 'static') {
                    rawData = {
                        question: item.question,
                        rawOptions: item.rawOptions,
                        explanation: item.explanation
                    };
                }

                if (rawData) {
                    let processedOptions = rawData.rawOptions.map((opt, i) => ({
                        text: opt,
                        isCorrect: i === 0 
                    }));

                    if (optionSort === 'asc') {
                        processedOptions.sort((a, b) => extractNumber(a.text) - extractNumber(b.text));
                    } else if (optionSort === 'desc') {
                        processedOptions.sort((a, b) => extractNumber(b.text) - extractNumber(a.text));
                    } else {
                        for (let i = processedOptions.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [processedOptions[i], processedOptions[j]] = [processedOptions[j], processedOptions[i]];
                        }
                    }

                    const mcqCard = document.createElement('div');
                    mcqCard.className = 'mcq-card';
                    
                    let optionsHTML = '';
                    processedOptions.forEach((opt) => {
                        let preClass = (showAnswersDefault && opt.isCorrect) ? 'reveal-correct selected' : '';
                        optionsHTML += `<button class="bn-text mcq-option ${preClass}" data-correct="${opt.isCorrect}">${opt.text}</button>`;
                    });

                    let hintHTML = '';
                    if (currentMode === 'teach') {
                        hintHTML = `<div class="mcq-feedback hint-mode bn-text">
                            <strong><i data-lucide="lightbulb"></i> টিপস/ব্যাখ্যা:</strong><br> ${rawData.explanation}
                        </div>`;
                    }

                    mcqCard.innerHTML = `
                        <div class="mcq-question bn-text">${index + 1}. ${rawData.question}</div>
                        ${hintHTML}
                        <div class="mcq-options">${optionsHTML}</div>
                        <div class="mcq-feedback bn-text"></div>
                    `;

                    const optionBtns = mcqCard.querySelectorAll('.mcq-option');
                    const feedbackDiv = mcqCard.querySelectorAll('.mcq-feedback')[currentMode === 'teach' ? 1 : 0];

                    optionBtns.forEach(btn => {
                        btn.addEventListener('click', function() {
                            if (mcqCard.querySelector('.mcq-option.selected.correct') || mcqCard.querySelector('.mcq-option.selected.wrong')) return;

                            const isCorrect = this.getAttribute('data-correct') === 'true';
                            this.classList.add('selected');
                            this.classList.add(isCorrect ? 'correct' : 'wrong');

                            if (!isCorrect && !showAnswersDefault) {
                                optionBtns.forEach(b => {
                                    if (b.getAttribute('data-correct') === 'true') {
                                        b.classList.add('reveal-correct');
                                        b.innerHTML += ' <span style="font-weight:bold;">(সঠিক)</span>';
                                    }
                                });
                            }

                            if (currentMode === 'practice') {
                                feedbackDiv.classList.add('show', isCorrect ? 'correct-fb' : 'wrong-fb');
                                feedbackDiv.innerHTML = `
                                    <strong>${isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল উত্তর!'}</strong> <br><br>
                                    <strong>ব্যাখ্যা:</strong> ${rawData.explanation}
                                `;
                                queueMathJaxRendering(feedbackDiv);
                            }
                        });
                    });

                    mcqContainer.appendChild(mcqCard);
                }
            });

            if (typeof lucide !== 'undefined') lucide.createIcons();
            queueMathJaxRendering(mcqContainer);

        } catch (error) {
            mcqContainer.innerHTML = '<div class="bn-text" style="color:red;">MCQ লোড করতে সমস্যা হয়েছে। JSON ফাইলটি চেক করুন।</div>';
            console.error(error);
        }
    };

    setTimeout(() => { renderMCQs(); }, 100);

    [regenBtn, modeSelect, serialSelect, sortSelect, answerSelect].forEach(el => {
        if(el) el.addEventListener('change', renderMCQs);
    });
    if(regenBtn) regenBtn.addEventListener('click', renderMCQs);

});