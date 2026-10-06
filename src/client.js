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
window.matchMedia('(min-width: 900px)').addEventListener('change', closeMenu);
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
