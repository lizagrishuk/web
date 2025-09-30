const prices = [1000, 2000];
let cart = {};

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  for (const id in cart) {
    const li = document.createElement('li');
    li.textContent = `${id} — ${cart[id]} шт`;
    cartItems.appendChild(li);
  }
}

function updateCartDisplay() {
  let cartCount = 0;
  let totalPrice = 0;
  for (const id in cart) {
    cartCount += cart[id];
    totalPrice += prices[parseInt(id.replace('product-', ''), 10) - 1] * cart[id];
  }
  document.getElementById('cartCount').textContent = 'Товаров в корзине: ' + cartCount;
  document.getElementById('cartTotal').textContent = 'Итого: ' + totalPrice + ' ₽';
  renderCart();
}

document.querySelectorAll('.btn-add').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const id = 'product-' + (index + 1);
    cart[id] = (cart[id] || 0) + 1;
    updateCartDisplay();
  });
});

document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  if (Object.keys(cart).length === 0) {
    alert('Корзина пуста!');
    return;
  }
  alert('Заказ создан!');
  cart = {};
  updateCartDisplay();
});
