function formatCOP(price) {
  return '$' + price.toLocaleString('es-CO');
}

function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || (key === 'cart' ? [] : key === 'wishlist' ? [] : key === 'orders' ? [] : null);
  } catch {
    return key === 'cart' ? [] : key === 'wishlist' ? [] : key === 'orders' ? [] : null;
  }
}

function setToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getCart() { return getFromStorage('cart'); }
function setCart(cart) { setToStorage('cart', cart); }
function getWishlist() { return getFromStorage('wishlist'); }
function setWishlist(w) { setToStorage('wishlist', w); }
function getOrders() { return getFromStorage('orders'); }
function setOrders(o) { setToStorage('orders', o); }

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

function getRelatedProducts(category, excludeId, limit = 4) {
  return products.filter(p => p.category === category && p.id !== excludeId).slice(0, limit);
}

function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZL-${date}-${rand}`;
}

function generateOrder() {
  const cart = getCart();
  if (!cart.length) return null;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = getAppliedCoupon() ? subtotal * 0.2 : 0;
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal - discount + shipping;
  return {
    id: generateOrderId(),
    date: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    items: cart,
    subtotal,
    discount,
    shipping,
    total,
    coupon: getAppliedCoupon()
  };
}

function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  setOrders(orders);
  setToStorage('lastOrderId', order.id);
}

function getLastOrderId() {
  return localStorage.getItem('lastOrderId');
}

function getOrderById(id) {
  return getOrders().find(o => o.id === id);
}

const COUPONS = {
  'ZEROLABEL': { discount: 20, type: 'percentage' }
};

let APPLIED_COUPON = null;

function applyCoupon(code) {
  const coupon = COUPONS[code.toUpperCase()];
  if (coupon) {
    APPLIED_COUPON = { code: code.toUpperCase(), ...coupon };
    setToStorage('appliedCoupon', APPLIED_COUPON);
    return { success: true, coupon: APPLIED_COUPON };
  }
  return { success: false };
}

function getAppliedCoupon() {
  if (APPLIED_COUPON) return APPLIED_COUPON;
  APPLIED_COUPON = getFromStorage('appliedCoupon');
  return APPLIED_COUPON;
}

function removeCoupon() {
  APPLIED_COUPON = null;
  localStorage.removeItem('appliedCoupon');
}

function getCartTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const coupon = getAppliedCoupon();
  const discount = coupon ? subtotal * (coupon.discount / 100) : 0;
  const shipping = subtotal >= 200000 ? 0 : 15000;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

function garmentFill(color) {
  const h = color.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  if (r < 30 && g < 30 && b < 30) return '#2A2A2A';
  return color;
}

function generateProductSVG(name, category, color = '#1A1A1A') {
  const fill = garmentFill(color);
  const garments = {
    'Hoodies': `<path d="M22 22 Q22 10,35 8 Q50 6,65 8 Q78 10,78 22 L86 28 Q92 38,90 50 L82 44 L82 80 Q82 88,74 88 L26 88 Q18 88,18 80 L18 44 L10 50 Q8 38,14 28 Z" fill="${fill}" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
<path d="M38 20 L62 20 L62 24 L38 24 Z" fill="rgba(255,255,255,0.06)"/>
<path d="M32 58 L68 58 L68 70 Q68 74,64 74 L36 74 Q32 74,32 70 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
<path d="M26 82 L74 82" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-linecap="round"/>
<line x1="50" y1="24" x2="50" y2="55" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui, sans-serif" font-weight="500">${name}</text>`,

    'Oversize Tees': `<path d="M28 20 Q28 14,35 12 Q50 10,65 12 Q72 14,72 20 L82 24 Q90 32,88 46 L78 40 L78 78 Q78 86,70 86 L30 86 Q22 86,22 78 L22 40 L12 46 Q10 32,18 24 Z" fill="${fill}" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
<path d="M40 18 L60 18 L60 22 L40 22 Z" fill="rgba(255,255,255,0.04)"/>
<path d="M28 60 Q50 64,72 60" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" fill="none"/>
<line x1="50" y1="22" x2="50" y2="78" stroke="rgba(255,255,255,0.03)" stroke-width="0.3"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui, sans-serif" font-weight="500">${name}</text>`,

    'Pants': `<path d="M18 8 Q18 5,26 5 L74 5 Q82 5,82 8 L82 16 Q82 22,78 24 L78 86 Q78 92,72 92 L64 92 Q58 92,58 86 L58 44 L42 44 L42 86 Q42 92,36 92 L28 92 Q22 92,22 86 L22 24 Q18 22,18 16 Z" fill="${fill}" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
<path d="M22 8 L78 8" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M14 14 L86 14" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
<path d="M14 18 L22 18" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
<path d="M78 18 L86 18" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
<line x1="50" y1="14" x2="50" y2="44" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui, sans-serif" font-weight="500">${name}</text>`,

    'Sneakers': `<path d="M12 70 Q12 62,18 58 L60 56 Q70 56,76 52 L82 50 Q88 48,90 52 L90 60 Q90 68,82 70 Z" fill="${fill}" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
<path d="M14 70 Q14 74,20 74 L78 74 Q84 74,84 70" fill="${fill}" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/>
<path d="M54 56 L54 42 Q54 36,60 34 L70 32 Q74 32,76 36 L78 48" fill="${fill}" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
<path d="M30 56 L30 40 Q30 36,36 36 L48 36 Q54 36,54 42 L54 56" fill="${fill}" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
<circle cx="62" cy="44" r="1.5" fill="rgba(255,255,255,0.15)"/>
<circle cx="68" cy="42" r="1.5" fill="rgba(255,255,255,0.15)"/>
<circle cx="74" cy="44" r="1.5" fill="rgba(255,255,255,0.15)"/>
<path d="M14 66 L84 66" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
<path d="M18 72 Q50 74,82 72" stroke="rgba(255,255,255,0.06)" stroke-width="1" fill="none"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui, sans-serif" font-weight="500">${name}</text>`,

    'Accessories': `<path d="M30 8 Q30 4,38 4 L62 4 Q70 4,70 8 L74 20 Q76 28,72 32 L72 36 Q72 40,68 40 L32 40 Q28 40,28 36 L28 32 Q24 28,26 20 Z" fill="${fill}" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
<path d="M40 40 L40 52 Q40 58,50 58 Q60 58,60 52 L60 40" fill="${fill}" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
<path d="M42 20 L58 20" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-linecap="round"/>
<path d="M44 24 L56 24" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" stroke-linecap="round"/>
<path d="M50 58 L50 68" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M44 72 Q50 76,56 72" stroke="rgba(255,255,255,0.06)" stroke-width="1" fill="none"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui, sans-serif" font-weight="500">${name}</text>`
  };

  const svg = garments[category] || garments['Hoodies'];
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="8" fill="#0A0A0A"/>${svg}</svg>`;
}
