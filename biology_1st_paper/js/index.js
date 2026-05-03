// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Init Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.addEventListener('navbarLoaded', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });

    // 2. Data Injection for Biology Chapters (Stem and Leaf Logic)
    const chapterData = [
        { num: '১ম', title: 'কোষ ও এর গঠন', desc: 'Cell and its structure', icon: 'hexagon', link: 'ch1' },
        { num: '২য়', title: 'কোষ বিভাজন', desc: 'Cell Division', icon: 'split-square-horizontal', link: 'ch2' },
        { num: '৩য়', title: 'কোষ রসায়ন', desc: 'Cell Chemistry', icon: 'flask-conical', link: 'ch3' },
        { num: '৪র্থ', title: 'অণুজীব', desc: 'Microbes', icon: 'bug', link: 'ch4' },
        { num: '৫ম', title: 'শৈবাল ও ছত্রাক', desc: 'Algae and Fungi', icon: 'sprout', link: 'ch5' },
        { num: '৬ষ্ঠ', title: 'ব্রায়োফাইটা ও টেরেডোফাইটা', desc: 'Bryophyta and Pteridophyta', icon: 'leaf', link: 'ch6' },
        { num: '৭ম', title: 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', desc: 'Nagnabiji and Abritabiji', icon: 'tree-pine', link: 'ch7' },
        { num: '৮ম', title: 'টিস্যু ও টিস্যুতন্ত্র', desc: 'Tissue and Tissue System', icon: 'layers', link: 'ch8' },
        { num: '৯ম', title: 'উদ্ভিদের শারীরতত্ত্ব', desc: 'Plant Physiology', icon: 'activity', link: 'ch9' },
        { num: '১০ম', title: 'উদ্ভিদের প্রজনন', desc: 'Plant Reproduction', icon: 'flower-2', link: 'ch10' },
        { num: '১১শ', title: 'জীবপ্রযুক্তি', desc: 'Biotechnology', icon: 'dna', link: 'ch11' },
        { num: '১২শ', title: 'উপকল্পন ও অভিব্যক্তি', desc: 'Evolution and Interpretation', icon: 'footprints', link: 'ch12' }
    ];

    // Generating "Leaf" Cards for the Botanical Timeline
    const generateCards = () => {
        const container = document.getElementById('botany-timeline');
        if (!container) return;
        let html = '';
        chapterData.forEach((item) => {
            html += `
                <a href="topic/${item.link}.html" class="leaf-card">
                    <div class="card-header">
                        <div class="card-badge bn-text">অধ্যায় ${item.num}</div>
                        <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
                    </div>
                    <h3 class="bn-text">${item.title}</h3>
                    <p class="bn-text" style="font-family: 'Poppins', sans-serif; opacity: 0.8; font-size: 0.95rem;">${item.desc}</p>
                    
                    <div class="card-action">
                        <span class="bn-text">পড়তে শুরু করো</span>
                        <i data-lucide="arrow-right"></i>
                    </div>
                </a>
            `;
        });
        container.innerHTML = html;
    };

    generateCards();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 3. GSAP Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();
        tl.fromTo(".badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
          .fromTo(".hero-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-buttons", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header, { y: 40, opacity: 0 }, { scrollTrigger: { trigger: header, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
        });

        // Stagger the timeline leaves
        const leaves = document.querySelectorAll('.leaf-card');
        if(leaves.length > 0) {
            gsap.fromTo(leaves, 
                { y: 50, opacity: 0 },
                { scrollTrigger: { trigger: "#botany-timeline", start: "top 80%" }, y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }
            );
        }
    }
});