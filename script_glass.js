document.addEventListener('DOMContentLoaded', () => {

    // Professional Button → enter portfolio
    const btnProfessional = document.getElementById('btn-professional');
    if (btnProfessional) {
        btnProfessional.addEventListener('click', () => {
            document.body.classList.remove('entry-active');
        });
    }

    // Personal Button → show Coming Soon toast
    const btnPersonal = document.getElementById('btn-personal');
    const comingSoonToast = document.getElementById('coming-soon-toast');

    function showComingSoon() {
        if (comingSoonToast) {
            comingSoonToast.classList.add('show');
            setTimeout(() => comingSoonToast.classList.remove('show'), 2500);
        }
    }

    if (btnPersonal) btnPersonal.addEventListener('click', showComingSoon);

    // Any card marked .coming-soon-trigger → show Coming Soon toast
    document.querySelectorAll('.coming-soon-trigger').forEach(el => {
        el.addEventListener('click', showComingSoon);
    });

    // Switch to Entry Portal (Selection Page) Logic
    const switchBtn = document.getElementById('switch-to-portal');
    if (switchBtn) {
        switchBtn.addEventListener('click', () => {
            // Re‑activate entry portal
            document.body.classList.add('entry-active');
            // Optionally scroll to top for a clean view
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset for fixed nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add intersection observer to highlight nav links on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.color = 'var(--text-main)';
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.style.color = 'var(--primary)';
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
