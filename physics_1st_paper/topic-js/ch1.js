// topic-js/ch1.js

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Tab Persistence and Switching (Default to MCQ since Formulas are removed)
    const tabBtns = document.querySelectorAll('.tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get last active tab from localStorage, default to MCQ
    const savedTab = localStorage.getItem('ch1_active_tab') || 'tab-mcq';

    const switchTab = (targetId) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        const btn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        const content = document.getElementById(targetId);
        
        if(btn && content) {
            btn.classList.add('active');
            content.classList.add('active');
            localStorage.setItem('ch1_active_tab', targetId);
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

    // MathJax Queue System (Still needed for MCQ and CQ text)
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

    // Note: Formula loading block completely removed as requested for Chapter 1.
    // Ensure lucide icons are rendered for initial page load
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Scroll FABs Logic
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