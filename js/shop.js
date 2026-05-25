let filteredProducts = [];
let selectedCategories = [];
let selectedPriceRanges = [];
let currentSort = 'default';
let searchQuery = '';
let wishlist = [];
let isWishlistMode = false;

const priceRanges = [
  { label: 'Menos de $100,000', min: 0, max: 100000 },
  { label: '$100,000 - $250,000', min: 100000, max: 250000 },
  { label: '$250,000 - $400,000', min: 250000, max: 400000 },
  { label: '$400,000 - $600,000', min: 400000, max: 600000 },
  { label: 'Más de $600,000', min: 600000, max: Infinity }
];

function initFilters() {
  const cats = [...new Set(products.map(p => p.category))];
  const catContainer = document.getElementById('categoryFilters');
  catContainer.innerHTML = cats.map(c => `
    <label class="filter-option">
      <input type="checkbox" value="${c}" onchange="toggleCategory('${c}')">
      ${c}
      <span class="filter-count">(${products.filter(p => p.category === c).length})</span>
    </label>
  `).join('');

  const priceContainer = document.getElementById('priceFilters');
  priceContainer.innerHTML = priceRanges.map((r, i) => `
    <label class="filter-option">
      <input type="checkbox" value="${i}" onchange="togglePriceRange(${i})">
      ${r.label}
    </label>
  `).join('');
}

function toggleCategory(cat) {
  const idx = selectedCategories.indexOf(cat);
  if (idx > -1) selectedCategories.splice(idx, 1);
  else selectedCategories.push(cat);
  filterAndRender();
}

function togglePriceRange(idx) {
  const i = selectedPriceRanges.indexOf(idx);
  if (i > -1) selectedPriceRanges.splice(i, 1);
  else selectedPriceRanges.push(idx);
  filterAndRender();
}

function clearFilters() {
  selectedCategories = [];
  selectedPriceRanges = [];
  searchQuery = '';
  document.querySelectorAll('#categoryFilters input, #priceFilters input').forEach(cb => cb.checked = false);
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';
  filterAndRender();
}

function applyFilters() {
  let result = [...products];

  if (selectedCategories.length) {
    result = result.filter(p => selectedCategories.includes(p.category));
  }

  if (selectedPriceRanges.length) {
    result = result.filter(p => {
      return selectedPriceRanges.some(idx => {
        const range = priceRanges[idx];
        return p.price >= range.min && p.price <= range.max;
      });
    });
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  const sort = document.getElementById('sortSelect')?.value || 'default';
  switch (sort) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    case 'newest': result.sort((a, b) => b.id - a.id); break;
  }

  filteredProducts = result;
  return result;
}

function renderProducts(productsToRender) {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('productCount');

  if (!grid) return;

  if (!productsToRender.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    count.textContent = '0 productos';
    return;
  }

  empty.style.display = 'none';
  count.textContent = `${productsToRender.length} producto${productsToRender.length > 1 ? 's' : ''}`;

  grid.innerHTML = productsToRender.map(p => {
    const inWishlist = wishlist.includes(p.id);
    const color = p.isVariable && p.variations ? p.variations[0].hex : '1A1A1A';
    return `
      <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist(${p.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWishlist ? '#fff' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div class="product-card-image">
          ${generateProductSVG(p.name, p.category, '#' + color)}
        </div>
        <div class="product-card-body">
          <div class="product-card-category">${p.category}</div>
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price">${formatCOP(p.price)}</div>
          <div class="product-card-rating">
            <span>★</span>
            <span>${p.rating}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterAndRender() {
  if (isWishlistMode) {
    wishlist = getWishlist();
    const items = products.filter(p => wishlist.includes(p.id));
    renderProducts(items);
    return;
  }
  searchQuery = document.getElementById('searchInput')?.value || '';
  const result = applyFilters();
  renderProducts(result);
}

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) wishlist.splice(idx, 1);
  else wishlist.push(id);
  setWishlist(wishlist);
  filterAndRender();
}

async function initShop() {
  wishlist = getWishlist();
  await loadProducts();
  initFilters();

  const params = new URLSearchParams(window.location.search);
  if (params.get('category')) {
    const cat = params.get('category');
    selectedCategories = [cat];
    document.querySelectorAll('#categoryFilters input').forEach(cb => {
      if (cb.value === cat) cb.checked = true;
    });
    document.getElementById('shopTitle').textContent = cat;
  }
  if (params.get('sort') === 'newest') {
    document.getElementById('sortSelect').value = 'newest';
  }
  if (params.get('wishlist')) {
    isWishlistMode = true;
    document.getElementById('shopTitle').textContent = 'Favoritos';
    document.querySelector('.shop-controls').style.display = 'none';
  }

  document.getElementById('searchInput')?.addEventListener('input', filterAndRender);
  filterAndRender();
}

document.addEventListener('DOMContentLoaded', initShop);
