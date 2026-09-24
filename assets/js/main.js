(() => {
  'use strict';

  const THEME_KEY = 'sparkden-theme';
  const DIRECTION_KEY = 'sparkden-direction';
  const root = document.documentElement;

  const readStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      
    }
  };

  const getTheme = () => readStorage(THEME_KEY);

  function updateControls(theme) {
    const isLight = theme === 'light';

    document.querySelectorAll('#theme-toggle, .theme-btn, .mode').forEach((button) => {
      button.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark mode' : 'Switch to light mode'
      );

      button.setAttribute(
        'title',
        isLight ? 'Switch to dark mode' : 'Switch to light mode'
      );

      button.dataset.themeState = theme;
      button.setAttribute('aria-pressed', String(!isLight));

      const moon = button.querySelector('#moon-icon, .bi-moon-fill');
      const sun = button.querySelector('#sun-icon, .bi-brightness-high-fill');

      if (moon) moon.style.display = isLight ? 'none' : 'block';
      if (sun) sun.style.display = isLight ? 'block' : 'none';

      if (!moon && !sun) {
        button.textContent = isLight ? '☀' : '☾';
      }
    });
  }

  function applyTheme(theme) {
    const selected = theme === 'dark' ? 'dark' : 'light';

    root.setAttribute('data-theme', selected);
    writeStorage(THEME_KEY, selected);
    updateControls(selected);
  }

  function applyDirection(direction) {
    const selected = direction === 'rtl' ? 'rtl' : 'ltr';
    root.setAttribute('dir', selected);
    document.body.setAttribute('dir', selected);
    writeStorage(DIRECTION_KEY, selected);

    document.querySelectorAll('.ltr, .direction-btn').forEach((button) => {
      button.textContent = selected === 'rtl' ? 'RTL' : 'LTR';
      button.setAttribute('aria-label', `Switch to ${selected === 'rtl' ? 'left-to-right' : 'right-to-left'} direction`);
      button.setAttribute('title', `Switch to ${selected === 'rtl' ? 'LTR' : 'RTL'} direction`);
    });
  }

  // Light mode is the default because it provides the clearest first view.
  applyTheme(getTheme() || 'light');

  document.addEventListener('DOMContentLoaded', () => {
    updateControls(root.getAttribute('data-theme') || 'light');
    applyDirection(readStorage(DIRECTION_KEY) || 'ltr');
  });

  document.addEventListener('click', (event) => {
    const themeButton = event.target.closest('#theme-toggle, .theme-btn, .mode');

    if (themeButton) {
      const current =
        root.getAttribute('data-theme') === 'dark'
          ? 'dark'
          : 'light';

      applyTheme(current === 'dark' ? 'light' : 'dark');
      return;
    }

    const directionButton = event.target.closest('.ltr, .direction-btn');
    if (directionButton) {
      const current = root.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
    }
  });


  // Keep the current page highlighted and update it immediately when a nav item is clicked.
  function updateActiveNavigation() {
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const standardPages = ['index.html', 'about.html', 'services.html', 'blog.html', 'contact.html'];
    const homePages = ['index.html', 'home1.html', 'home2.html'];

    document.querySelectorAll('.navbar a').forEach((link) => {
      const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
      const isPageLink = standardPages.includes(href) || homePages.includes(href);
      const isCurrent = isPageLink && href === currentPage;
      link.classList.toggle('active', isCurrent);
      if (isPageLink) link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    });

    document.querySelectorAll('.nav-home').forEach((dropdown) => {
      const isHomePage = homePages.includes(currentPage);
      const toggle = dropdown.querySelector('.nav-home-toggle');
      if (toggle) {
        toggle.classList.toggle('active', isHomePage);
        toggle.setAttribute('aria-expanded', String(isHomePage && dropdown.matches(':focus-within')));
        toggle.setAttribute('aria-current', isHomePage ? 'page' : 'false');
      }
      dropdown.querySelectorAll('.home-dropdown a').forEach((link) => {
        const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
        link.classList.toggle('active', href === currentPage);
        link.setAttribute('aria-current', href === currentPage ? 'page' : 'false');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavigation();
  });

  document.addEventListener('focusin', (event) => {
    const toggle = event.target.closest('.nav-home-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'true');
  });

  document.addEventListener('focusout', (event) => {
    const toggle = event.target.closest('.nav-home-toggle');
    if (!toggle) return;
    window.setTimeout(() => {
      toggle.setAttribute('aria-expanded', String(toggle.parentElement?.matches(':focus-within') || false));
    }, 0);
  });

  document.addEventListener('click', (event) => {
    const navLink = event.target.closest('.navbar a');
    if (!navLink) return;
    const href = (navLink.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
    if (!href) return;
    document.querySelectorAll('.navbar a').forEach((link) => link.classList.remove('active'));
    navLink.classList.add('active');
  });

})();

// DYNAMIC HEADER HEIGHT
// (measures the real rendered header height so the hero
// section below can fill exactly one screen, no matter
// what height style.css gives the header)
document.addEventListener('DOMContentLoaded', function () {
  var headerEl = document.querySelector('.header');
  function setHeaderHeightVar() {
    if (!headerEl) return;
    document.documentElement.style.setProperty(
      '--site-header-height',
      headerEl.offsetHeight + 'px'
    );
  }
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
  window.addEventListener('load', setHeaderHeightVar);
});

// FAQ JAVASCRIPT
document.addEventListener('DOMContentLoaded', function () {
  document
    .querySelectorAll('.faq-question')
    .forEach(function (button) {
      button.addEventListener('click', function () {
        const currentItem = this.closest('.faq-item');
        const isActive = currentItem.classList.contains('active');
        // Close all FAQ items
        document
          .querySelectorAll('.faq-item')
          .forEach(function (item) {
            item.classList.remove('active');
            item
              .querySelector('.faq-question')
              .setAttribute('aria-expanded', 'false');
          });
        // Open selected FAQ
        if (!isActive) {
          currentItem.classList.add('active');
          currentItem
            .querySelector('.faq-question')
            .setAttribute('aria-expanded', 'true');
        }
      });
    });
});
// SERVICE BOOKING FORM JAVASCRIPT
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('serviceBookingForm');
  if (!form) return;
  const addressField = document.getElementById('bookingAddress');
  const addressHint = document.getElementById('bookingAddressHint');
  const pickupRadio = document.getElementById('servicePickup');
  const dropoffRadio = document.getElementById('serviceDropoff');
  const successMsg = document.getElementById('bookingSuccessMsg');
  function syncAddressRequirement() {
    const isPickup = pickupRadio.checked;
    addressField.required = isPickup;
    addressField.placeholder = isPickup
      ? 'House no, street, area, city (for pickup)'
      : 'Optional — only needed for home pickup';
    addressHint.textContent = isPickup
      ? '(required for home pickup)'
      : '(not needed for drop-off)';
  }
  pickupRadio.addEventListener('change', syncAddressRequirement);
  dropoffRadio.addEventListener('change', syncAddressRequirement);
  syncAddressRequirement();
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    successMsg.classList.add('visible');
    form.reset();
    syncAddressRequirement();
  });
});

// HERO SLIDER JAVASCRIPT
document.addEventListener('DOMContentLoaded', function () {
  const heroSection = document.querySelector('.home1-hero');
  if (!heroSection) return;

  const slides = heroSection.querySelectorAll('.hero-slide');
  const dots = heroSection.querySelectorAll('.hero-dot');
  const prevBtn = heroSection.querySelector('.hero-arrow-prev');
  const nextBtn = heroSection.querySelector('.hero-arrow-next');
  const AUTOPLAY_DELAY = 5000;

  let current = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    const nextIndex = (index + slides.length) % slides.length;
    slides[current].classList.remove('active');
    if (dots[current]) {
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
    }
    current = nextIndex;
    slides[current].classList.add('active');
    if (dots[current]) {
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }
  }

  function goNext() {
    showSlide(current + 1);
  }

  function goPrev() {
    showSlide(current - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goNext, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goNext();
      startAutoplay();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goPrev();
      startAutoplay();
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
      startAutoplay();
    });
  });

  // Pause on hover / keep it running quietly otherwise
  heroSection.addEventListener('mouseenter', stopAutoplay);
  heroSection.addEventListener('mouseleave', startAutoplay);

  if (slides.length > 1) {
    startAutoplay();
  }
});

// HERO STAT NUMBER COUNT-UP JAVASCRIPT
document.addEventListener('DOMContentLoaded', function () {
  var statNumbers = document.querySelectorAll('.stat-card h3');
  if (!statNumbers.length) return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  function animateCount(el) {
    var original = el.textContent.trim();
    var match = original.match(/^([\d.]+)/);
    if (!match) return;
    var target = parseFloat(match[1]);
    var suffix = original.slice(match[1].length);
    var duration = 1300;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = original;
      }
    }
    requestAnimationFrame(step);
  }

  var counted = new WeakSet();
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target);
          var index = Array.prototype.indexOf.call(
            statNumbers,
            entry.target
          );
          var delay = 550 + index * 130;
          setTimeout(function () {
            animateCount(entry.target);
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach(function (el) {
    observer.observe(el);
  });
});
