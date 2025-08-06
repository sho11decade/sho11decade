// Modern Portfolio Site - Performance Optimized
// Service Worker Registration and Navigation functionality

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                
                // Update available
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, refresh to update
                            if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Navigation functionality with mobile menu support

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        body.classList.add('nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'メニューを閉じる');
        
        // Focus trap for accessibility
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'メニューを開く');
    }

    // Close menu when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            closeMenu();
            
            // Smooth scroll to section
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            navToggle.focus();
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up', 'scroll-down');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scrolling down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scrolling up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveLink, 100));
    
    // Initial call
    updateActiveLink();
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-grid, .works-grid, .contact-wrapper, .work-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Go to top button functionality
function initGoToTop() {
    const goToTopBtn = document.getElementById('goToTop');
    
    if (goToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                goToTopBtn.classList.add('visible');
            } else {
                goToTopBtn.classList.remove('visible');
            }
        });

        goToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling for all anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Touch gesture support for mobile menu
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50;
    
    // Close menu on upward swipe when menu is open
    if (swipeDistance > minSwipeDistance && navMenu.classList.contains('active')) {
        const navToggle = document.querySelector('.mobile-menu-toggle');
        if (navToggle) {
            navToggle.click();
        }
    }
}

// Particle System for Hero Background
function initParticleSystem() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'pg-canvas';
    canvas.style.display = 'block';
    particlesContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Particle settings - Space themed
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    
    const settings = {
        density: isMobile ? 30000 : isTablet ? 25000 : 20000,
        dotColor: 'rgba(255, 255, 255, 0.8)',
        lineColor: 'rgba(108, 92, 231, 0.3)',
        starColor: 'rgba(255, 255, 255, 0.9)',
        particleRadius: isMobile ? 1.5 : 2,
        lineWidth: 0.8,
        proximity: isMobile ? 100 : 140,
        parallax: !isMobile,
        parallaxMultiplier: 4,
        minSpeedX: 0.05,
        maxSpeedX: isMobile ? 0.2 : 0.3,
        minSpeedY: 0.05,
        maxSpeedY: isMobile ? 0.2 : 0.3,
        twinkleSpeed: 0.02
    };
    
    let mouseX = 0;
    let mouseY = 0;
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    
    // Particle class - Space themed
    function Particle() {
        this.stackPos = 0;
        this.active = true;
        this.layer = Math.ceil(Math.random() * 3);
        this.parallaxOffsetX = 0;
        this.parallaxOffsetY = 0;
        this.twinkle = Math.random() * Math.PI * 2;
        this.isStar = Math.random() < 0.3; // 30% chance to be a twinkling star
        
        this.position = {
            x: Math.ceil(Math.random() * canvas.width),
            y: Math.ceil(Math.random() * canvas.height)
        };
        
        this.speed = {
            x: ((-settings.maxSpeedX / 2) + (Math.random() * settings.maxSpeedX)),
            y: ((-settings.maxSpeedY / 2) + (Math.random() * settings.maxSpeedY))
        };
        
        this.speed.x += this.speed.x > 0 ? settings.minSpeedX : -settings.minSpeedX;
        this.speed.y += this.speed.y > 0 ? settings.minSpeedY : -settings.minSpeedY;
    }
    
    Particle.prototype.draw = function() {
        // Update twinkle effect
        this.twinkle += settings.twinkleSpeed;
        
        // Draw particle with twinkling effect for stars
        ctx.beginPath();
        if (this.isStar) {
            const twinkleAlpha = (Math.sin(this.twinkle) + 1) * 0.5;
            const starSize = settings.particleRadius * (0.5 + twinkleAlpha * 0.5);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + twinkleAlpha * 0.4})`;
            
            // Draw cross-shaped star
            const x = this.position.x + this.parallaxOffsetX;
            const y = this.position.y + this.parallaxOffsetY;
            
            ctx.fillRect(x - starSize, y - starSize/4, starSize * 2, starSize/2);
            ctx.fillRect(x - starSize/4, y - starSize, starSize/2, starSize * 2);
        } else {
            ctx.fillStyle = settings.dotColor;
            ctx.arc(
                this.position.x + this.parallaxOffsetX, 
                this.position.y + this.parallaxOffsetY, 
                settings.particleRadius / 2, 
                0, 
                Math.PI * 2, 
                true
            );
        }
        ctx.fill();
        ctx.closePath();
        
        // Draw constellation-like lines to nearby particles
        ctx.strokeStyle = settings.lineColor;
        ctx.beginPath();
        for (let i = particles.length - 1; i > this.stackPos; i--) {
            const p2 = particles[i];
            const a = this.position.x - p2.position.x;
            const b = this.position.y - p2.position.y;
            const dist = Math.sqrt((a * a) + (b * b));
            
            if (dist < settings.proximity) {
                const opacity = 1 - (dist / settings.proximity);
                ctx.globalAlpha = opacity * 0.5;
                ctx.moveTo(this.position.x + this.parallaxOffsetX, this.position.y + this.parallaxOffsetY);
                ctx.lineTo(p2.position.x + p2.parallaxOffsetX, p2.position.y + p2.parallaxOffsetY);
            }
        }
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1; // Reset alpha
    };
    
    Particle.prototype.updatePosition = function() {
        if (settings.parallax) {
            const parallaxTargX = (mouseX - (winW / 2)) / (settings.parallaxMultiplier * this.layer);
            this.parallaxOffsetX += (parallaxTargX - this.parallaxOffsetX) / 10;
            const parallaxTargY = (mouseY - (winH / 2)) / (settings.parallaxMultiplier * this.layer);
            this.parallaxOffsetY += (parallaxTargY - this.parallaxOffsetY) / 10;
        }
        
        const elWidth = particlesContainer.offsetWidth;
        const elHeight = particlesContainer.offsetHeight;
        
        // Bounce off edges
        if (this.position.x + this.speed.x + this.parallaxOffsetX > elWidth || 
            this.position.x + this.speed.x + this.parallaxOffsetX < 0) {
            this.speed.x = -this.speed.x;
        }
        
        if (this.position.y + this.speed.y + this.parallaxOffsetY > elHeight || 
            this.position.y + this.speed.y + this.parallaxOffsetY < 0) {
            this.speed.y = -this.speed.y;
        }
        
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    };
    
    function styleCanvas() {
        canvas.width = particlesContainer.offsetWidth;
        canvas.height = particlesContainer.offsetHeight;
        ctx.fillStyle = settings.dotColor;
        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = settings.lineWidth;
        ctx.globalAlpha = 0.8;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(108, 92, 231, 0.3)';
    }
    
    function draw() {
        winW = window.innerWidth;
        winH = window.innerHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].updatePosition();
            particles[i].draw();
        }
        
        animationId = requestAnimationFrame(draw);
    }
    
    function resizeHandler() {
        styleCanvas();
        
        const elWidth = particlesContainer.offsetWidth;
        const elHeight = particlesContainer.offsetHeight;
        
        // Remove particles outside canvas
        particles = particles.filter(p => 
            p.position.x <= elWidth && p.position.y <= elHeight
        );
        
        // Adjust particle count
        const numParticles = Math.round((canvas.width * canvas.height) / settings.density);
        
        while (particles.length < numParticles) {
            particles.push(new Particle());
        }
        
        if (particles.length > numParticles) {
            particles.splice(numParticles);
        }
        
        // Re-index particles
        particles.forEach((p, i) => p.stackPos = i);
    }
    
    function init() {
        styleCanvas();
        
        // Create initial particles
        const numParticles = Math.round((canvas.width * canvas.height) / settings.density);
        for (let i = 0; i < numParticles; i++) {
            const p = new Particle();
            p.stackPos = i;
            particles.push(p);
        }
        
        // Event listeners
        window.addEventListener('resize', resizeHandler, false);
        document.addEventListener('mousemove', function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        }, false);
        
        draw();
    }
    
    init();
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Measure Core Web Vitals
    if ('web-vital' in window) {
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({onCLS, onFID, onFCP, onLCP, onTTFB}) => {
            onCLS(console.log);
            onFID(console.log);
            onFCP(console.log);
            onLCP(console.log);
            onTTFB(console.log);
        });
    }

    // Log performance metrics
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Performance Metrics:', {
                'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                'Page Load Time': perfData.loadEventEnd - perfData.fetchStart,
                'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                'TCP Connection': perfData.connectEnd - perfData.connectStart,
                'First Byte': perfData.responseStart - perfData.requestStart
            });
        }, 0);
    });
}

// Resource hints for better performance
function addResourceHints() {
    const head = document.head;
    
    // Preconnect to external domains
    const preconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.googletagmanager.com'
    ];
    
    preconnects.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            if (url.includes('gstatic')) {
                link.crossOrigin = '';
            }
            head.appendChild(link);
        }
    });
}

// Initialize particle system after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initGoToTop();
    initParticleSystem();
    initPerformanceMonitoring();
    addResourceHints();
});
