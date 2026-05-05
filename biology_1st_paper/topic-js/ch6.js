// topic-js/ch6.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Tab Switching Logic (Smooth GSAP Entry)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const savedTab = localStorage.getItem('ch6_active_tab') || 'lecture';

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
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(content, {opacity: 0, y: 15}, {opacity: 1, y: 0, duration: 0.4, ease: "power2.out"});
            } else {
                setTimeout(() => { content.classList.add('active'); }, 50);
            }
            localStorage.setItem('ch6_active_tab', targetId);

            // Initialize specific tab logic securely
            if (targetId === 'mcq' && !window.mcqLoaded) {
                if(typeof loadMCQ === 'function') loadMCQ();
                window.mcqLoaded = true;
            }
            if (targetId === 'cq' && !window.cqLoaded) {
                if(typeof loadCQ === 'function') loadCQ();
                window.cqLoaded = true;
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

    // 3. Smart Lecture Pagination & Memory Cache System
    let lecturePages = [];
    let lectureCache = {}; // Packet loading memory store
    
    // Resume exactly where the user left off
    let currentPageIndex = parseInt(localStorage.getItem('ch6_lecture_page') || '0', 10);
    
    const viewer = document.getElementById('lecture-viewer');
    const pageTitle = document.getElementById('lecture-page-title');
    const btnPrevs = document.querySelectorAll('.btn-prev');
    const btnNexts = document.querySelectorAll('.btn-next');
    const currentNumSpans = document.querySelectorAll('.current-page-num');
    const totalNumSpans = document.querySelectorAll('.total-page-num');

    // Silent Background Pre-fetcher
    const preloadLectures = () => {
        lecturePages.forEach((page, index) => {
            if(index !== currentPageIndex) { // Skip the one we are already showing
                fetch(`../topic-data/ch6/${page.file}`)
                    .then(res => res.ok ? res.text() : null)
                    .then(html => { if(html) lectureCache[index] = html; })
                    .catch(() => {}); // Fail silently in background
            }
        });
    };

    // Fetch the lecture JSON metadata
    fetch('../topic-data/ch6/lecture.json')
        .then(response => response.json())
        .then(data => {
            lecturePages = data;
            
            // Safety check if localStorage index out of bounds
            if(currentPageIndex >= lecturePages.length) currentPageIndex = 0;
            
            totalNumSpans.forEach(span => span.textContent = lecturePages.length);
            loadLecturePage(currentPageIndex);
            
            // Start background fetching (Packet Loading)
            setTimeout(preloadLectures, 1000); 
        })
        .catch(err => {
            viewer.innerHTML = `<div style="color:var(--ch-accent); text-align:center; padding: 40px;" class="bn-text">লেকচার ডেটা লোড করতে সমস্যা হয়েছে!</div>`;
        });

    function renderContent(htmlContent) {
        viewer.innerHTML = htmlContent;
        // Optimization: Only run lucide inside the viewer, not the whole document
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
        if (typeof gsap !== 'undefined') gsap.fromTo(viewer, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
    }

    function loadLecturePage(index, shouldScroll = false) {
        if (index < 0 || index >= lecturePages.length) return;
        currentPageIndex = index;
        localStorage.setItem('ch6_lecture_page', currentPageIndex); // Save State
        
        const pageData = lecturePages[index];
        
        pageTitle.textContent = pageData.title;
        currentNumSpans.forEach(span => span.textContent = pageData.page);
        
        // Control button states
        btnPrevs.forEach(btn => btn.disabled = (currentPageIndex === 0));
        btnNexts.forEach(btn => btn.disabled = (currentPageIndex === lecturePages.length - 1));

        if (shouldScroll) {
            window.scrollTo({ top: document.getElementById('lecture-tab').offsetTop - 80, behavior: 'smooth' }); 
        }

        // Instant load from cache if available!
        if(lectureCache[index]) {
            renderContent(lectureCache[index]);
            return;
        }

        // Fallback to fetching
        viewer.innerHTML = `<div class="loader bn-text"><i data-lucide="loader-2" class="spin"></i> লোড হচ্ছে...</div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        fetch(`../topic-data/ch6/${pageData.file}`)
            .then(res => { if(!res.ok) throw new Error("File not found"); return res.text(); })
            .then(htmlContent => {
                lectureCache[index] = htmlContent; // Save to cache
                renderContent(htmlContent);
            })
            .catch(err => {
                viewer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding: 60px 20px;">
                    <i data-lucide="file-warning" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3 class="bn-text" style="font-size: 1.5rem; margin-bottom: 10px;">দুঃখিত!</h3>
                    <p class="bn-text">এই পৃষ্ঠার কনটেন্ট (${pageData.file}) এখনও যুক্ত করা হয়নি।</p>
                </div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
    }

    // Attach listeners to ALL pagination buttons (Top & Bottom)
    btnPrevs.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPageIndex > 0) loadLecturePage(currentPageIndex - 1, true); 
        });
    });

    btnNexts.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPageIndex < lecturePages.length - 1) loadLecturePage(currentPageIndex + 1, true); 
        });
    });

    // 4. Smooth Hero Animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.fromTo(".ch-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 })
          .fromTo(".ch-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".ch-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
    }
});