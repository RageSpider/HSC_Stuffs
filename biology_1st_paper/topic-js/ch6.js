// topic-js/ch6.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Tab Switching Logic (Smooth GSAP Entry)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Get last active tab from localStorage, default to lecture
    const savedTab = localStorage.getItem('ch6_active_tab') || 'lecture';

    const switchTab = (targetId) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none'; // FIX: Explicitly hide previous tabs
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

    // 3. Lecture Pagination System
    let lecturePages = [];
    let currentPageIndex = 0;
    
    const viewer = document.getElementById('lecture-viewer');
    const pageTitle = document.getElementById('lecture-page-title');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const currentNumSpan = document.getElementById('current-page-num');
    const totalNumSpan = document.getElementById('total-page-num');

    // Fetch the lecture JSON
    fetch('../topic-data/ch6/lecture.json')
        .then(response => response.json())
        .then(data => {
            lecturePages = data;
            totalNumSpan.textContent = lecturePages.length;
            loadLecturePage(0);
        })
        .catch(err => {
            viewer.innerHTML = `<div style="color:var(--ch-accent); text-align:center; padding: 40px;" class="bn-text">লেকচার ডেটা লোড করতে সমস্যা হয়েছে!</div>`;
        });

    function loadLecturePage(index) {
        if (index < 0 || index >= lecturePages.length) return;
        currentPageIndex = index;
        const pageData = lecturePages[index];
        
        pageTitle.textContent = pageData.title;
        currentNumSpan.textContent = pageData.page;
        viewer.innerHTML = `<div class="loader bn-text"><i data-lucide="loader-2" class="spin"></i> লোড হচ্ছে...</div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Control button states
        btnPrev.disabled = (currentPageIndex === 0);
        btnNext.disabled = (currentPageIndex === lecturePages.length - 1);

        fetch(`../topic-data/ch6/${pageData.file}`)
            .then(res => { if(!res.ok) throw new Error("File not found"); return res.text(); })
            .then(htmlContent => {
                viewer.innerHTML = htmlContent;
                if (typeof lucide !== 'undefined') lucide.createIcons(); 
                if (typeof gsap !== 'undefined') gsap.fromTo(viewer, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4});
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

    btnPrev.addEventListener('click', () => {
        if (currentPageIndex > 0) { 
            loadLecturePage(currentPageIndex - 1); 
            window.scrollTo({ top: document.querySelector('.ch-nav-section').offsetTop - 20, behavior: 'smooth' }); 
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentPageIndex < lecturePages.length - 1) { 
            loadLecturePage(currentPageIndex + 1); 
            window.scrollTo({ top: document.querySelector('.ch-nav-section').offsetTop - 20, behavior: 'smooth' }); 
        }
    });

    // 4. Smooth Hero Animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.fromTo(".ch-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 })
          .fromTo(".ch-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".ch-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
    }
});