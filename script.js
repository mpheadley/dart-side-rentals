// ─── Promo banner (sticky bottom) ───
(function () {
  var banner = document.getElementById('promo-banner');
  var closeBtn = document.getElementById('promo-close');
  if (!banner || !closeBtn) return;

  closeBtn.addEventListener('click', function () {
    banner.classList.add('hidden');
  });
})();

// ─── Hero confetti burst ───
(function () {
  var canvas = document.getElementById('hero-confetti');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var W, H;
  var particles = [];
  var colors = ['#FF6B00', '#00C4D4', '#FFB800', '#FFFFFF', '#FF6B00', '#00C4D4'];
  var PARTICLE_COUNT = 60;
  var GRAVITY = 0.12;
  var FADE_START = 60; // frame to start fading
  var TOTAL_FRAMES = 120;
  var frame = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();

  // Spawn from center-top area
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: W * (0.3 + Math.random() * 0.4),
      y: H * (0.25 + Math.random() * 0.15),
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 2,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
    });
  }

  function draw() {
    if (frame >= TOTAL_FRAMES) { canvas.style.display = 'none'; return; }
    ctx.clearRect(0, 0, W, H);

    var alpha = frame > FADE_START ? 1 - (frame - FADE_START) / (TOTAL_FRAMES - FADE_START) : 1;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.vy += GRAVITY;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    }

    frame++;
    requestAnimationFrame(draw);
  }

  // Delay burst slightly so it fires after hero text animates in
  setTimeout(function () { draw(); }, 800);
})();

// ─── Stat number rollup ───
(function () {
  var stats = document.querySelectorAll('.hero-stat-num');
  if (!stats.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var DURATION = 2200; // ms — slow enough to read
  var DELAY = 1400; // ms — wait for hero fade-in to finish first

  // Store targets and zero them out immediately
  var targets = [];
  stats.forEach(function (el) {
    targets.push(parseInt(el.textContent, 10));
    el.textContent = '0';
  });

  function animateStat(el, target) {
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Delay the rollup so the hero fade-in animation finishes first
  setTimeout(function () {
    stats.forEach(function (el, i) {
      animateStat(el, targets[i]);
    });
  }, DELAY);
})();

// ─── Floating crosshair animations ───
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var crosshairs = document.querySelectorAll('.floater-crosshair, .floater-cta-1, .floater-cta-2');

  crosshairs.forEach(function (el) {
    var parent = el.closest('.hero-floaters, .section-floaters');
    if (!parent) return;

    var pw = parent.offsetWidth || window.innerWidth;
    var ph = parent.offsetHeight || 600;
    var x = Math.random() * pw * 0.8 + pw * 0.1;
    var y = Math.random() * ph * 0.6 + ph * 0.2;
    var targetX = x, targetY = y;
    var speed = 0.3 + Math.random() * 0.3;
    el.style.opacity = '0';

    // Fade in after a beat
    setTimeout(function () {
      el.style.transition = 'opacity 2s';
      el.style.opacity = '1';
    }, 1000 + Math.random() * 2000);

    function pickTarget() {
      targetX = Math.random() * pw * 0.8 + pw * 0.1;
      targetY = Math.random() * ph * 0.6 + ph * 0.2;
    }

    pickTarget();
    var frameCount = 0;

    function tick() {
      var dx = targetX - x;
      var dy = targetY - y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        pickTarget();
      } else {
        x += (dx / dist) * speed;
        y += (dy / dist) * speed;
      }

      el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      requestAnimationFrame(tick);
    }

    tick();
  });
})();

// ─── Nav scroll behavior ───
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── Mobile menu ───
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileCloseBtn = document.getElementById('mobile-close-btn');

function openMobileMenu() {
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileCloseBtn.addEventListener('click', closeMobileMenu);

mobileOverlay.addEventListener('click', (e) => {
  if (e.target === mobileOverlay) closeMobileMenu();
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ─── Scroll-triggered animations ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ─── Scroll spy for homepage anchor links ───
const navSections = ['hero', 'arsenal', 'how-it-works', 'faq', 'contact'].map(id => ({
  id,
  el: document.getElementById(id),
})).filter(s => s.el);

const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current = navSections[0]?.id;
  navSections.forEach(({ id, el }) => {
    if (el.offsetTop <= scrollY) current = id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ─── Hide scroll cue after user scrolls ───
const scrollCue = document.querySelector('.scroll-cue');
if (scrollCue) {
  window.addEventListener('scroll', () => {
    scrollCue.classList.toggle('hidden', window.scrollY > 80);
  }, { passive: true });
}

// ─── Sticky mobile CTA — show after scrolling past hero ───
const stickyCta = document.getElementById('sticky-mobile-cta');
if (stickyCta) {
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contact');

  window.addEventListener('scroll', () => {
    const pastHero = heroSection && window.scrollY > heroSection.offsetHeight - 100;
    const atContact = contactSection && (window.scrollY + window.innerHeight) >= contactSection.offsetTop + 200;
    stickyCta.classList.toggle('visible', pastHero && !atContact);
  }, { passive: true });
}

// ─── Footer year ───
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── Cookie Consent + GA4 ───
(function () {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;

  var GA4_ID = banner.getAttribute('data-ga4');
  var hasTracking = GA4_ID && GA4_ID !== 'NONE';

  if (!hasTracking) return;

  var consent = localStorage.getItem('cookie_consent');

  if (consent === 'accepted') { loadGA4(); return; }
  if (consent === 'declined') return;

  setTimeout(function () { banner.classList.add('visible'); }, 800);

  banner.querySelector('.cookie-btn-accept').addEventListener('click', function () {
    localStorage.setItem('cookie_consent', 'accepted');
    banner.classList.remove('visible');
    loadGA4();
  });

  banner.querySelector('.cookie-btn-decline').addEventListener('click', function () {
    localStorage.setItem('cookie_consent', 'declined');
    banner.classList.remove('visible');
  });

  function loadGA4() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }
})();
