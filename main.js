AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Menú Hamburguesa
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-menu');
    navLinks.classList.toggle('open');
  });
}