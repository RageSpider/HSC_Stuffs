// js/chapter.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch the User's Note dynamically
    const noteContainer = document.getElementById('note-container');
    
    if (noteContainer) {
        // Because this script runs in /chapter/, ../data/note.html maps perfectly.
        fetch('../data/note.html')
            .then(response => {
                if (!response.ok) throw new Error("Note file not found");
                return response.text();
            })
            .then(html => {
                // Inject the note HTML into the paper container
                noteContainer.innerHTML = html;
                
                // Re-initialize any Lucide icons that were in the fetched note
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Add a small fade-in animation to the note content using GSAP
                if (typeof gsap !== 'undefined') {
                    gsap.from(noteContainer.children, {
                        y: 20,
                        opacity: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching the note:", error);
                noteContainer.innerHTML = `
                    <div style="text-align:center; padding: 40px; color: var(--chem-red);">
                        <i data-lucide="file-warning" style="width:48px; height:48px; margin-bottom:15px; opacity:0.5;"></i>
                        <p>নোট ফাইলটি (data/note.html) পাওয়া যায়নি। দয়া করে নিশ্চিত করুন ফাইলটি নির্দিষ্ট ফোল্ডারে আছে।</p>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
    }

    // 2. Hero Section Animations
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.fromTo(".breadcrumbs", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 })
          .fromTo(".chapter-badge", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
          .fromTo(".chapter-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
          .fromTo(".chapter-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    }
});