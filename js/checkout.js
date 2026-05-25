let selectedPayment = 'visa';

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-method').forEach(p => p.classList.remove('active'));
  document.querySelector(`.payment-method[onclick*="${method}"]`)?.classList.add('active');
  const cardDetails = document.getElementById('cardDetails');
  cardDetails.style.display = (method === 'visa' || method === 'mastercard') ? 'block' : 'none';
}

function validateField(id) {
  const el = document.getElementById(id);
  if (!el) return true;
  if (!el.value.trim()) {
    el.classList.add('error');
    return false;
  }
  el.classList.remove('error');
  return true;
}

function validateForm() {
  const fields = ['email', 'firstName', 'lastName', 'address', 'city', 'country', 'phone'];
  let valid = true;
  fields.forEach(f => { if (!validateField(f)) valid = false; });
  if (selectedPayment === 'visa' || selectedPayment === 'mastercard') {
    if (!validateField('cardNumber')) valid = false;
    if (!validateField('expiry')) valid = false;
    if (!validateField('cvv')) valid = false;
  }
  return valid;
}

function placeOrder() {
  if (!validateForm()) {
    showToast('Completa todos los campos', 'Por favor completa toda la información requerida');
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    showToast('Carrito vacío', 'Agrega productos primero');
    return;
  }

  const order = generateOrder();
  if (!order) return;

  order.customer = {
    email: document.getElementById('email').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    country: document.getElementById('country').value,
    phone: document.getElementById('phone').value
  };
  order.payment = selectedPayment;

  saveOrder(order);
  setCart([]);
  removeCoupon();
  updateCartBadge();

  window.location.href = `receipt.html?order=${order.id}`;
}

function renderCheckoutSummary() {
  const cart = getCart();
  const summary = document.getElementById('checkoutSummary');

  if (!cart.length) {
    summary.innerHTML = `
      <div class="cart-summary">
        <h2>Tu carrito está vacío</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px">Agrega items antes de pagar.</p>
        <a href="shop.html" class="btn btn-outline" style="width:100%;display:flex;justify-content:center">Comprar Ahora</a>
      </div>
    `;
    return;
  }

  const totals = getCartTotal();
  const coupon = getAppliedCoupon();

  summary.innerHTML = `
    <div class="cart-summary">
      <h2>Resumen del Pedido</h2>
      ${cart.map(item => `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:0.85rem">
          <div>
            <div style="font-weight:500">${item.name}</div>
            <div style="color:var(--text-muted);font-size:0.75rem">${item.size || ''}${item.color ? ' / ' + item.color : ''} × ${item.quantity}</div>
          </div>
          <div style="font-weight:500">${formatCOP(item.price * item.quantity)}</div>
        </div>
      `).join('')}

      <div class="summary-row" style="margin-top:16px"><span>Subtotal</span><span>${formatCOP(totals.subtotal)}</span></div>
      ${totals.discount > 0 ? `<div class="summary-row sub"><span>Descuento</span><span>-${formatCOP(totals.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Envío</span><span>${totals.shipping === 0 ? 'GRATIS' : formatCOP(totals.shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatCOP(totals.total)}</span></div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderCheckoutSummary, 100);
  document.getElementById('cardNumber')?.addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  });
  document.getElementById('expiry')?.addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0,5);
  });
  document.getElementById('cvv')?.addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
  });
});
