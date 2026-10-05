
// Preloader
window.addEventListener('load', () => {
    // Small delay to ensure the animation is visible
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {

    // Entry Portal Logic
    const btnProfessional = document.getElementById('btn-professional');
    if (btnProfessional) {
        btnProfessional.addEventListener('click', () => {
            document.body.classList.remove('entry-active');
        });
    }

    // Header Scroll Effect & ScrollSpy
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    // Sticky Header (Lightweight check)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // ScrollSpy using IntersectionObserver (Performance Optimized)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    /* Mobile Menu Toggle - Disabled in favor of tools-popup.js full screen menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            // Toggle icon from bars to times
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    */

    /* Close menu when clicking a link - Disabled 
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    */




    // Smooth Scroll for anchor links (polyfill for older browsers if needed, spread mostly supported)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lenis Removed - Using Native Scroll for better mobile performance


    // Carousel Logic
    const skillsGrid = document.querySelector('.skills-grid');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');

    if (skillsGrid && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            skillsGrid.scrollBy({ left: -320, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            skillsGrid.scrollBy({ left: 320, behavior: 'smooth' });
        });

        // Optional: Highlight active card
        const checkActiveCard = () => {
            const center = skillsGrid.scrollLeft + (skillsGrid.offsetWidth / 2);
            const cards = document.querySelectorAll('.skill-card');

            cards.forEach(card => {
                const wrapper = card.closest('.skill-card-wrapper');
                const cardCenter = wrapper.offsetLeft + (wrapper.offsetWidth / 2);

                // Simple check if card center is within view center range
                if (Math.abs(center - cardCenter) < wrapper.offsetWidth / 2) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        };

        skillsGrid.addEventListener('scroll', checkActiveCard, { passive: true });
        // Initial check
        checkActiveCard();
    }

});
