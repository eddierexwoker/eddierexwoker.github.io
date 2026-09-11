document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];

const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 12);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

navToggle?.addEventListener('click', () => {
  const next = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(next));
  siteNav?.classList.toggle('open', next);
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  siteNav?.classList.remove('open');
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    navToggle?.setAttribute('aria-expanded', 'false');
    siteNav?.classList.remove('open');
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-25% 0px -65%', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const videos = [...document.querySelectorAll('video')];
videos.forEach((video) => video.addEventListener('play', () => {
  videos.forEach((other) => { if (other !== video && !other.paused) other.pause(); });
}));

const lightbox = document.getElementById('figure-lightbox');
const lightboxImage = lightbox?.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.lightbox;
    lightbox.showModal();
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

document.getElementById('year').textContent = new Date().getFullYear();
