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

    // Products Slider/Carousel (Page-based, hardware accelerated)
    const prodTrack = document.querySelector('.products-slider-track');
    const prodOuter = document.querySelector('.products-slider-outer');
    const prodWrapper = document.querySelector('.products-slider-wrapper');
    const prodPagination = document.querySelector('.products-pagination');

    if (prodTrack && prodOuter && prodWrapper && prodPagination) {
        const prevBtn = document.querySelector('.slider-controls-wrapper .slider-arrow.prev');
        const nextBtn = document.querySelector('.slider-controls-wrapper .slider-arrow.next');
        const pages = Array.from(prodTrack.querySelectorAll('.slider-page'));

        let currentPage = 0;
        const totalPages = pages.length;

        // Generate pagination dots
        const generateDots = () => {
            prodPagination.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('page-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    scrollToPage(i);
                });
                prodPagination.appendChild(dot);
            }
        };

        const updateUI = () => {
            // Update active dots
            const dots = prodPagination.querySelectorAll('.page-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPage);
            });

            // Update arrow state
            if (prevBtn) prevBtn.disabled = currentPage === 0;
            if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
        };

        const scrollToPage = (pageIndex) => {
            currentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
            prodTrack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            prodTrack.style.transform = `translate3d(${-currentPage * 100}%, 0, 0)`;
            updateUI();
        };

        // Arrow click listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 0) scrollToPage(currentPage - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages - 1) scrollToPage(currentPage + 1);
            });
        }

        // Touch & Mouse Drag Swipe functionality
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isVerticalScroll = false;
        let isFirstMove = false;

        const getClientX = (e) => {
            return e.touches ? e.touches[0].clientX : e.clientX;
        };

        const getClientY = (e) => {
            return e.touches ? e.touches[0].clientY : e.clientY;
        };

        const dragStart = (e) => {
            isDragging = true;
            isVerticalScroll = false;
            isFirstMove = true;
            startX = getClientX(e);
            startY = getClientY(e);
            currentX = startX;
            currentY = startY;
            prodTrack.style.transition = 'none';
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            currentX = getClientX(e);
            currentY = getClientY(e);
            
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            if (isFirstMove) {
                isFirstMove = false;
                // If vertical movement is greater, treat it as vertical scroll
                if (Math.abs(diffY) > Math.abs(diffX)) {
                    isVerticalScroll = true;
                    isDragging = false;
                    prodTrack.style.transition = '';
                    prodTrack.style.transform = `translate3d(${-currentPage * 100}%, 0, 0)`;
                    return;
                }
            }

            if (isVerticalScroll) return;

            // Prevent browser scroll when dragging horizontally
            if (e.cancelable) e.preventDefault();

            const trackWidth = prodTrack.clientWidth;
            let translation = -currentPage * trackWidth + diffX;

            // Rubber-band effect on boundaries
            if (currentPage === 0 && diffX > 0) {
                translation = diffX * 0.3;
            } else if (currentPage === totalPages - 1 && diffX < 0) {
                translation = -currentPage * trackWidth + diffX * 0.3;
            }

            prodTrack.style.transform = `translate3d(${translation}px, 0, 0)`;
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            prodTrack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            const diffX = currentX - startX;
            const threshold = prodTrack.clientWidth * 0.2; // 20% of width to change page

            if (diffX < -threshold && currentPage < totalPages - 1) {
                currentPage++;
            } else if (diffX > threshold && currentPage > 0) {
                currentPage--;
            }

            scrollToPage(currentPage);
        };

        // Event listeners for Touch
        prodTrack.addEventListener('touchstart', dragStart, { passive: true });
        prodTrack.addEventListener('touchmove', dragMove, { passive: false });
        prodTrack.addEventListener('touchend', dragEnd);
        prodTrack.addEventListener('touchcancel', dragEnd);

        // Event listeners for Mouse Drag
        prodTrack.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);

        // Initialize UI
        generateDots();
        scrollToPage(0);

        // Resize behavior
        window.addEventListener('resize', () => {
            // Re-align slider to current page index instantly
            prodTrack.style.transition = 'none';
            prodTrack.style.transform = `translate3d(${-currentPage * 100}%, 0, 0)`;
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
