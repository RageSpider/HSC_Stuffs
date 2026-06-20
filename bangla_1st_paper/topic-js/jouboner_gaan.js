// topic-js/jouboner_gaan.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Bangla specific local storage key
    const savedTab = localStorage.getItem('jouboner_gaan_active_tab') || 'prose';

    const switchTab = (targetId) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none'; 
        });
        
        const btn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        const content = document.getElementById(targetId + '-tab');
        
        if(btn && content) {
            btn.classList.add('active');
            content.style.display = 'block';
            
            // Clean, professional fade and slide-up animation
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(content, {opacity: 0, y: 15}, {opacity: 1, y: 0, duration: 0.4, ease: "power2.out"});
            } else {
                setTimeout(() => { content.classList.add('active'); }, 50);
            }
            localStorage.setItem('jouboner_gaan_active_tab', targetId);

            // Initialize specific tab logic securely
            if (targetId === 'mcq' && !window.mcqLoaded_joubon) {
                try {
                    if(typeof loadMCQ === 'function') loadMCQ();
                } catch (e) {
                    console.error("MCQ script error:", e);
                }
                window.mcqLoaded_joubon = true;
            }
            if (targetId === 'cq' && !window.cqLoaded_joubon) {
                try {
                    if(typeof loadCQ === 'function') loadCQ();
                } catch (e) {
                    console.error("CQ script error:", e);
                }
                window.cqLoaded_joubon = true;
            }
        }
    };

    switchTab(savedTab);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            switchTab(btn.dataset.tab);
        });
    });

    // 3. Smart Prose Pagination & Memory Cache System (1:1 Text replication)
    let prosePages = [];
    let proseCache = {}; 
    
    // Resume exactly where the user left off
    let currentPageIndex = parseInt(localStorage.getItem('jouboner_gaan_prose_page') || '0', 10);
    
    const viewer = document.getElementById('prose-viewer');
    const pageTitle = document.getElementById('prose-page-title');
    const btnPrevs = document.querySelectorAll('.btn-prev');
    const btnNexts = document.querySelectorAll('.btn-next');
    const currentNumSpans = document.querySelectorAll('.current-page-num');
    const totalNumSpans = document.querySelectorAll('.total-page-num');

    // Silent Background Pre-fetcher
    const preloadProse = () => {
        prosePages.forEach((page, index) => {
            if(index !== currentPageIndex) { 
                fetch(`../topic-data/jouboner_gaan/${page.file}`)
                    .then(res => res.ok ? res.text() : null)
                    .then(html => { if(html) proseCache[index] = html; })
                    .catch(() => {}); 
            }
        });
    };

    // Fetch the Prose JSON metadata
    fetch('../topic-data/jouboner_gaan/prose.json')
        .then(response => response.json())
        .then(data => {
            prosePages = data;
            if(currentPageIndex >= prosePages.length) currentPageIndex = 0;
            
            totalNumSpans.forEach(span => span.textContent = prosePages.length);
            loadProsePage(currentPageIndex);
            
            setTimeout(preloadProse, 1000); 
        })
        .catch(err => {
            viewer.innerHTML = `<div style="color:var(--ch-primary); text-align:center; padding: 40px; font-weight: bold;" class="bn-text">মূল পাঠ লোড করতে সমস্যা হয়েছে!</div>`;
        });

    function renderContent(htmlContent) {
        viewer.innerHTML = htmlContent;
        if (typeof lucide !== 'undefined') {
            const icons = viewer.querySelectorAll('[data-lucide]');
            icons.forEach(icon => {
                const name = icon.getAttribute('data-lucide');
                if (lucide.icons[name]) {
                    const svg = lucide.createElement(lucide.icons[name]);
                    icon.parentNode.replaceChild(svg, icon);
                }
            });
        }
        if (typeof gsap !== 'undefined') gsap.fromTo(viewer, {opacity: 0, x: -10}, {opacity: 1, x: 0, duration: 0.3});
    }

    function loadProsePage(index, shouldScroll = false) {
        if (index < 0 || index >= prosePages.length) return;
        currentPageIndex = index;
        localStorage.setItem('jouboner_gaan_prose_page', currentPageIndex); 
        
        const pageData = prosePages[index];
        
        pageTitle.textContent = pageData.title;
        currentNumSpans.forEach(span => span.textContent = pageData.page);
        
        btnPrevs.forEach(btn => btn.disabled = (currentPageIndex === 0));
        btnNexts.forEach(btn => btn.disabled = (currentPageIndex === prosePages.length - 1));

        if (shouldScroll) {
            window.scrollTo({ top: document.getElementById('prose-tab').offsetTop - 80, behavior: 'smooth' }); 
        }

        if(proseCache[index]) {
            renderContent(proseCache[index]);
            return;
        }

        viewer.innerHTML = `<div class="loader bn-text"><i data-lucide="sun" class="pulse-flame"></i> পাঠ্যবই লোড হচ্ছে...</div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        fetch(`../topic-data/jouboner_gaan/${pageData.file}`)
            .then(res => { if(!res.ok) throw new Error("File not found"); return res.text(); })
            .then(htmlContent => {
                proseCache[index] = htmlContent; 
                renderContent(htmlContent);
            })
            .catch(err => {
                viewer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding: 60px 20px; background: var(--bg-main);">
                    <i data-lucide="file-warning" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3 class="bn-text" style="font-size: 1.5rem; margin-bottom: 10px;">দুঃখিত!</h3>
                    <p class="bn-text">এই পৃষ্ঠার কনটেন্ট (${pageData.file}) এখনও যুক্ত করা হয়নি।</p>
                </div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
    }

    btnPrevs.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPageIndex > 0) loadProsePage(currentPageIndex - 1, true); 
        });
    });

    btnNexts.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPageIndex < prosePages.length - 1) loadProsePage(currentPageIndex + 1, true); 
        });
    });

    // Sharp Hero Animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.fromTo(".ch-badge", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1 })
          .fromTo(".ch-title", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3")
          .fromTo(".ch-author", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
          .fromTo(".ch-subtitle", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.2");
    }
});