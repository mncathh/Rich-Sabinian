/* =============================================
   MAIN.JS — Shared utilities for multi-page site
============================================= */

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const ham = document.getElementById('hamburger');
  const drawer = document.getElementById('mobDrawer');
  const overlay = document.getElementById('mobOverlay');
  const mobClose = document.getElementById('mobClose');

  if (!ham) return;

  function openMobile() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    ham.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobile() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', () => drawer.classList.contains('open') ? closeMobile() : openMobile());
  if (mobClose) mobClose.addEventListener('click', closeMobile);
  if (overlay) overlay.addEventListener('click', closeMobile);
}

/* ---- Sticky Navbar ---- */
function initStickyNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ---- Active Navigation Link Highlighting ---- */
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .footer-quick-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

/* ---- Home Page Carousel (only on home page) ---- */
function initHomeCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const images = [
    'bridal-collection-2022/1.jpg',
    'bridal-collection-2022/2.jpg',
    'bridal-collection-2022/3.jpg',
    'bridal-collection-2022/5.jpg',
    'Solohiya/hero.jpg',
    'Solohiya/hero1.jpg',
    'Solohiya/4.jpg',
    'national-costumes/hero.jpg'
  ];

  const allImages = [...images, ...images, ...images];
  track.innerHTML = allImages.map(img => `
    <div class="carousel-slide">
      <img src="${img}" alt="Featured work" loading="lazy">
    </div>
  `).join('');
}

/* ---- Collections Page Rendering ---- */
function renderCollections() {
  const grid = document.getElementById('collectionsGrid');
  if (!grid || typeof collectionsData === 'undefined') return;
  
  grid.innerHTML = collectionsData.map((c, i) => `
    <div class="collection-card" data-idx="${i}">
      <img src="${c.mainImg}" alt="${c.name}" loading="lazy">
      <div class="collection-overlay">
        <div class="coll-cat-tag">${c.cat}</div>
        <div class="coll-card-name">${c.name}</div>
        <span class="coll-card-cta">Discover Collection →</span>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx);
      sessionStorage.setItem('selectedCollection', JSON.stringify(collectionsData[idx]));
      window.location.href = 'collection-detail.html';
    });
  });
}

/* ---- Collection Detail Page ---- */
function renderCollectionDetail() {
  const savedCollection = sessionStorage.getItem('selectedCollection');
  if (!savedCollection) return;
  
  const collection = JSON.parse(savedCollection);
  document.getElementById('detailTitle').textContent = collection.name;
  document.getElementById('detailDesc').textContent = collection.desc;
  
  const galleryContainer = document.getElementById('detailGallery');
  if (galleryContainer) {
    galleryContainer.innerHTML = collection.gallery.map(img => `
      <img src="${img}" alt="${collection.name}" loading="lazy" onclick="openLightbox('${img}')">
    `).join('');
  }
}

/* ---- Lightbox (for collection detail page) ---- */
window.openLightbox = function(imgSrc) {
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.95)', zIndex: '3000',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
  });
  modal.innerHTML = `
    <img src="${imgSrc}" style="max-width:90%;max-height:90%;object-fit:contain;">
    <button style="position:absolute;top:20px;right:30px;background:none;border:1px solid var(--gold);color:var(--gold);width:40px;height:40px;cursor:pointer;font-size:24px;">&times;</button>
  `;
  modal.querySelector('button').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
};

/* ---- Initialize everything based on current page ---- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyNav();
  initActiveNav();
  initScrollReveal();
  initHomeCarousel();
  renderCollections();
  renderCollectionDetail();
});