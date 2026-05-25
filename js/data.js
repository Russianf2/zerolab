let products = [];

async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    products = await res.json();
    return products;
  } catch (e) {
    console.error('Error loading products:', e);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
