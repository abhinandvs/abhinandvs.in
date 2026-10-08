document.addEventListener('DOMContentLoaded', () => {

    // Typewriter Elements
    const badgeTextEl = document.querySelector('.typewriter-text');
    const nameFirstEl = document.querySelector('.typewriter-name-first');
    const nameLastEl = document.querySelector('.typewriter-name-last');
    const heroSection = document.getElementById('hero');
    const heroP = document.querySelector('.hero-text p');

    const roleTarget = "Embedded Systems Engineer";
    const nameFirstTarget = "ABHINAND";
    const nameLastTarget = "VS";

    let badgeTimeout = null;
    let nameTimeout = null;
    let isHeroActive = false;

    function resetHeroSubtitle() {
        if (heroP) {
            heroP.classList.remove('animate-in');
            void heroP.offsetWidth; // Force CSS reflow
            heroP.classList.add('animate-in');
        }
    }

    function startTypingAnimations() {
        // Clear any running timeouts
        if (badgeTimeout) clearTimeout(badgeTimeout);
        if (nameTimeout) clearTimeout(nameTimeout);

        // Reset elements to empty before typing
        if (badgeTextEl) badgeTextEl.textContent = '';
        if (nameFirstEl) nameFirstEl.textContent = '';
        if (nameLastEl) nameLastEl.textContent = '';

        resetHeroSubtitle();

        // 1. Type Role: Only "Embedded Systems Engineer"
        let badgeChar = 0;
        function typeBadge() {
            if (!isHeroActive || !badgeTextEl) return;
            if (badgeChar < roleTarget.length) {
                badgeChar++;
                badgeTextEl.textContent = roleTarget.substring(0, badgeChar);
                badgeTimeout = setTimeout(typeBadge, 42); // Crisp typing pace
            }
        }
        badgeTimeout = setTimeout(typeBadge, 80);

        // 2. Type Name: "ABHINAND" then "VS"
        let firstChar = 0;
        let lastChar = 0;

        function typeNameFirst() {
            if (!isHeroActive) return;
            if (firstChar < nameFirstTarget.length) {
                firstChar++;
                if (nameFirstEl) nameFirstEl.textContent = nameFirstTarget.substring(0, firstChar);
                nameTimeout = setTimeout(typeNameFirst, 60);
            } else {
                // Done with ABHINAND, short natural gap then type VS
                nameTimeout = setTimeout(typeNameLast, 100);
            }
        }

        function typeNameLast() {
            if (!isHeroActive) return;
            if (lastChar < nameLastTarget.length) {
                lastChar++;
                if (nameLastEl) nameLastEl.textContent = nameLastTarget.substring(0, lastChar);
                nameTimeout = setTimeout(typeNameLast, 70);
            }
        }

        // Stagger name typing slightly after badge starts
        nameTimeout = setTimeout(typeNameFirst, 200);
    }

    function activateHero() {
        isHeroActive = true;
        startTypingAnimations();
    }

    function deactivateHero() {
        isHeroActive = false;
        if (badgeTimeout) clearTimeout(badgeTimeout);
        if (nameTimeout) clearTimeout(nameTimeout);
    }

    // Scroll Down & Up Observer for Hero Section
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!document.body.classList.contains('entry-active')) {
                        activateHero();
                    }
                } else {
                    deactivateHero();
                }
            });
        }, {
            threshold: 0.15
        });

        heroObserver.observe(heroSection);
    }

    // Professional Button → enter portfolio & launch animation
    const btnProfessional = document.getElementById('btn-professional');
    if (btnProfessional) {
        btnProfessional.addEventListener('click', () => {
            document.body.classList.remove('entry-active');
            setTimeout(() => {
                activateHero();
            }, 300);
        });
    }

    // If page is loaded/relaunched without entry portal active
    if (!document.body.classList.contains('entry-active')) {
        activateHero();
    }

    // Coming Soon toast handler
    const comingSoonToast = document.getElementById('coming-soon-toast');

    function showComingSoon() {
        if (comingSoonToast) {
            comingSoonToast.classList.add('show');
            setTimeout(() => comingSoonToast.classList.remove('show'), 2500);
        }
    }

    document.querySelectorAll('.coming-soon-trigger').forEach(el => {
        el.addEventListener('click', showComingSoon);
    });

    // Switch to Entry Portal (Selection Page) Logic
    const switchBtn = document.getElementById('switch-to-portal');
    if (switchBtn) {
        switchBtn.addEventListener('click', () => {
            deactivateHero();
            document.body.classList.add('entry-active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection observer to highlight nav links on scroll
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
                    link.style.color = '';
                    link.style.background = '';
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.style.color = 'var(--forest-primary)';
                        link.style.background = 'var(--sage-pill)';
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
