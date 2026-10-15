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

    // Professional Button → enter portfolio
    const btnProfessional = document.getElementById('btn-professional');

    if (btnProfessional) {
        btnProfessional.addEventListener('click', () => {
            closeMobileMenu();
            document.body.classList.remove('entry-active');
            activateHero();
            setTimeout(checkAboutVisibilityOnEntry, 150);
        });
    }

    // If page is loaded/relaunched without entry portal active
    if (!document.body.classList.contains('entry-active')) {
        activateHero();
        setTimeout(checkAboutVisibilityOnEntry, 200);
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
            closeMobileMenu();
            deactivateHero();
            resetAboutWaveform();
            document.body.classList.add('entry-active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Hamburger Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const royalNav = document.getElementById('royal-nav') || document.querySelector('.royal-nav');
    const navBackdrop = document.getElementById('nav-backdrop');
    const navLinksContainer = document.getElementById('nav-menu') || document.querySelector('.nav-links');

    function closeMobileMenu() {
        if (royalNav && royalNav.classList.contains('menu-open')) {
            royalNav.classList.remove('menu-open');
            if (navToggle) {
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
            if (navBackdrop) {
                navBackdrop.classList.remove('is-active');
            }
        }
    }

    function toggleMobileMenu() {
        if (!royalNav) return;
        const isOpen = royalNav.classList.contains('menu-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            royalNav.classList.add('menu-open');
            if (navToggle) {
                navToggle.classList.add('is-active');
                navToggle.setAttribute('aria-expanded', 'true');
            }
            if (navBackdrop) {
                navBackdrop.classList.add('is-active');
            }
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close when clicking outside of nav
    document.addEventListener('click', (e) => {
        if (royalNav && royalNav.classList.contains('menu-open')) {
            if (!royalNav.contains(e.target) && (!navToggle || !navToggle.contains(e.target))) {
                closeMobileMenu();
            }
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Reset menu state on desktop breakpoint resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMobileMenu();
        }
    });

    // Smooth anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu on click
            closeMobileMenu();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navOffset = window.innerWidth <= 900 ? 76 : 100;
                window.scrollTo({
                    top: Math.max(0, targetElement.offsetTop - navOffset),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Also close mobile menu if an outbound link is clicked
    if (navLinksContainer) {
        navLinksContainer.querySelectorAll('a:not([href^="#"])').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

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

    // ==========================================================================
    // About Section Waveform Text Animation (Static Text - Always Visible)
    // ==========================================================================
    const aboutSection = document.getElementById('about');
    const aboutWaveformEl = document.querySelector('.about-text-waveform');
    let aboutWaveTimeout = null;
    let isWaveAnimating = false;
    let isAboutInView = false;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const currentDir = currentScrollY > lastScrollY ? 'down' : 'up';
        const dirChanged = currentDir !== scrollDirection;
        scrollDirection = currentDir;
        lastScrollY = currentScrollY;

        // If user is currently looking at or scrolling through the About section
        if (isAboutInView && !document.body.classList.contains('entry-active')) {
            if (dirChanged && !isWaveAnimating) {
                triggerWaveAnimation(scrollDirection);
            }
        }
    }, { passive: true });

    function initAboutWaveformText() {
        if (!aboutWaveformEl) return;

        const rawText = aboutWaveformEl.textContent.trim();
        // Accessibility: preserve full text for screen readers
        aboutWaveformEl.setAttribute('aria-label', rawText);
        aboutWaveformEl.setAttribute('role', 'text');

        // Split into words so responsive line breaks are preserved
        const words = rawText.split(/\s+/);
        aboutWaveformEl.innerHTML = '';

        let charCounter = 0;
        const fragment = document.createDocumentFragment();

        words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'wave-word';

            for (let i = 0; i < word.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.className = 'wave-char';
                charSpan.textContent = word[i];
                charSpan.style.setProperty('--char-index', charCounter);
                charCounter++;
                wordSpan.appendChild(charSpan);
            }

            fragment.appendChild(wordSpan);

            // Standard space between words
            if (wordIdx < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'wave-space';
                spaceSpan.innerHTML = ' ';
                fragment.appendChild(spaceSpan);
            }
        });

        aboutWaveformEl.appendChild(fragment);
        aboutWaveformEl.style.setProperty('--total-chars', charCounter);
    }

    function triggerWaveAnimation(direction = 'down') {
        if (!aboutWaveformEl) return;
        if (isWaveAnimating) return; // Let current wave complete smoothly
        isWaveAnimating = true;

        if (aboutWaveTimeout) clearTimeout(aboutWaveTimeout);

        aboutWaveformEl.classList.remove('wave-anim-down', 'wave-anim-up');
        void aboutWaveformEl.offsetWidth; // Force reflow to re-trigger animation cleanly

        const animClass = direction === 'down' ? 'wave-anim-down' : 'wave-anim-up';
        aboutWaveformEl.classList.add(animClass);

        const totalChars = parseInt(aboutWaveformEl.style.getPropertyValue('--total-chars') || '180', 10);
        const animDuration = (totalChars * 9) + 750;

        aboutWaveTimeout = setTimeout(() => {
            aboutWaveformEl.classList.remove('wave-anim-down', 'wave-anim-up');
            isWaveAnimating = false;
        }, animDuration);
    }

    function resetAboutWaveform() {
        if (!aboutWaveformEl) return;
        if (aboutWaveTimeout) clearTimeout(aboutWaveTimeout);
        isWaveAnimating = false;
        aboutWaveformEl.classList.remove('wave-anim-down', 'wave-anim-up');
    }

    function checkAboutVisibilityOnEntry() {
        if (!aboutSection) return;
        const rect = aboutSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        if (inView) {
            triggerWaveAnimation('down');
        }
    }

    // Initialize character and word spans (text is completely visible at all times)
    initAboutWaveformText();

    // IntersectionObserver triggers the wave when scrolled into view (both scroll down and scroll up)
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (document.body.classList.contains('entry-active')) return;

                if (entry.isIntersecting) {
                    isAboutInView = true;
                    triggerWaveAnimation(scrollDirection);
                } else {
                    isAboutInView = false;
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px 0px 0px'
        });

        aboutObserver.observe(aboutSection);
    }
});
