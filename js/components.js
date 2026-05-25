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
            <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="#" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
            <a href="#" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
            <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>
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
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Envíos</a></li>
            <li><a href="#">Devoluciones</a></li>
            <li><a href="#">Guía de Tallas</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-column-title">Legal</h4>
          <ul class="footer-links">
            <li><a href="#">Privacidad</a></li>
            <li><a href="#">Términos</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 ZERO LABEL. Todos los derechos reservados.</span>
        <span>Hecho con minimalismo</span>
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
