/**
 * Floricultura Recife - Luxury Aesthetic
 * Scroll Animations using Intersection Observer
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Select all elements that should be animated
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-in');
    
    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // use the viewport as root
        rootMargin: '0px 0px -50px 0px', // trigger slightly before the element comes into view
        threshold: 0.1 // trigger when 10% of the element is visible
    };
    
    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'in-view' class to trigger the CSS animation
                entry.target.classList.add('in-view');
                
                // Optional: Stop observing once the animation has been triggered
                // to prevent it from animating again when scrolling back up
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Auto-scroll for the Google reviews slider
    const slider = document.querySelector('.reviews-slider');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Drag to scroll functionality
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; // scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;
        });

        // Auto scroll interval setup
        let autoScrollInterval;
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
                if (slider.scrollLeft >= maxScrollLeft - 5) {
                    // Loop back to start smoothly
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll by the width of one review card (350px) + the gap (24px)
                    const card = slider.querySelector('.google-review-card');
                    const cardWidth = card ? card.offsetWidth : 350;
                    slider.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
                }
            }, 4000);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        startAutoScroll();

        // Pause auto scroll on user interactions
        slider.addEventListener('touchstart', stopAutoScroll, { passive: true });
        slider.addEventListener('mousedown', stopAutoScroll);

        // Resume auto scroll after interactions end
        slider.addEventListener('touchend', () => {
            setTimeout(startAutoScroll, 2000);
        }, { passive: true });

        slider.addEventListener('mouseup', () => {
            setTimeout(startAutoScroll, 2000);
        });
    }

    // Mobile Nav Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});
