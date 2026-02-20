/*
   Arabian International – Main Script
   Features:
    - Sticky navbar
    - Mobile menu
    - Language toggle
    - Scroll reveal (IntersectionObserver)
    - Fleet: carousel + grid view toggle + category filter
    - Language-aware fleet cards (all text from langData)
    - Centred modal with language-aware text
*/

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Sticky Navbar ──────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── 2. Mobile Menu ────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    mobileMenuBtn?.addEventListener('click', () => mobileNav.classList.add('active'));
    closeMenuBtn?.addEventListener('click', () => mobileNav.classList.remove('active'));
    document.querySelectorAll('.mobile-link').forEach(link =>
        link.addEventListener('click', () => mobileNav.classList.remove('active'))
    );

    // ── 3. Language Toggle ────────────────────────────
    document.getElementById('langToggle')?.addEventListener('click', () => {
        window.toggleLanguage();
    });

    // ── 4. Scroll Reveal ─────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    const revealIO = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            if (entry.target.classList.contains('stagger')) {
                entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
                    child.style.transitionDelay = `${i * 0.1}s`;
                });
            }
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealIO.observe(el));

    // ── 5. Fleet Filter ───────────────────────────────
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const filter = e.currentTarget.dataset.filter;
            window._activeFilter = filter;
            renderBothViews(filter);
        });
    });

    // ── 6. View Toggle (Carousel ↔ Grid) ─────────────
    const carouselWrap = document.getElementById('carouselWrap');
    const fleetGrid = document.getElementById('fleetGrid');
    const btnCarousel = document.getElementById('viewCarousel');
    const btnGrid = document.getElementById('viewGrid');

    btnCarousel?.addEventListener('click', () => {
        btnCarousel.classList.add('active');
        btnGrid.classList.remove('active');
        carouselWrap.style.display = '';
        fleetGrid.style.display = 'none';
        resetCarousel();
    });

    btnGrid?.addEventListener('click', () => {
        btnGrid.classList.add('active');
        btnCarousel.classList.remove('active');
        carouselWrap.style.display = 'none';
        fleetGrid.style.display = '';
    });

    // ── 7. Carousel Controls ──────────────────────────
    document.getElementById('carouselPrev')?.addEventListener('click', () => stepCarousel(-1));
    document.getElementById('carouselNext')?.addEventListener('click', () => stepCarousel(+1));

    // Touch/drag support
    setupCarouselDrag();

    // ── 8. Modal Close Logic ──────────────────────────
    const modal = document.getElementById('fleetModal');
    const modalClose = document.getElementById('modalClose');

    modalClose?.addEventListener('click', () => modal.classList.remove('active'));
    modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal?.classList.remove('active'); });
});

// ──────────────────────────────────────────────────────
// FLEET STATE
// ──────────────────────────────────────────────────────
let _carouselIndex = 0;
let _carouselVisible = 3; // cards visible at once (updated on render)
let _carouselTotal = 0;
window._activeFilter = 'all';

// Called by lang.js after language switch too
window.renderFleetCards = function (filter) {
    filter = filter || window._activeFilter || 'all';
    window._activeFilter = filter;

    // If the carousel DOM isn't ready yet (lang.js fires before DOMContentLoaded),
    // defer until DOMContentLoaded fires.
    if (!document.getElementById('fleetCarousel')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => renderBothViews(filter), { once: true });
        }
        return;
    }
    renderBothViews(filter);
};

function getFilteredData(filter) {
    if (typeof window.fleetData === 'undefined') return [];
    return filter === 'all'
        ? window.fleetData
        : window.fleetData.filter(car => car.category === filter);
}

function renderBothViews(filter) {
    const data = getFilteredData(filter);
    renderCarousel(data);
    renderGrid(data);
    _carouselIndex = 0;
    updateCarouselPosition(true);
    updateDots();

    // Update filter button text based on language
    updateFilterLabels();
}

// ──────────────────────────────────────────────────────
// CARD BUILDER – language-aware
// ──────────────────────────────────────────────────────
function buildCard(car) {
    const lang = window.currentLang || 'ar';
    const ld = window.langData;
    const name = lang === 'ar' ? car.nameAr : car.nameEn;
    const catKey = window.getCategoryTranslateKey(car.category);
    const catName = (ld[lang] && ld[lang][catKey]) || (ld['ar'] && ld['ar'][catKey]) || car.category;

    const detailsLabel = lang === 'ar' ? 'عرض التفاصيل' : 'View Details';
    const vipLabel = 'VIP';
    const premLabel = lang === 'ar' ? 'مميز' : 'Premium';
    const licLabel = lang === 'ar' ? 'مرخص' : 'Licensed';

    const card = document.createElement('div');
    card.className = 'showroom-card';
    card.innerHTML = `
        <div class="fleet-img" style="background-image:url('${car.image}')">
            <span class="fleet-cat-badge">${catName}</span>
            <div class="showroom-overlay">
                <button class="view-btn">
                    <i class="fas fa-search-plus"></i>
                    ${detailsLabel}
                </button>
            </div>
        </div>
        <div class="showroom-info">
            <h3 class="fleet-name">${name}</h3>
            <div class="showroom-specs">
                <span><i class="fas fa-star"></i> ${vipLabel}</span>
                <span><i class="fas fa-shield-alt"></i> ${premLabel}</span>
                <span><i class="fas fa-check-circle"></i> ${licLabel}</span>
            </div>
        </div>
    `;

    card.querySelector('.view-btn').addEventListener('click', e => {
        e.stopPropagation();
        openModal(car);
    });
    card.addEventListener('click', () => openModal(car));
    return card;
}

// ──────────────────────────────────────────────────────
// CAROUSEL
// ──────────────────────────────────────────────────────
function renderCarousel(data) {
    const track = document.getElementById('fleetCarousel');
    if (!track) return;
    track.innerHTML = '';

    if (data.length === 0) {
        track.innerHTML = `<p style="text-align:center;color:var(--clr-muted);padding:40px;">${window.currentLang === 'ar' ? 'لا توجد سيارات' : 'No vehicles found'}</p>`;
        return;
    }

    data.forEach(car => track.appendChild(buildCard(car)));
    _carouselTotal = data.length;
    _carouselIndex = 0;
    updateCarouselVisible();
    buildDots();
    updateCarouselPosition(true);
    updateDots();
}

function updateCarouselVisible() {
    _carouselVisible = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
}

function resetCarousel() {
    _carouselIndex = 0;
    updateCarouselVisible();
    updateCarouselPosition(true);
    updateDots();
}

function stepCarousel(dir) {
    updateCarouselVisible();
    const maxIndex = Math.max(0, _carouselTotal - _carouselVisible);
    _carouselIndex = Math.min(Math.max(_carouselIndex + dir, 0), maxIndex);
    updateCarouselPosition();
    updateDots();
}

function updateCarouselPosition(instant = false) {
    const track = document.getElementById('fleetCarousel');
    if (!track) return;
    const cards = track.querySelectorAll('.showroom-card');
    if (!cards.length) return;

    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const card = cards[0];
    const gap = 24;
    const cardW = card.offsetWidth + gap;
    const offset = _carouselIndex * cardW;

    track.style.transition = instant ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    track.style.transform = isRtl ? `translateX(${offset}px)` : `translateX(-${offset}px)`;
}

window.addEventListener('resize', () => {
    updateCarouselVisible();
    updateCarouselPosition(true);
    updateDots();
}, { passive: true });

// Dots
function buildDots() {
    const container = document.getElementById('carouselDots');
    if (!container) return;
    container.innerHTML = '';
    updateCarouselVisible();
    const count = Math.max(1, _carouselTotal - _carouselVisible + 1);
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            _carouselIndex = i;
            updateCarouselPosition();
            updateDots();
        });
        container.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === _carouselIndex));
}

// Touch/Drag
function setupCarouselDrag() {
    const track = document.getElementById('fleetCarousel');
    if (!track) return;
    let startX = 0, isDragging = false;

    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
    track.addEventListener('mousemove', e => { if (isDragging) e.preventDefault(); });
    track.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        const diff = e.clientX - startX;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        if (Math.abs(diff) > 50) stepCarousel(isRtl ? (diff > 0 ? 1 : -1) : (diff > 0 ? -1 : 1));
    });
    track.addEventListener('mouseleave', () => { isDragging = false; });

    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        if (Math.abs(diff) > 40) stepCarousel(isRtl ? (diff > 0 ? 1 : -1) : (diff > 0 ? -1 : 1));
    });
}

// ──────────────────────────────────────────────────────
// GRID
// ──────────────────────────────────────────────────────
function renderGrid(data) {
    const grid = document.getElementById('fleetGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `<p style="text-align:center;color:var(--clr-muted);grid-column:1/-1;padding:40px">${window.currentLang === 'ar' ? 'لا توجد سيارات' : 'No vehicles found'}</p>`;
        return;
    }

    data.forEach((car, idx) => {
        const card = buildCard(car);
        card.classList.add('reveal', 'slide-up');
        card.style.transitionDelay = `${(idx % 3) * 0.08}s`;
        grid.appendChild(card);
        // Trigger reveal for dynamically added cards
        requestAnimationFrame(() => {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); }
                });
            }, { threshold: 0.05 });
            io.observe(card);
        });
    });
}

// ──────────────────────────────────────────────────────
// FILTER LABEL REFRESH (for language switch)
// ──────────────────────────────────────────────────────
function updateFilterLabels() {
    const lang = window.currentLang || 'ar';
    const ld = window.langData;
    if (!ld || !ld[lang]) return;
    document.querySelectorAll('.filter-btn[data-i18n]').forEach(btn => {
        const key = btn.getAttribute('data-i18n');
        if (ld[lang][key]) btn.textContent = ld[lang][key];
    });
}

// ──────────────────────────────────────────────────────
// MODAL – fully language-aware, always centred
// ──────────────────────────────────────────────────────
function openModal(car) {
    const modal = document.getElementById('fleetModal');
    const modalImg = document.getElementById('modalImg');
    const modalCat = document.getElementById('modalCategory');
    const modalTit = document.getElementById('modalTitle');
    const modalDes = document.getElementById('modalDesc');
    if (!modal) return;

    const lang = window.currentLang || 'ar';
    const ld = window.langData;
    const name = lang === 'ar' ? car.nameAr : car.nameEn;
    const desc = lang === 'ar' ? car.descAr : car.descEn;
    const catKey = window.getCategoryTranslateKey(car.category);
    const catName = (ld[lang] && ld[lang][catKey]) || (ld['ar'] && ld['ar'][catKey]) || car.category;

    modalImg.src = car.image;
    modalImg.alt = name;
    modalCat.textContent = catName;
    modalTit.textContent = name;
    modalDes.textContent = desc;

    // Make modal match current site direction
    modal.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    modal.classList.add('active');
}
