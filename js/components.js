function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="container">
      <a href="index.html" class="navbar-logo">ZERO LABEL</a>
      <ul class="navbar-links">
        <li><a href="index.html" data-page="home">Inicio</a></li>
        <li><a href="shop.html" data-page="shop">Tienda</a></li>
        <li><a href="shop.html?category=Hoodies">Hoodies</a></li>
        <li><a href="shop.html?category=Sneakers">Sneakers</a></li>
        <li><a href="shop.html?category=Accessories">Accesorios</a></li>
      </ul>
      <div class="navbar-actions">
        <a href="cart.html" class="navbar-icon" id="cartIcon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="cart-badge" id="cartBadge" style="display:none">0</span>
        </a>
        <button class="navbar-icon" id="wishlistIcon" onclick="window.location.href='shop.html?wishlist=1'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button class="hamburger" id="hamburgerBtn" aria-label="Menú">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  `;

  const mobile = document.getElementById('mobileMenu');
  if (mobile) {
    document.getElementById('hamburgerBtn')?.addEventListener('click', () => mobile.classList.add('open'));
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`.navbar-links a[data-page="${page}"]`).forEach(a => a.style.color = '#fff');
  }
}

function renderMobileMenu() {
  const el = document.getElementById('mobileMenu');
  if (!el) return;
  el.innerHTML = `
    <button class="mobile-menu-close" id="mobileClose" aria-label="Cerrar menú">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <a href="index.html">Inicio</a>
    <a href="shop.html">Todos los Productos</a>
    <a href="shop.html?category=Hoodies">Hoodies</a>
    <a href="shop.html?category=Oversize+Tees">Camisetas</a>
    <a href="shop.html?category=Pants">Pantalones</a>
    <a href="shop.html?category=Sneakers">Sneakers</a>
    <a href="shop.html?category=Accessories">Accesorios</a>
    <a href="cart.html">Carrito</a>
  `;
  document.getElementById('mobileClose')?.addEventListener('click', () => el.classList.remove('open'));
  el.querySelectorAll('a').forEach(a => a.addEventListener('click', () => el.classList.remove('open')));
}

function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="navbar-logo">ZERO LABEL</a>
          <p class="footer-brand-desc">Streetwear minimalista. Sin reglas. Solo estilo. Diseñado para los que rompen lo establecido.</p>
          <div class="footer-social">
            <a href="https://www.instagram.com/5stars.dev/" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="https://wa.me/573135984034" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
            <a href="mailto:ramosgiorgios43@gmail.com" aria-label="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>
          </div>
        </div>
        <div>
          <h4 class="footer-column-title">Tienda</h4>
          <ul class="footer-links">
            <li><a href="shop.html">Todos los Productos</a></li>
            <li><a href="shop.html?category=Hoodies">Hoodies</a></li>
            <li><a href="shop.html?category=Oversize+Tees">Camisetas</a></li>
            <li><a href="shop.html?category=Pants">Pantalones</a></li>
            <li><a href="shop.html?category=Sneakers">Sneakers</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-column-title">Soporte</h4>
          <ul class="footer-links">
            <li><a href="contact.html">Contacto</a></li>
            <li><a href="shipping.html">Envíos</a></li>
            <li><a href="returns.html">Devoluciones</a></li>
            <li><a href="size-guide.html">Guía de Tallas</a></li>
            <li><a href="faq.html">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-column-title">Legal</h4>
          <ul class="footer-links">
            <li><a href="privacy.html">Privacidad</a></li>
            <li><a href="terms.html">Términos</a></li>
            <li><a href="cookies.html">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 ZERO LABEL. Todos los derechos reservados.</span>
        <span>Hecho por gio</span>
      </div>
    </div>
  `;
}

function showToast(message, submessage) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <div class="toast-text"><strong>${message}</strong>${submessage || ''}</div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 300);
  });
  setTimeout(() => loader.classList.add('hidden'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderMobileMenu();
  renderFooter();
  updateCartBadge();
  initLoader();

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
});
