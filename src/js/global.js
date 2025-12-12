function createSectionSwiper(rootEl, {
    containerSelector,
    nextSelector,
    prevSelector,
    paginationSelector,
    options = {}
} = {}) {
    if (!window.Swiper) {
        console.warn('Swiper is not loaded');
        return null;
    }

    const container = rootEl.querySelector(containerSelector);
    if (!container) {
        console.warn('Swiper container not found:', containerSelector);
        return null;
    }

    const nextEl = nextSelector ? rootEl.querySelector(nextSelector) : null;
    const prevEl = prevSelector ? rootEl.querySelector(prevSelector) : null;
    const paginationEl = paginationSelector ? rootEl.querySelector(paginationSelector) : null;

    const baseConfig = {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: false,
        breakpoints: {
            0: { slidesPerView: 1.2, spaceBetween: 10 },
            450: { slidesPerView: 1.3, spaceBetween: 10 },
            568: { slidesPerView: 2, spaceBetween: 15 },
            700: { slidesPerView: 2.2, spaceBetween: 15 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            870: { slidesPerView: 3, spaceBetween: 20 },
            1000: { slidesPerView: 4, spaceBetween: 24 },
        },
    };

    if (nextEl && prevEl) {
        baseConfig.navigation = {
            nextEl,
            prevEl,
        };
    }

    if (paginationEl) {
        baseConfig.pagination = {
            el: paginationEl,
            clickable: true,
        };
    }

    const {
        breakpoints: userBreakpoints,
        pagination: _userPagination,
        navigation: _userNavigation,
        mergeBreakpoints,
        ...restOptions
    } = options || {};

    const shouldMergeBreakpoints = mergeBreakpoints !== false;

    const finalConfig = {
        ...baseConfig,
        ...restOptions,
    };

    if (userBreakpoints) {
        finalConfig.breakpoints = shouldMergeBreakpoints
            ? { ...baseConfig.breakpoints, ...userBreakpoints }
            : userBreakpoints;
    } else if (!shouldMergeBreakpoints) {
        delete finalConfig.breakpoints;
    }

    return new Swiper(container, finalConfig);
}

class ColorSelector {
    constructor(root) {
        this.root = root;
        this.sectionRoot = this.root.closest('[data-section-id]');
        this.sectionId = this.sectionRoot ? this.sectionRoot.dataset.sectionId : null;

        if (!this.sectionId) return;

        this.handleClick = this.handleClick.bind(this);
        this.root.addEventListener('click', this.handleClick);
    }

    handleClick(event) {
        const btn = event.target.closest('[data-product-handle]');
        if (!btn) return;

        event.preventDefault();

        const handle = btn.dataset.productHandle;
        if (!handle) return;

        const requestUrl = `/products/${handle}?section_id=${this.sectionId}`;

        history.pushState({}, '', `/products/${handle}`);

        fetch(requestUrl)
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const newSection = doc.querySelector(`[data-section-id="${this.sectionId}"]`);
                const currentSection = this.sectionRoot;

                if (!newSection || !currentSection) return;

                currentSection.innerHTML = newSection.innerHTML;

                const breadcrumbSectionId = "breadcrumbs";

                const newBreadcrumbs = doc.querySelector(`[data-section-id="${breadcrumbSectionId}"]`);
                const currentBreadcrumbs = document.querySelector(`[data-section-id="${breadcrumbSectionId}"]`);

                if (newBreadcrumbs && currentBreadcrumbs) {
                    currentBreadcrumbs.innerHTML = newBreadcrumbs.innerHTML;
                }

                document.querySelectorAll('form#ProductForm').forEach(form => {
                    new ProductForm(form);
                });

                document.querySelectorAll('[data-color-selector]').forEach(el => {
                    new ColorSelector(el);
                });

                document.querySelectorAll('[data-gallery]').forEach(el => {
                    new ProductGallery(el);
                });
            })
            .catch(() => { });
    }
}

class ProductForm {
    constructor(form) {
        this.form = form;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.form.addEventListener('submit', this.handleSubmit);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.form);

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

        } catch (error) {
            console.error('Cart error:', error);
        }
    }
}

class ProductGallery {
    constructor(element) {
        this.root = element;
        this.bigImage = this.root.querySelector('[data-big]');
        this.thumbs = Array.from(this.root.querySelectorAll('.thumb'));

        this.initEvents();
    }

    initEvents() {
        if (!this.thumbs.length) return;

        this.thumbs.forEach((thumb) => {
            thumb.addEventListener('click', () => {
                const url = thumb.dataset.large;
                if (!url) return;

                this.updateBigImage(url);
                this.updateActive(thumb);
            });
        });
    }

    updateBigImage(url) {
        if (!this.bigImage) return;

        if (this.bigImage.tagName === 'IMG') {
            this.bigImage.src = url;
            this.bigImage.srcset = url;
        } else {
            const img = this.bigImage.querySelector('img');
            if (img) {
                img.src = url;
                img.srcset = url;
            }
        }
    }

    updateActive(selectedThumb) {
        this.thumbs.forEach((thumb) => {
            const overlay = thumb.querySelector('[data-active]');
            if (overlay) overlay.dataset.active = 'false';
        });

        const selectedOverlay = selectedThumb.querySelector('[data-active]');
        if (selectedOverlay) selectedOverlay.dataset.active = 'true';
    }
}

class ProductAccordion {
    constructor(root) {
        this.root = root;
        this.items = Array.from(root.querySelectorAll('[data-item]'));

        this.init();
    }

    init() {
        this.items.forEach(item => {
            const btn = item.querySelector('[data-button]');
            const content = item.querySelector('[data-content]');
            if (!btn || !content) return;

            btn.addEventListener('click', () => {
                const isOpen = content.dataset.active === "true";


                // Закриваємо всі
                this.items.forEach(i => {
                    const c = i.querySelector('[data-content]');
                    if (c) c.dataset.active = "false";

                    const icon = i.querySelector('[data-icon]');
                    if (icon) icon.dataset.active = "false";
                });

                // Якщо елемент був закритий — відкриваємо
                if (!isOpen) {
                    content.dataset.active = "true";
                    item.querySelector('[data-icon]').dataset.active = "true";
                }
            });
        });
    }
}

class ProductRecommendationsSection {
    constructor(sectionEl) {
        this.sectionEl = sectionEl;
        this.productId = sectionEl.dataset.productId;
        this.sectionId = sectionEl.dataset.sectionId;

        if (!this.productId || !this.sectionId) return;

        this.fetchRecommendations();
    }

    async fetchRecommendations() {
        const url = `/recommendations/products?section_id=${this.sectionId}&product_id=${this.productId}`;

        try {
            const response = await fetch(url);
            if (!response.ok) return;

            const html = await response.text();

            // Парсим HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newSection = doc.querySelector('[data-section="product-recommendations"]');

            // Нічого не повернулося – ховаємо секцію
            if (!newSection) {
                this.sectionEl.style.display = 'none';
                return;
            }

            // Замінюємо вміст поточної секції на новий
            this.sectionEl.innerHTML = newSection.innerHTML;

            // Ініціалізуємо Swiper
            this.swiper = createSectionSwiper(this.sectionEl, {
                containerSelector: '.js-product-recommendations-swiper',
                nextSelector: '.swiper-button-next',
                prevSelector: '.swiper-button-prev',
            });

        } catch (error) {
            console.error('Failed to load product recommendations', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form#ProductForm').forEach(f => new ProductForm(f));
    document.querySelectorAll('[data-color-selector]').forEach(r => new ColorSelector(r));
    document.querySelectorAll('[data-gallery]').forEach((g) => new ProductGallery(g));
    document.querySelectorAll('[data-faq]').forEach(el => new ProductAccordion(el));
    document.querySelectorAll('[data-section="product-recommendations"]').forEach(el => new ProductRecommendationsSection(el));
});
