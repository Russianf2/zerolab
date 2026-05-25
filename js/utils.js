function formatCOP(price) {
  return '$' + price.toLocaleString('es-CO');
}

function getSizeWeightMultiplier(size) {
  if (!size) return 1;
  const multipliers = {
    'S': 0.9, 'M': 1.0, 'L': 1.1, 'XL': 1.2,
    '28': 0.85, '30': 0.92, '32': 1.0, '34': 1.08, '36': 1.15,
    '38': 0.88, '39': 0.94, '40': 1.0, '41': 1.06, '42': 1.12, '43': 1.18
  };
  return multipliers[size] || 1;
}

function calcWeight(baseWeight, size) {
  return Math.round((baseWeight * getSizeWeightMultiplier(size)) * 100) / 100;
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

function generateProductSVG(name, category) {
  const W = 'rgba(255,255,255,0.5)';
  const D = 'rgba(255,255,255,0.25)';
  const garments = {
    'Hoodies': `
<path d="M24 24 Q24 12 34 10 Q50 7 66 10 Q76 12 76 24 L84 30 Q88 42 86 50 L78 44 L78 78 Q78 86 70 86 L30 86 Q22 86 22 78 L22 44 L14 50 Q12 42 16 30 Z" stroke="${W}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28 26 Q50 20 72 26" stroke="${D}" stroke-width="1" fill="none"/>
<path d="M34 58 L34 66 Q34 72 50 72 Q66 72 66 66 L66 58" stroke="${D}" stroke-width="1" fill="none"/>
<line x1="50" y1="10" x2="50" y2="54" stroke="${D}" stroke-width="0.6"/>
<line x1="24" y1="84" x2="76" y2="84" stroke="${W}" stroke-width="1.2" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Oversize Tees': `
<path d="M30 20 Q30 12 38 10 Q50 8 62 10 Q70 12 70 20 L80 24 Q86 34 84 46 L76 40 L76 76 Q76 84 68 84 L32 84 Q24 84 24 76 L24 40 L16 46 Q14 34 20 24 Z" stroke="${W}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36 16 Q50 13 64 16" stroke="${D}" stroke-width="1" fill="none"/>
<line x1="50" y1="16" x2="50" y2="82" stroke="${D}" stroke-width="0.6"/>
<line x1="26" y1="82" x2="74" y2="82" stroke="${W}" stroke-width="1.2" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Pants': `
<path d="M22 8 Q22 4 28 4 L72 4 Q78 4 78 8 L78 14 Q78 20 74 22 L74 84 Q74 90 68 90 L60 90 Q54 90 54 84 L54 42 L46 42 L46 84 Q46 90 40 90 L32 90 Q26 90 26 84 L26 22 Q22 20 22 14 Z" stroke="${W}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="22" y1="8" x2="78" y2="8" stroke="${W}" stroke-width="1.2" stroke-linecap="round"/>
<line x1="18" y1="16" x2="26" y2="16" stroke="${D}" stroke-width="1" stroke-linecap="round"/>
<line x1="74" y1="16" x2="82" y2="16" stroke="${D}" stroke-width="1" stroke-linecap="round"/>
<line x1="50" y1="14" x2="50" y2="42" stroke="${D}" stroke-width="0.8"/>
<line x1="28" y1="88" x2="40" y2="88" stroke="${D}" stroke-width="1" stroke-linecap="round"/>
<line x1="60" y1="88" x2="72" y2="88" stroke="${D}" stroke-width="1" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Sneakers': `
<path d="M14 68 Q14 62 20 60 L64 58 Q74 58 80 52 L84 50 Q88 48 90 52 L90 62 Q90 70 82 72 Z" stroke="${W}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 68 Q16 74 22 74 L78 74 Q84 74 84 68" stroke="${W}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<path d="M56 58 L56 44 Q56 36 62 34 L72 32 Q76 32 78 36 L80 50" stroke="${W}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
<path d="M30 58 L30 42 Q30 36 36 36 L50 36 Q54 36 54 40 L54 58" stroke="${W}" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M20 60 Q16 56 16 62" stroke="${D}" stroke-width="1" fill="none"/>
<circle cx="62" cy="44" r="1.5" stroke="${D}" stroke-width="0.8"/>
<circle cx="68" cy="42" r="1.5" stroke="${D}" stroke-width="0.8"/>
<circle cx="74" cy="44" r="1.5" stroke="${D}" stroke-width="0.8"/>
<line x1="16" y1="66" x2="84" y2="66" stroke="${D}" stroke-width="0.6"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Accessories': `
<path d="M32 10 Q32 4 40 4 L60 4 Q68 4 68 10 L72 22 Q74 28 70 32 L70 36 Q70 42 66 42 L34 42 Q30 42 30 36 L30 32 Q26 28 28 22 Z" stroke="${W}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="34" y1="16" x2="66" y2="16" stroke="${D}" stroke-width="1" stroke-linecap="round"/>
<path d="M38 42 L38 52 Q38 60 50 60 Q62 60 62 52 L62 42" stroke="${W}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
<line x1="50" y1="22" x2="50" y2="42" stroke="${D}" stroke-width="0.8"/>
<line x1="50" y1="60" x2="50" y2="70" stroke="${W}" stroke-width="1.5" stroke-linecap="round"/>
<path d="M44 74 Q50 78 56 74" stroke="${D}" stroke-width="1" fill="none" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`
  };

  const svg = garments[category] || garments['Hoodies'];
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="8" fill="#0A0A0A"/>${svg}</svg>`;
}
