document.addEventListener('DOMContentLoaded', () => {
    // Intro Page Logic
    const introPage = document.getElementById('intro-page');
    const greetingText = document.getElementById('greeting-text');
    const body = document.body;
    
    // Check if intro has already played in this session
    const introPlayed = sessionStorage.getItem('introPlayed');

    const greetings = [
        "Hello",      // English
        "नमस्ते",     // Hindi
        "Hola",       // Spanish
        "Bonjour",    // French
        "Ciao",       // Italian
        "こんにちは",  // Japanese
        "안녕하세요",   // Korean
        "Привет",     // Russian
        "Hallå",      // Swedish
        "Hello"       // English (back to start)
    ];

    let currentGreetingIndex = 0;

    function updateGreeting() {
        if (!greetingText) {
            finishIntro();
            return;
        }
        if (currentGreetingIndex < greetings.length) {
            greetingText.innerText = greetings[currentGreetingIndex];
            greetingText.classList.remove('exit');
            greetingText.classList.add('active');

            setTimeout(() => {
                if (currentGreetingIndex < greetings.length - 1) {
                    greetingText.classList.remove('active');
                    greetingText.classList.add('exit');
                    setTimeout(() => {
                        currentGreetingIndex++;
                        updateGreeting();
                    }, 500); 
                } else {
                    setTimeout(() => {
                        finishIntro();
                    }, 1000);
                }
            }, 300); 
        }
    }

    function finishIntro() {
        if (introPage) {
            introPage.classList.add('fade-out');
            body.classList.add('loaded');
            sessionStorage.setItem('introPlayed', 'true'); // Remember that intro was played
            
            setTimeout(() => {
                introPage.style.display = 'none';
                body.style.overflow = 'auto';
            }, 1200);
        }
    }

    // Skip intro if already played or if it doesn't exist (sub-pages)
    if (introPage && !introPlayed) {
        body.style.overflow = 'hidden';
        setTimeout(() => {
            updateGreeting();
        }, 500);
    } else {
        if (introPage) {
            introPage.style.display = 'none';
        }
        body.style.overflow = 'auto';
        body.classList.add('loaded');
    }

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // Smooth scroll for internal navigation links only
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Satellite Background Logic
    const bgContainer = document.getElementById('satellite-bg');
    
    if (bgContainer) {
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1 + 'px';
            star.style.width = size;
            star.style.height = size;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
            star.style.animationDelay = Math.random() * 5 + 's';
            bgContainer.appendChild(star);
        }

        for (let i = 1; i <= 3; i++) {
            const orbit = document.createElement('div');
            orbit.className = `orbit orbit-${i}`;
            bgContainer.appendChild(orbit);
        }

        const satelliteContainer = document.createElement('div');
        satelliteContainer.className = 'satellite-container';
        const satellite = document.createElement('div');
        satellite.className = 'satellite';
        satelliteContainer.appendChild(satellite);
        bgContainer.appendChild(satelliteContainer);

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const stars = bgContainer.querySelectorAll('.star');
            stars.forEach(star => {
                const speed = parseFloat(star.style.width) / 2;
                star.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });

            const orbits = bgContainer.querySelectorAll('.orbit');
            orbits.forEach((orbit, index) => {
                const speed = (index + 1) * 2;
                orbit.style.transform = `translate(calc(-50% + ${x / speed}px), calc(-50% + ${y / speed}px))`;
            });
        });
    }

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const projectImages = document.querySelectorAll('.project-gallery img');
    const closeBtn = document.querySelector('.close-lightbox');

    if (lightbox && lightboxImg) {
        projectImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
                body.style.overflow = 'hidden'; 
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Show loading state
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            // Simulate form submission delay
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // You could add actual email service integration here (e.g., EmailJS or Formspree)
                console.log('Form Submitted successfully');
            }, 1500);
        });
    }

    console.log('%c Portfolio by Ankitha Acharya | Satellite Theme Active ', 'background: #00d2ff; color: #000; font-weight: bold; border-radius: 5px; padding: 5px;');

});