let currentOrder = null;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderReceipt() {
  const orderId = getParam('order');
  if (!orderId) {
    showError('No se especificó un pedido.');
    return;
  }

  currentOrder = getOrderById(orderId);
  if (!currentOrder) {
    showError('Pedido no encontrado.');
    return;
  }

  const o = currentOrder;

  document.getElementById('receiptInfo').innerHTML = `
    <div class="receipt-info-item">
      <span>Número de Pedido</span>
      <span style="font-weight:600;letter-spacing:0.05em">${o.id}</span>
    </div>
    <div class="receipt-info-item">
      <span>Fecha</span>
      <span>${o.date}</span>
    </div>
    <div class="receipt-info-item">
      <span>Hora</span>
      <span>${o.time}</span>
    </div>
    <div class="receipt-info-item">
      <span>Estado</span>
      <span style="color:#22c55e;font-weight:500">Confirmado</span>
    </div>
  `;

  document.getElementById('receiptItems').innerHTML = o.items.map(item => `
    <div class="receipt-item">
      <div class="receipt-item-info">
        <span class="receipt-item-name">${item.name}</span>
        <span class="receipt-item-detail">${item.size || ''}${item.color ? ' — ' + item.color : ''} × ${item.quantity}</span>
      </div>
      <div class="receipt-item-price">${formatCOP(item.price * item.quantity)}</div>
    </div>
  `).join('');

  document.getElementById('receiptTotals').innerHTML = `
    <div class="receipt-total-row"><span>Subtotal</span><span>${formatCOP(o.subtotal)}</span></div>
    ${o.discount > 0 ? `<div class="receipt-total-row" style="color:#22c55e"><span>Descuento (${o.coupon?.code || ''})</span><span>-${formatCOP(o.discount)}</span></div>` : ''}
    <div class="receipt-total-row"><span>Envío</span><span>${o.shipping === 0 ? 'GRATIS' : formatCOP(o.shipping)}</span></div>
    <div class="receipt-total-row grand"><span>Total</span><span>${formatCOP(o.total)}</span></div>
  `;

  const customer = o.customer || {};
  document.getElementById('receiptPayment').innerHTML = `
    <div class="receipt-payment-item"><span>Método de Pago</span><span style="text-transform:capitalize">${o.payment || 'N/A'}</span></div>
    <div class="receipt-payment-item"><span>Email</span><span>${customer.email || 'N/A'}</span></div>
    <div class="receipt-payment-item"><span>Dirección</span><span>${customer.address || 'N/A'}, ${customer.city || ''}, ${customer.country || ''}</span></div>
  `;

  const qrContainer = document.getElementById('receiptQR');
  qrContainer.innerHTML = '';
  try {
    new QRCode(qrContainer, {
      text: 'ZERO LABEL',
      width: 100,
      height: 100,
      colorDark: '#ffffff',
      colorLight: '#0A0A0A',
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch(e) {
    qrContainer.innerHTML = '<div style="width:100px;height:100px;background:#1A1A1A;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:#6B6B6B">ZL</div>';
  }
}

function showError(msg) {
  document.getElementById('receiptContent').innerHTML = `
    <div style="text-align:center;padding:60px 0">
      <h2 style="margin-bottom:8px">Pedido no encontrado</h2>
      <p style="color:var(--text-muted)">${msg}</p>
      <a href="shop.html" class="btn btn-outline" style="margin-top:24px">Volver a la Tienda</a>
    </div>
  `;
  document.getElementById('receiptActions').innerHTML = '';
}

function downloadPDF() {
  const element = document.getElementById('receiptContent');
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `ZERO-LABEL-${currentOrder?.id || 'recibo'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0A0A0A' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderReceipt, 200);
});
