// js/index.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Init Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.addEventListener('navbarLoaded', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });

    // 2. Data Injection for Prose & Poetry (Using requested filenames)
    const proseData = [
        { num: '০১', title: 'বাঙ্গালার নব্য লেখকদিগের প্রতি নিবেদন', author: 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়', icon: 'feather', link: 'bangalar_nobbo_lekhokdiger_proti_nibedon' },
        { num: '০২', title: 'অপরিচিতা', author: 'রবীন্দ্রনাথ ঠাকুর', icon: 'book-open', link: 'oporichita' },
        { num: '০৩', title: 'সাহিত্যে খেলা', author: 'প্রমথ চৌধুরী', icon: 'pen-tool', link: 'shahitye_khela' },
        { num: '০৪', title: 'বিলাসী', author: 'শরৎচন্দ্র চট্টোপাধ্যায়', icon: 'heart', link: 'bilashi' },
        { num: '০৫', title: 'অর্ধাঙ্গী', author: 'রোকেয়া সাখাওয়াত হোসেন', icon: 'users', link: 'ordhangi' },
        { num: '০৬', title: 'যৌবনের গান', author: 'কাজী নজরুল ইসলাম', icon: 'music', link: 'jouboner_gaan' },
        { num: '০৭', title: 'জীবন ও বৃক্ষ', author: 'মোতাহের হোসেন চৌধুরী', icon: 'tree-deciduous', link: 'jibon_o_brikkho' },
        { num: '০৮', title: 'গন্তব্য কাবুল', author: 'সৈয়দ মুজতবা আলী', icon: 'map', link: 'gontobbo_kabul' },
        { num: '০৯', title: 'মাসি-পিসি', author: 'মানিক বন্দ্যোপাধ্যায়', icon: 'home', link: 'mashi_pishi' },
        { num: '১০', title: 'কপিলদাস মুর্মুর শেষ কাজ', author: 'শওকত আলী', icon: 'briefcase', link: 'kopildash_murmur_shesh_kaj' },
        { num: '১১', title: 'রেইনকোট', author: 'আখতারুজ্জামান ইলিয়াস', icon: 'cloud-rain', link: 'raincoat' },
        { num: '১২', title: 'নেকলেস', author: 'গী দ্য মোপাসাঁ', icon: 'gem', link: 'necklace' }
    ];

    const poetryData = [
        { num: '০১', title: 'ঋতু-বর্ণন', author: 'আলাওল', icon: 'sun', link: 'ritu_bornon' },
        { num: '০২', title: 'বিভীষণের প্রতি মেঘনাদ', author: 'মাইকেল মধুসূদন দত্ত', icon: 'swords', link: 'bibhishoner_proti_meghnad' },
        { num: '০৩', title: 'সোনার তরী', author: 'রবীন্দ্রনাথ ঠাকুর', icon: 'ship', link: 'sonar_tori' },
        { num: '০৪', title: 'বিদ্রোহী', author: 'কাজী নজরুল ইসলাম', icon: 'flame', link: 'bidrohi' },
        { num: '০৫', title: 'সুচেতনা', author: 'জীবনানন্দ দাশ', icon: 'eye', link: 'suchetona' },
        { num: '০৬', title: 'প্রতিদান', author: 'জসীমউদ্দীন', icon: 'gift', link: 'protidan' },
        { num: '০৭', title: 'তাহারেই পড়ে মনে', author: 'সুফিয়া কামাল', icon: 'cloud', link: 'taharei_pore_mone' },
        { num: '০৮', title: 'পদ্মা', author: 'ফররুখ আহমদ', icon: 'waves', link: 'padma' },
        { num: '০৯', title: 'ফেব্রুয়ারি ১৯৬৯', author: 'শামসুর রাহমান', icon: 'flag', link: 'february_1969' },
        { num: '১০', title: 'আঠার বছর বয়স', author: 'সুকান্ত ভট্টাচার্য', icon: 'zap', link: 'atharo_bochor_boyosh' },
        { num: '১১', title: 'আমি কিংবদন্তির কথা বলছি', author: 'আবু জাফর ওবায়দুল্লাহ্', icon: 'message-circle', link: 'ami_kingbodontir_kotha_bolchi' },
        { num: '১২', title: 'প্রত্যাবর্তনের লজ্জা', author: 'আল মাহমুদ', icon: 'corner-down-left', link: 'prottabortoner_lojja' }
    ];

    // Updated Card Structure for better design
    const generateCards = (data, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        let html = '';
        data.forEach((item) => {
            html += `
                <a href="topic/${item.link}.html" class="lit-card">
                    <div class="card-spine"></div>
                    <div class="card-inner">
                        <div class="card-header-flex">
                            <span class="card-num bn-text">${item.num}</span>
                            <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
                        </div>
                        <div class="card-content">
                            <h3 class="bn-text">${item.title}</h3>
                            <p class="author bn-text">${item.author}</p>
                        </div>
                        <div class="card-action">
                            <span class="action-text bn-text">পড়তে শুরু করো</span>
                            <i data-lucide="arrow-right"></i>
                        </div>
                    </div>
                </a>
            `;
        });
        container.innerHTML = html;
    };

    generateCards(proseData, 'prose-grid');
    generateCards(poetryData, 'poetry-grid');
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 3. GSAP Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();
        tl.fromTo(".hero-cover-frame", { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" })
          .fromTo(".hero-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
          .fromTo(".hero-subtitle-blue", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-buttons", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.fromTo(header, { y: 40, opacity: 0 }, { scrollTrigger: { trigger: header, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
        });

        gsap.utils.toArray('.lit-grid, .sahopath-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.lit-card');
            if(cards.length > 0) {
                gsap.fromTo(cards, 
                    { y: 50, opacity: 0 },
                    { scrollTrigger: { trigger: grid, start: "top 85%" }, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
                );
            }
        });
    }
});