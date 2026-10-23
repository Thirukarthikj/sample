/**
 * Bobby Packaging - Main Vanilla JavaScript
 * High performance, zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCarousel();
  initFaqAccordion();
  initProductsFilter();
  initFilmsFilter();
  initGalleryFilter();
  initProductModals();
  initEnquiryModal();
  initContactForm();
  initNewsletter();
  initBackToTop();
  initTabs();
});

/* -------------------------------------------------------------
 * 1. Navbar Controller
 * ----------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function updateNavbar() {
    if (!header) return;
    const isScrolled = window.scrollY > 20;

    if (isScrolled) {
      header.classList.add('bg-white/95', 'shadow-md', 'py-3');
      header.classList.remove('bg-white/85', 'py-4', 'shadow-sm');
    } else {
      header.classList.add('bg-white/85', 'py-4', 'shadow-sm');
      header.classList.remove('bg-white/95', 'shadow-md', 'py-3');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Mobile menu toggle
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/* -------------------------------------------------------------
 * 2. Hero Carousel (Horizontal Scrolling & Sliding)
 * ----------------------------------------------------------- */
function initHeroCarousel() {
  const track = document.getElementById('heroTrack');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const heroSection = document.getElementById('heroSection');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let timer = null;
  const slideCount = slides.length;

  function goToSlide(index) {
    currentSlide = (index + slideCount) % slideCount;

    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    } else {
      slides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.remove('opacity-0', 'pointer-events-none');
          slide.classList.add('opacity-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'z-10');
          slide.classList.add('opacity-0', 'pointer-events-none');
        }
      });
    }

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.className = 'carousel-dot h-2.5 rounded-full transition-all duration-500 w-8 bg-gold cursor-pointer';
      } else {
        dot.className = 'carousel-dot h-2.5 rounded-full transition-all duration-500 w-2.5 bg-white/40 hover:bg-white/70 cursor-pointer';
      }
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  // Dots navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoPlay();
    });
  });

  // Next & Previous buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoPlay();
    });
  }

  // Hover pause / resume
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile/tablet
    let touchStartX = 0;
    let touchStartY = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      stopAutoPlay();
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Ensure horizontal swipe is dominant
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
    }, { passive: true });
  }

  // Keyboard navigation when user is on the page
  document.addEventListener('keydown', (e) => {
    if (heroSection && heroSection.getBoundingClientRect().bottom > 0) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoPlay();
      }
    }
  });

  // Pause autoplay when window is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  goToSlide(0);
  startAutoPlay();
}

/* -------------------------------------------------------------
 * 3. FAQ Accordion
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all other items in same container
      const container = item.closest('.faq-container') || document;
      container.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. Products Catalog Filter (products.html)
 * ----------------------------------------------------------- */
function initProductsFilter() {
  const categorySelect = document.getElementById('filterCategory');
  const appSelect = document.getElementById('filterApplication');
  const formatSelect = document.getElementById('filterFormat');
  const refineBtn = document.getElementById('btnRefineProducts');
  const cards = document.querySelectorAll('.product-catalog-card');
  const emptyState = document.getElementById('productsEmptyState');

  if (!cards.length) return;

  function filterProducts() {
    const cat = categorySelect ? categorySelect.value.toLowerCase() : '';
    const app = appSelect ? appSelect.value.toLowerCase() : '';
    const fmt = formatSelect ? formatSelect.value.toLowerCase() : '';

    let matchedCount = 0;

    cards.forEach(card => {
      const cardCat = (card.dataset.category || '').toLowerCase();
      const cardApp = (card.dataset.application || '').toLowerCase();
      const cardFmt = (card.dataset.format || '').toLowerCase();

      const matchCat = !cat || cardCat.includes(cat);
      const matchApp = !app || cardApp.includes(app);
      const matchFmt = !fmt || cardFmt.includes(fmt);

      if (matchCat && matchApp && matchFmt) {
        card.style.display = '';
        matchedCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = matchedCount === 0 ? 'block' : 'none';
    }
  }

  if (refineBtn) {
    refineBtn.addEventListener('click', filterProducts);
  }

  if (categorySelect) categorySelect.addEventListener('change', filterProducts);
  if (appSelect) appSelect.addEventListener('change', filterProducts);
  if (formatSelect) formatSelect.addEventListener('change', filterProducts);

  // Parse URL search param
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search');
  if (search) {
    const q = search.toLowerCase();
    cards.forEach(card => {
      const title = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').toLowerCase();
      const desc = (card.querySelector('p') ? card.querySelector('p').textContent : '').toLowerCase();
      if (title.includes(q) || desc.includes(q)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* -------------------------------------------------------------
 * 5. Films Filter Pills (films.html)
 * ----------------------------------------------------------- */
function initFilmsFilter() {
  const pills = document.querySelectorAll('.film-filter-pill');
  const cards = document.querySelectorAll('.film-spec-card');
  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const category = pill.dataset.category;

      pills.forEach(p => {
        p.className = 'film-filter-pill px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary';
      });
      pill.className = 'film-filter-pill px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer bg-primary text-white border-primary shadow-md';

      cards.forEach(card => {
        if (category === 'All' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 6. Gallery Filter Tabs & Lightbox (gallery.html)
 * ----------------------------------------------------------- */
function initGalleryFilter() {
  const tabs = document.querySelectorAll('.gallery-tab-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('closeLightbox');

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.dataset.category;

        tabs.forEach(t => {
          t.className = 'gallery-tab-btn px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all border cursor-pointer bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary';
        });
        tab.className = 'gallery-tab-btn px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all border cursor-pointer bg-primary text-white border-primary shadow-md';

        items.forEach(item => {
          if (cat === 'All' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox view
  if (items.length && lightbox && lightboxImg) {
    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.dataset.title || (item.querySelector('h3') ? item.querySelector('h3').textContent : '');
        const desc = item.dataset.desc || (item.querySelector('p') ? item.querySelector('p').textContent : '');

        if (img) lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        lightbox.classList.remove('hidden');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        lightbox.classList.add('hidden');
      }
    });
  }
}

/* -------------------------------------------------------------
 * 7. Product Detail Modal
 * ----------------------------------------------------------- */
function initProductModals() {
  const modal = document.getElementById('productDetailModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.close-modal');
  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalTag = modal.querySelector('.modal-tag');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalLeadTime = modal.querySelector('.modal-lead-time');
  const modalMaterial = modal.querySelector('.modal-material');
  const modalHighlights = modal.querySelector('.modal-highlights');
  const modalEnquireBtn = modal.querySelector('.modal-enquire-btn');

  document.querySelectorAll('.btn-product-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-catalog-card');
      if (!card) return;

      const title = card.dataset.title || '';
      const tag = card.dataset.tag || '';
      const desc = card.dataset.desc || '';
      const img = card.dataset.image || '';
      const leadTime = card.dataset.leadTime || 'Custom Bulk Order';
      const material = card.dataset.material || 'Virgin Polyethylene';
      const highlights = (card.dataset.highlights || '').split('|');

      if (modalTitle) modalTitle.textContent = title;
      if (modalTag) modalTag.textContent = tag;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalImg) modalImg.src = img;
      if (modalLeadTime) modalLeadTime.textContent = leadTime;
      if (modalMaterial) modalMaterial.textContent = material;

      if (modalHighlights) {
        modalHighlights.innerHTML = highlights.filter(Boolean).map(hl => `
          <li class="flex items-start text-sm text-gray-600">
            <i class="ri-checkbox-circle-fill text-secondary text-lg mr-2.5 shrink-0 mt-0.5"></i>
            <span>${hl.trim()}</span>
          </li>
        `).join('');
      }

      if (modalEnquireBtn) {
        modalEnquireBtn.onclick = () => {
          modal.classList.add('hidden');
          openEnquiryModal({
            title: title,
            material: material
          });
        };
      }

      modal.classList.remove('hidden');
    });
  });

  closeBtns.forEach(b => b.addEventListener('click', () => modal.classList.add('hidden')));
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      modal.classList.add('hidden');
    }
  });
}

/* -------------------------------------------------------------
 * 8. Enquiry Modal & WhatsApp Dispatch
 * ----------------------------------------------------------- */
function openEnquiryModal(presetData = null) {
  const modal = document.getElementById('enquiryModal');
  if (!modal) return;

  const targetInput = modal.querySelector('input[name="requirement"]');
  const targetNote = modal.querySelector('.preset-note');

  if (presetData && targetInput) {
    targetInput.value = presetData.title || presetData.name || '';
  }
  if (presetData && targetNote) {
    targetNote.textContent = `Enquiry for: ${presetData.title || presetData.name || 'Custom Packaging'}`;
    targetNote.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
}

function initEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.close-modal');
  const form = modal.querySelector('form');
  const successBox = modal.querySelector('.enquiry-success');

  // Trigger buttons
  document.querySelectorAll('.open-enquiry-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.dataset.productTitle || '';
      openEnquiryModal({ title });
    });
  });

  closeBtns.forEach(b => b.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (successBox) successBox.classList.add('hidden');
    if (form) form.classList.remove('hidden');
  }));

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      modal.classList.add('hidden');
      if (successBox) successBox.classList.add('hidden');
      if (form) form.classList.remove('hidden');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const requirement = form.querySelector('[name="requirement"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      const text = `*New Packaging Enquiry - Bobby Packaging*\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Email:* ${email}\n` +
        `*Product / Requirement:* ${requirement}\n` +
        `*Details:* ${message}`;

      const waUrl = `https://wa.me/918754002737?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');

      if (successBox) {
        form.classList.add('hidden');
        successBox.classList.remove('hidden');
      } else {
        alert('Thank you! Your enquiry has been received.');
        modal.classList.add('hidden');
      }
    });
  }
}

/* -------------------------------------------------------------
 * 9. Contact Page Form
 * ----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactPageForm');
  const successBox = document.getElementById('contactSuccessBox');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = form.querySelector('#fullName').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const message = form.querySelector('#message').value.trim();

    const text = `*Contact Form Message - Bobby Packaging*\n` +
      `*Full Name:* ${fullName}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Requirement:* ${message}`;

    const waUrl = `https://wa.me/918754002737?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');

    if (successBox) {
      form.classList.add('hidden');
      successBox.classList.remove('hidden');
    } else {
      alert('Thank you! Your message has been sent to our Sivakasi desk.');
    }
  });
}

/* -------------------------------------------------------------
 * 10. Newsletter Form
 * ----------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput || !emailInput.value.trim()) return;

    if (msg) {
      msg.textContent = 'Thank you for subscribing to Bobby Packaging updates!';
      msg.className = 'text-xs text-green-300 font-medium mt-2';
      msg.classList.remove('hidden');
    }
    emailInput.value = '';
  });
}

/* -------------------------------------------------------------
 * 11. Back to Top Button
 * ----------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
      btn.classList.remove('opacity-100');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------
 * 12. Tab Switcher
 * ----------------------------------------------------------- */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach(b => {
        b.className = 'tab-btn flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 bg-transparent text-gray-500 hover:bg-slate-50 hover:text-primary cursor-pointer';
      });
      btn.className = 'tab-btn flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 bg-primary text-white shadow-md cursor-pointer';

      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });
    });
  });
}

