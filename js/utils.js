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
  const garments = {
    'Hoodies': `
<path d="M26 22 Q26 8 38 6 Q56 4 74 6 Q86 8 86 22 L94 28 Q100 38 98 48 L90 44 L90 82 Q90 90 82 90 L30 90 Q22 90 22 82 L22 44 L14 48 Q12 38 18 28 Z" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36 16 Q56 12 76 16" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<line x1="56" y1="16" x2="56" y2="60" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
<path d="M36 60 L36 68 Q36 76 56 76 Q76 76 76 68 L76 60" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" fill="none"/>
<line x1="26" y1="88" x2="86" y2="88" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Oversize Tees': `
<path d="M30 18 Q30 10 40 8 Q56 6 72 8 Q82 10 82 18 L90 22 Q96 30 94 40 L86 38 L86 80 Q86 88 78 88 L34 88 Q26 88 26 80 L26 38 L18 40 Q16 30 22 22 Z" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36 18 Q56 22 76 18" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<line x1="56" y1="22" x2="56" y2="86" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
<line x1="30" y1="86" x2="82" y2="86" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Pants': `
<path d="M26 10 Q26 6 34 6 L86 6 Q94 6 94 10 L94 18 Q94 24 90 26 L90 86 Q90 92 84 92 L76 92 Q70 92 70 86 L70 46 L50 46 L50 86 Q50 92 44 92 L36 92 Q30 92 30 86 L30 26 Q26 24 26 18 Z" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="26" y1="10" x2="94" y2="10" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/>
<line x1="60" y1="18" x2="60" y2="46" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Sneakers': `
<path d="M10 74 C6 58 10 40 22 34 C34 28 54 28 66 34 C78 40 86 54 94 62 C96 68 94 76 86 78 L18 78 C12 78 10 76 10 74 Z" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40 32 C36 24 28 22 24 26 C20 30 22 36 26 38" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<line x1="14" y1="72" x2="88" y2="72" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`,

    'Accessories': `
<path d="M36 14 Q36 8 44 8 L76 8 Q84 8 84 14 L84 46 Q84 52 78 52 L42 52 Q36 52 36 46 Z" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="36" y1="22" x2="84" y2="22" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
<path d="M40 52 L40 62 Q40 68 60 68 Q80 68 80 62 L80 52" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" fill="none"/>
<path d="M54 8 L54 4 Q56 2 60 2 L64 2 Q66 4 66 8" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<text x="50" y="96" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="5" font-family="system-ui,sans-serif" font-weight="500">${name}</text>`
  };

  const svg = garments[category] || garments['Hoodies'];
  return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="8" fill="#0A0A0A"/>${svg}</svg>`;
}
