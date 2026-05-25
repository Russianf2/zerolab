function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado nada.</p>
        <a href="shop.html" class="btn btn-primary">Seguir Comprando</a>
      </div>
    `;
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-image">
        ${item.image || generateProductSVG(item.name, item.category, '#1A1A1A')}
      </div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <div class="cart-item-details">
          ${item.size ? `Talla: ${item.size}` : ''}${item.color ? ' / ' + item.color : ''} · ${item.weight || '—'} KG c/u
        </div>
        <div class="cart-item-price">${formatCOP(item.price)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-selector">
          <button onclick="changeQuantity(${idx}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${idx}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeItem(${idx})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  const totals = getCartTotal();
  const coupon = getAppliedCoupon();

  summary.innerHTML = `
    <div class="cart-summary">
      <h2>Resumen del Pedido</h2>
      <div class="summary-row"><span>Peso Total</span><span>${cart.reduce((s,i) => s + (i.weight || 0) * i.quantity, 0).toFixed(2)} KG</span></div>
      <div class="summary-row"><span>Subtotal</span><span>${formatCOP(totals.subtotal)}</span></div>
      ${totals.discount > 0 ? `<div class="summary-row sub"><span>Descuento (${coupon?.code} - ${coupon?.discount}%)</span><span>-${formatCOP(totals.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Envío</span><span>${totals.shipping === 0 ? 'GRATIS' : formatCOP(totals.shipping)}</span></div>
      ${totals.subtotal < 200000 ? '<div class="summary-row sub" style="color:#22c55e">Envío gratis en pedidos mayores a $200,000</div>' : ''}
      <div class="summary-row total"><span>Total</span><span>${formatCOP(totals.total)}</span></div>

      <div class="coupon-input">
        <input type="text" id="couponCode" placeholder="Código de cupón" value="${coupon?.code || ''}" ${coupon ? 'readonly' : ''}>
        <button onclick="handleCoupon()">${coupon ? '×' : 'Aplicar'}</button>
      </div>
      ${coupon ? '<div class="coupon-applied">✓ Cupón aplicado — 20% DE DESCUENTO</div>' : ''}

      <a href="checkout.html" class="btn btn-primary" style="width:100%;margin-top:16px;display:flex;justify-content:center">
        Pagar — ${formatCOP(totals.total)}
      </a>
      <a href="shop.html" class="btn btn-dark" style="width:100%;margin-top:8px;display:flex;justify-content:center">
        Seguir Comprando
      </a>
    </div>
  `;
}

function changeQuantity(idx, delta) {
  const cart = getCart();
  const newQty = cart[idx].quantity + delta;
  if (newQty <= 0) {
    removeItem(idx);
    return;
  }
  cart[idx].quantity = newQty;
  setCart(cart);
  updateCartBadge();
  renderCart();
}

function removeItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  setCart(cart);
  updateCartBadge();
  renderCart();
}

function handleCoupon() {
  const coupon = getAppliedCoupon();
  if (coupon) {
    removeCoupon();
    renderCart();
    return;
  }
  const code = document.getElementById('couponCode').value.trim();
  if (!code) return;
  const result = applyCoupon(code);
  if (result.success) {
    showToast('¡Cupón aplicado!', '20% DE DESCUENTO — ZEROLABEL');
  } else {
    showToast('Cupón inválido', 'Prueba con otro código');
  }
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderCart, 100);
});
