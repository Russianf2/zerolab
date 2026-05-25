let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let currentImageIndex = 0;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderProduct() {
  if (!currentProduct) return;

  const p = currentProduct;
  document.getElementById('breadcrumbCat').href = `shop.html?category=${p.category}`;
  document.getElementById('breadcrumbCat').textContent = p.category;
  document.getElementById('breadcrumbName').textContent = p.name;
  document.getElementById('productName').textContent = p.name;
  document.getElementById('productPrice').textContent = formatCOP(p.price);
  document.getElementById('productDescription').textContent = p.description;

  document.title = `${p.name} — ZERO LABEL`;

  updateMainImage(p, 0);

  const thumbs = document.getElementById('thumbnails');
  thumbs.innerHTML = p.images.map((_, i) => `
    <div class="product-thumb ${i === 0 ? 'active' : ''}" onclick="updateMainImage(currentProduct, ${i})">
      ${generateProductSVG(p.name, p.category, p.isVariable && p.variations ? p.variations[0]?.hex || '#1A1A1A' : '#1A1A1A')}
    </div>
  `).join('');

  const colorSection = document.getElementById('colorSection');
  const colorOptions = document.getElementById('colorOptions');
  if (p.isVariable && p.variations) {
    colorSection.style.display = 'block';
    colorOptions.innerHTML = p.variations.map((v, i) => `
      <button class="color-option ${i === 0 ? 'active' : ''}" style="background:${v.hex}" onclick="selectColor(${i})" title="${v.name}"></button>
    `).join('');
    selectedColor = p.variations[0];
  } else {
    colorSection.style.display = 'none';
  }

  const sizeOptions = document.getElementById('sizeOptions');
  sizeOptions.innerHTML = p.sizes.map((s, i) => `
    <button class="size-option ${i === 0 ? 'active' : ''}" onclick="selectSize(${i})">${s}</button>
  `).join('');
  selectedSize = p.sizes[0];

  function updateWeight() {
    const el = document.getElementById('weightDisplay');
    if (el) el.textContent = calcWeight(p.weight, selectedSize) + ' KG';
  }
  updateWeight();
  window._updateProductWeight = updateWeight;

  const meta = document.getElementById('productMeta');
  meta.innerHTML = `
    <div class="product-meta-item"><span>Peso</span><span id="weightDisplay">${calcWeight(p.weight, selectedSize)} KG</span></div>
    <div class="product-meta-item"><span>Stock</span><span id="stockDisplay">${p.isVariable && selectedColor ? selectedColor.stock : p.stock} unidades</span></div>
    <div class="product-meta-item"><span>Valoración</span><span>★ ${p.rating}</span></div>
  `;

  const related = getRelatedProducts(p.category, p.id);
  const relatedSection = document.getElementById('relatedSection');
  const relatedGrid = document.getElementById('relatedGrid');
  if (related.length) {
    relatedSection.style.display = 'block';
    relatedGrid.innerHTML = related.map(r => {
      const c = r.isVariable && r.variations ? r.variations[0]?.hex || '#1A1A1A' : '#1A1A1A';
      return `
        <div class="product-card" onclick="window.location.href='product.html?id=${r.id}'">
          <div class="product-card-image">${generateProductSVG(r.name, r.category, c)}</div>
          <div class="product-card-body">
            <div class="product-card-category">${r.category}</div>
            <div class="product-card-name">${r.name}</div>
            <div class="product-card-price">${formatCOP(r.price)}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function updateMainImage(p, index) {
  currentImageIndex = index;
  const main = document.getElementById('mainImage');
  const color = p.isVariable && p.variations ? (selectedColor?.hex || p.variations[0].hex) : '#1A1A1A';
  main.innerHTML = generateProductSVG(p.name, p.category, color);
  document.querySelectorAll('.product-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
}

function selectColor(index) {
  if (!currentProduct?.variations) return;
  selectedColor = currentProduct.variations[index];
  document.querySelectorAll('.color-option').forEach((c, i) => c.classList.toggle('active', i === index));
  updateMainImage(currentProduct, currentImageIndex);
  const stockEl = document.getElementById('stockDisplay');
  if (stockEl) stockEl.textContent = `${selectedColor.stock} unidades`;
}

function selectSize(index) {
  selectedSize = currentProduct.sizes[index];
  document.querySelectorAll('.size-option').forEach((s, i) => s.classList.toggle('active', i === index));
  if (typeof _updateProductWeight === 'function') _updateProductWeight();
}

function getSelectedProductData() {
  if (!currentProduct) return null;
  return {
    id: currentProduct.id,
    name: currentProduct.name,
    category: currentProduct.category,
    price: currentProduct.price,
    weight: calcWeight(currentProduct.weight, selectedSize),
    size: selectedSize || currentProduct.sizes[0],
    color: currentProduct.isVariable ? (selectedColor?.name || currentProduct.variations[0].name) : null,
    colorHex: currentProduct.isVariable ? (selectedColor?.hex || currentProduct.variations[0].hex) : null,
    image: generateProductSVG(currentProduct.name, currentProduct.category, selectedColor?.hex || '#1A1A1A')
  };
}

function addToCart() {
  const data = getSelectedProductData();
  if (!data) return;
  const cart = getCart();
  const existing = cart.findIndex(item =>
    item.id === data.id &&
    item.size === data.size &&
    item.color === data.color
  );
  if (existing > -1) {
    cart[existing].quantity += 1;
  } else {
    cart.push({ ...data, quantity: 1 });
  }
  setCart(cart);
  updateCartBadge();
  showToast('¡Agregado al Carrito!', `${data.name} — ${data.size}${data.color ? ' / ' + data.color : ''}`);
}

function buyNow() {
  addToCart();
  setTimeout(() => window.location.href = 'checkout.html', 400);
}

async function initProduct() {
  await loadProducts();
  const id = getParam('id');
  if (!id) {
    document.getElementById('productDetail').innerHTML = '<div style="text-align:center;padding:100px 0"><h2>Producto no encontrado</h2><p style="color:var(--text-muted);margin-top:8px">No se especificó un ID de producto.</p><a href="shop.html" class="btn btn-outline" style="margin-top:24px">Volver a la Tienda</a></div>';
    return;
  }
  currentProduct = getProductById(id);
  if (!currentProduct) {
    document.getElementById('productDetail').innerHTML = '<div style="text-align:center;padding:100px 0"><h2>Producto no encontrado</h2><p style="color:var(--text-muted);margin-top:8px">Este producto no existe.</p><a href="shop.html" class="btn btn-outline" style="margin-top:24px">Volver a la Tienda</a></div>';
    return;
  }
  renderProduct();

  document.getElementById('addToCartBtn').addEventListener('click', addToCart);
  document.getElementById('buyNowBtn').addEventListener('click', buyNow);
}

document.addEventListener('DOMContentLoaded', initProduct);
