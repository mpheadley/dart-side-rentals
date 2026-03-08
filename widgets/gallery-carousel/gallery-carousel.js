// ─────────────────────────────────────────────────────────────────────────────
// Gallery Carousel Widget
// Extracted from RED-Enterprise. Drop this after your main script.js.
// Requires: .gallery-wrap, .gallery-track, .gallery-slide, .gallery-thumbs
// See snippet.html for the full HTML structure.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  var wrap = document.querySelector('.gallery-wrap');
  if (!wrap) return;
  var track = wrap.querySelector('.gallery-track');
  if (!track) return;

  var slides    = track.querySelectorAll('.gallery-slide');
  var currentEl = wrap.querySelector('.gallery-current');
  var totalEl   = wrap.querySelector('.gallery-total');
  var prevBtn   = wrap.querySelector('.gallery-prev');
  var nextBtn   = wrap.querySelector('.gallery-next');
  var thumbsEl  = document.querySelector('.gallery-thumbs');
  var thumbs    = thumbsEl ? thumbsEl.querySelectorAll('.gallery-thumb') : [];
  var thumbPrev = document.querySelector('.gallery-thumb-prev');
  var thumbNext = document.querySelector('.gallery-thumb-next');

  var total      = slides.length;
  var idx        = 0;
  var touchStartX = 0;
  var GAP        = 12; // must match the gap in .gallery-track CSS

  // Auto-populate total count in the counter element
  if (totalEl) totalEl.textContent = total;

  function getOffset(i) {
    var sw  = slides[i].offsetWidth;
    var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += slides[j].offsetWidth + GAP;
    }
    return (wrap.offsetWidth - sw) / 2 - sum;
  }

  function syncThumbs(i) {
    thumbs.forEach(function (t, j) { t.classList.toggle('active', j === i); });
    if (thumbsEl && thumbs[i]) {
      var thumb = thumbs[i];
      var centerOffset = thumb.offsetLeft - (thumbsEl.offsetWidth - thumb.offsetWidth) / 2;
      thumbsEl.scrollTo({ left: centerOffset, behavior: 'smooth' });
    }
  }

  function goTo(n) {
    slides[idx].classList.remove('active');
    idx = (n + total) % total;
    slides[idx].classList.add('active');
    track.style.transform = 'translateX(' + getOffset(idx) + 'px)';
    if (currentEl) currentEl.textContent = idx + 1;
    syncThumbs(idx);
  }

  // Set initial position without transition flash
  track.style.transition = 'none';
  track.style.transform = 'translateX(' + getOffset(0) + 'px)';
  requestAnimationFrame(function () { track.style.transition = ''; });

  // ── Auto-advance (pauses on hover) ───────────────────────────────────────
  var autoTimer = null;
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(idx + 1); }, 2000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  startAuto();
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  // ── Prev / Next buttons ──────────────────────────────────────────────────
  if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); goTo(idx - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); goTo(idx + 1); startAuto(); });

  // ── Click a dimmed slide to jump to it ──────────────────────────────────
  slides.forEach(function (slide, i) {
    slide.addEventListener('click', function () {
      if (i !== idx) { stopAuto(); goTo(i); startAuto(); }
    });
  });

  // ── Thumbnail clicks ─────────────────────────────────────────────────────
  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); });
  });

  // ── Thumbnail strip scroll buttons ───────────────────────────────────────
  if (thumbPrev && thumbsEl) {
    thumbPrev.addEventListener('click', function () {
      thumbsEl.scrollBy({ left: -195, behavior: 'smooth' });
    });
  }
  if (thumbNext && thumbsEl) {
    thumbNext.addEventListener('click', function () {
      thumbsEl.scrollBy({ left: 195, behavior: 'smooth' });
    });
  }

  // ── Keyboard navigation ───────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { stopAuto(); goTo(idx - 1); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); goTo(idx + 1); startAuto(); }
  });

  // ── Touch / swipe ─────────────────────────────────────────────────────────
  wrap.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrap.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      stopAuto();
      dx < 0 ? goTo(idx + 1) : goTo(idx - 1);
      startAuto();
    }
  }, { passive: true });

  // ── Recalculate on resize ─────────────────────────────────────────────────
  window.addEventListener('resize', function () {
    track.style.transition = 'none';
    track.style.transform = 'translateX(' + getOffset(idx) + 'px)';
    requestAnimationFrame(function () { track.style.transition = ''; });
  });
})();
