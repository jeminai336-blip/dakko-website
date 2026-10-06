const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '메뉴 열기');
  nav.classList.remove('open');
}
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? '메뉴 닫기' : '메뉴 열기');
  nav.classList.toggle('open', expanded);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); toggle.focus();
  }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 1100px)').addEventListener('change', closeMenu);
// 첫 화면에서는 고정 버튼을 숨기고, 방문 안내가 보이면 중복 버튼을 숨깁니다.
const sticky = document.querySelector('.mobile-cta');
let pastHero = false;
let atVisit = false;
const updateSticky = () => sticky.classList.toggle('visible', pastHero && !atVisit);
new IntersectionObserver(([entry]) => {
  pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
  updateSticky();
}).observe(document.querySelector('.hero'));
new IntersectionObserver(([entry]) => { atVisit = entry.isIntersecting; updateSticky(); }).observe(document.querySelector('#visit'));

// 자동 전환은 화면에 보일 때만 실행합니다. 직접 조작하면 사용자가 다시 재생할 때까지 멈춥니다.
const carousel = document.querySelector('.hero-slider');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.hero-slide')];
  const dots = [...carousel.querySelectorAll('.slider-dot')];
  const play = carousel.querySelector('.slider-play');
  const count = carousel.querySelector('.slide-count');
  const announcement = carousel.querySelector('.slider-announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let playing = !reducedMotion.matches;
  let visible = false;
  let hovered = false;
  let timer;
  let fadeLayer;
  let fadeAnimation;
  const delay = 5500;

  function syncTimer() {
    clearTimeout(timer);
    if (playing && visible && !hovered && !document.hidden && !carousel.contains(document.activeElement)) {
      timer = setTimeout(() => { show(index + 1); syncTimer(); }, delay);
    }
  }
  function syncPlay() {
    play.textContent = playing ? 'Ⅱ' : '▶';
    play.setAttribute('aria-label', playing ? '자동 전환 일시정지' : '자동 전환 재생');
    syncTimer();
  }
  function show(next, manual = false) {
    const previous = index;
    index = (next + slides.length) % slides.length;
    fadeAnimation?.cancel();
    fadeLayer?.remove();
    fadeLayer = null;
    if (previous !== index && !reducedMotion.matches) {
      const layer = slides[previous].cloneNode(true);
      layer.className = 'hero-fade-out';
      layer.hidden = false;
      layer.inert = true;
      layer.removeAttribute('role');
      layer.removeAttribute('aria-label');
      layer.setAttribute('aria-hidden', 'true');
      carousel.querySelector('.hero-slides').append(layer);
      fadeLayer = layer;
      const animation = layer.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 850, easing: 'ease-in-out', fill: 'forwards'
      });
      fadeAnimation = animation;
      animation.onfinish = () => { layer.remove(); if (fadeLayer === layer) fadeLayer = null; };
    }
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    count.textContent = `${index + 1} / ${slides.length}`;
    if (manual) {
      playing = false;
      announcement.textContent = slides[index].getAttribute('aria-label');
      syncPlay();
    }
  }
  carousel.querySelector('.slider-controls').hidden = false;
  carousel.querySelector('[data-slide="prev"]').addEventListener('click', () => show(index - 1, true));
  carousel.querySelector('[data-slide="next"]').addEventListener('click', () => show(index + 1, true));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
  play.addEventListener('click', () => {
    playing = !playing;
    announcement.textContent = playing ? '자동 전환을 재생합니다.' : '자동 전환을 멈췄습니다.';
    syncPlay();
  });
  carousel.addEventListener('keydown', event => {
    const destinations = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    show(destinations[event.key], true);
  });
  let gesture;
  carousel.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || event.target.closest('button')) return;
    gesture = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  carousel.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1), true);
  });
  carousel.addEventListener('pointercancel', () => { gesture = null; });
  carousel.addEventListener('pointerleave', () => { gesture = null; });
  carousel.addEventListener('mouseenter', () => { hovered = true; syncTimer(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; syncTimer(); });
  carousel.addEventListener('focusin', syncTimer);
  carousel.addEventListener('focusout', () => setTimeout(syncTimer, 0));
  document.addEventListener('visibilitychange', syncTimer);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) playing = false;
    syncPlay();
  });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncTimer(); }, { threshold: 0.15 }).observe(carousel);
  syncPlay();
}

// 이미지 요청이 실패해도 기존 준비 중 안내를 표시합니다.
for (const image of document.querySelectorAll('.photo-image')) {
  const fallback = image.nextElementSibling;
  function showFallback() {
    if (!fallback?.classList.contains('photo-placeholder')) return;
    image.hidden = true;
    fallback.hidden = false;
  }
  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
}

// History film: native vertical scrolling plus a slow, seamless reel loop.
const film = document.querySelector('.history-film');
if (film) {
  const viewport = film.querySelector('.film-window');
  const reel = film.querySelector('.film-reel');
  const track = film.querySelector('.film-track');
  const button = film.querySelector('.film-play');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motion.matches;
  let touching = false;
  let visible = false;
  let lastTime = 0;
  let fractionalScroll = 0;
  let frame;
  const copy = reel.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  const copies = [copy, copy.cloneNode(true), copy.cloneNode(true)];
  track.append(...copies);
  for (const img of track.querySelectorAll('.history-image')) {
    const placeholder = img.nextElementSibling;
    const update = () => {
      const loaded = img.complete && img.naturalWidth > 0;
      const failed = img.complete && !loaded;
      img.hidden = failed;
      placeholder.hidden = !failed;
    };
    img.addEventListener('load', update);
    img.addEventListener('error', update);
    update();
  }
  function sync() {
    copies.forEach(item => { item.hidden = motion.matches; });
    button.hidden = motion.matches;
    button.textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', playing ? '역사 필름 자동 흐름 일시정지' : '역사 필름 자동 흐름 재생');
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (playing && !motion.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    const elapsed = lastTime ? Math.min(time - lastTime, 60) : 0;
    lastTime = time;
    const length = reel.offsetHeight;
    if (!touching && length > 0) {
      fractionalScroll += elapsed * .012;
      const pixels = Math.floor(fractionalScroll);
      fractionalScroll -= pixels;
      viewport.scrollTop += pixels; // 12px per second; each frame stays visible for many seconds.
      if (viewport.scrollTop >= length) viewport.scrollTop -= length;
    }
    frame = requestAnimationFrame(tick);
  }
  button.addEventListener('click', () => { playing = !playing; sync(); });
  viewport.addEventListener('pointerdown', () => { touching = true; });
  const release = () => { touching = false; };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  motion.addEventListener('change', () => { playing = !motion.matches; viewport.scrollTop = 0; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(film);
  sync();
}
