// topic-js/ch4.js

// Global Utility: Automatically extract Bangla \text{} outside MathJax blocks to fix SVG rendering
window.fixBanglaMathJax = function(text) {
    if (!text || typeof text !== 'string') return text;
    // Find everything inside $...$
    let processed = text.replace(/\$([^$]+)\$/g, (match, content) => {
        // Replace \text{Bangla} with $ Bangla $ to push it out of the math block
        let newContent = content.replace(/\\text\s*\{([^{}]+)\}/g, '$$ $1 $$');
        return '$' + newContent + '$';
    });
    // Clean up empty math blocks (e.g., $$) created by adjacent text
    processed = processed.replace(/\$\s*\$/g, '');
    return processed;
};

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Tab Persistence and Switching
    const tabBtns = document.querySelectorAll('.tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get last active tab from localStorage, default to formulas
    const savedTab = localStorage.getItem('ch4_active_tab') || 'tab-formulas';

    const switchTab = (targetId) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        const btn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        const content = document.getElementById(targetId);
        
        if(btn && content) {
            btn.classList.add('active');
            content.classList.add('active');
            localStorage.setItem('ch4_active_tab', targetId);
        }
    };

    // Initialize saved tab
    switchTab(savedTab);

    // Bind click events
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            if (target) switchTab(target);
        });
    });

    // MathJax Queue System 
    let mathJaxPromise = Promise.resolve();
    window.queueMathJaxRendering = (element) => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            mathJaxPromise = mathJaxPromise.then(() => {
                return MathJax.typesetPromise([element]);
            }).catch((err) => {
                console.warn("MathJax Typeset Error Handled gracefully:", err);
            });
        }
    };

    // 2. Load Equations dynamically
    const loadEquations = async () => {
        const container = document.getElementById('formula-container');
        if (!container) return;

        try {
            const response = await fetch('../topic-data/ch4/equation.json');
            if (!response.ok) throw new Error("Equations fetch failed");
            
            const data = await response.json();
            container.innerHTML = '';

            const fragment = document.createDocumentFragment();

            data.forEach(eq => {
                const card = document.createElement('div');
                card.className = 'formula-card-modern';
                
                // Apply the fixBanglaMathJax utility here
                let equationsHTML = eq.equations.map(e => `${window.fixBanglaMathJax(e)}<br><br>`).join('');
                equationsHTML = equationsHTML.slice(0, -8); // remove last <br><br>

                let variablesHTML = eq.variables.map(v => `
                    <li><span class="math-var">$${window.fixBanglaMathJax(v.sym)}$</span> ${window.fixBanglaMathJax(v.desc)}</li>
                `).join('');

                card.innerHTML = `
                    <div class="fc-header">
                        <div class="fc-icon"><i data-lucide="${eq.icon}"></i></div>
                        <h4 class="bn-text">${eq.title}</h4>
                    </div>
                    <div class="fc-body">
                        <div class="fc-math">$${equationsHTML}$</div>
                        <div class="fc-desc bn-text">
                            <ul>${variablesHTML}</ul>
                        </div>
                    </div>
                `;
                fragment.appendChild(card);
            });

            container.appendChild(fragment);

            if (typeof lucide !== 'undefined') lucide.createIcons();
            window.queueMathJaxRendering(container);

        } catch (error) {
            console.error(error);
            container.innerHTML = '<div class="bn-text" style="color:red;">সূত্রাবলি লোড করতে সমস্যা হয়েছে।</div>';
        }
    };

    loadEquations();

    // 3. Scroll FABs Logic
    const scrollControls = document.getElementById('scroll-controls');
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const scrollBottomBtn = document.getElementById('scroll-bottom-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollControls.classList.add('visible');
        } else {
            scrollControls.classList.remove('visible');
        }
    });

    if(scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if(scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
});