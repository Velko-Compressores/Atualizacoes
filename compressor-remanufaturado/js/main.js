const DOMUtils = {
    getElement: (selector) => document.querySelector(selector),
    getElements: (selector) => document.querySelectorAll(selector),
    addClass: (element, className) => element?.classList.add(className),
    removeClass: (element, className) => element?.classList.remove(className),
    toggleClass: (element, className) => element?.classList.toggle(className)
};

function createLazyLoadObserver(selector, className = 'lazy-loaded') {
    const defaultOptions = {
        rootMargin: '100px',
        threshold: 0.1
    };

    const observerOptions = { ...defaultOptions };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                const container = img.closest('.product-image, .split-banner, .banner-full');

                if (dataSrc) {
                    if (container?.classList.contains('product-image')) {
                        container.classList.add('loading');
                    }

                    const tempImg = new Image();
                    tempImg.src = dataSrc;

                    tempImg.onload = () => {
                        setTimeout(() => {
                            img.src = dataSrc;
                            img.classList.add(className);
                            img.className = img.className.replace(/lazy-load[^\s]*/, '');
                            container?.classList.remove('loading');
                        }, 100);
                    };

                    tempImg.onerror = () => {
                        console.error('Erro ao carregar imagem:', dataSrc);
                        container?.classList.remove('loading');
                    };
                }

                obs.unobserve(img);
            }
        });
    }, observerOptions);

    DOMUtils.getElements(selector).forEach(img => observer.observe(img));
}

function createAnimationObserver(selector) {
    const defaultOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observerOptions = { ...defaultOptions };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    DOMUtils.getElements(selector).forEach(element => observer.observe(element));
}

function initMobileMenu() {
    const menuBtn = DOMUtils.getElement('#mobile-menu-btn');
    const menuOverlay = DOMUtils.getElement('#mobile-menu-overlay');
    const menuClose = DOMUtils.getElement('#mobile-menu-close');
    const menuLinks = DOMUtils.getElements('.mobile-nav a');

    if (!menuBtn || !menuOverlay) return;

    const toggleMenu = (open) => {
        menuOverlay.classList.toggle('active', open);
        menuBtn.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', () => {
        toggleMenu(!menuOverlay.classList.contains('active'));
    });

    menuClose?.addEventListener('click', () => toggleMenu(false));

    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) toggleMenu(false);
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOverlay.classList.contains('active')) {
            toggleMenu(false);
        }
    });
}

function initHeaderScroll() {
    const header = DOMUtils.getElement('#header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });
}

function initCarousel() {
    const carousel = DOMUtils.getElement('.hero-carousel');
    if (!carousel) return;

    const flkty = new Flickity(carousel, {
        cellAlign: 'center',
        contain: true,
        autoPlay: 4000,
        wrapAround: true,
        pauseAutoPlayOnHover: false,
        pageDots: true,
        prevNextButtons: true,
        draggable: true,
        friction: 0.8,
        selectedAttraction: 0.2,
        freeScroll: false,
        adaptiveHeight: false
    });

    function setupSlide(index) {
        const cells = DOMUtils.getElements('.carousel-cell');

        cells.forEach((cell, i) => {
            if (i !== index) return;

            const img = cell.querySelector('img');
            const overlay = cell.querySelector('.carousel-overlay');
            const animation = cell.querySelector('.person-animation');

            if (img) img.style.transform = 'scale(1.05)';
            if (overlay) overlay.style.opacity = '1';

            if (overlay) {
                const isMobile = window.innerWidth <= 768;
                Object.assign(overlay.style, {
                    transform: isMobile ? 'none' : 'translateY(-50%) translateX(0)',
                    left: isMobile ? 'auto' : '8%',
                    top: isMobile ? 'auto' : '50%',
                    bottom: 'auto',
                    position: isMobile ? 'relative' : 'absolute'
                });
            }

            if (animation) animation.style.opacity = '1';

        });
    }

    flkty.on('change', setupSlide);
    setupSlide(0);
}

function initProductCards() {
    const productCards = DOMUtils.getElements('.product-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function initBannerAnimation() {
    const bannerImg = DOMUtils.getElement('.lazy-load-banner');
    const bannerContent = DOMUtils.getElement('.banner-content');

    if (!bannerImg) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');

                if (dataSrc) {
                    const tempImg = new Image();
                    tempImg.src = dataSrc;

                    tempImg.onload = () => {
                        img.src = dataSrc;
                        img.classList.add('lazy-loaded');
                        img.classList.remove('lazy-load-banner');

                        setTimeout(() => {
                            bannerContent?.classList.add('animate');
                        }, 300);
                    };

                    tempImg.onerror = () => {
                        console.error('Erro ao carregar banner:', dataSrc);
                        bannerContent?.classList.add('animate');
                    };
                }

                obs.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px',
        threshold: 0.1
    });

    observer.observe(bannerImg);
}

function initSplitBannersParallax() {
    const splitBannersWrapper = DOMUtils.getElement('.split-banners-wrapper');
    const splitBanners = DOMUtils.getElements('.split-banner');

    if (!splitBannersWrapper) return;

    let ticking = false;

    function updateParallax() {
        const rect = splitBannersWrapper.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

        if (scrollPercent >= 0 && scrollPercent <= 1) {
            splitBanners.forEach((banner, index) => {
                const img = banner.querySelector('.split-banner-img');
                if (img?.classList.contains('lazy-loaded')) {
                    const speed = index % 2 === 0 ? 0.05 : -0.05;
                    const yPos = scrollPercent * 100 * speed;
                    img.style.transform = `translateY(${yPos}px)`;
                }
            });
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

function initScrollToTop() {
    const scrollTopBtn = DOMUtils.getElement('#scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.pageYOffset > 500);
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {

    initMobileMenu();

    initHeaderScroll();

    initCarousel();

    createLazyLoadObserver('.lazy-load');
    createLazyLoadObserver('.lazy-load-product');
    createLazyLoadObserver('.lazy-load-split');

    createAnimationObserver('[data-animate], .collection-header-text, .collection-image, .collection-text');
    createAnimationObserver('.split-banner');

    initProductCards();

    initBannerAnimation();

    initSplitBannersParallax();

    initScrollToTop();
});