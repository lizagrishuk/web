const prices = [1000, 2000];
let cart = {};

let cartCount = 0;
let totalPrice = 0;

function updateCartDisplay() {
  cartCount = 0;
  totalPrice = 0;
  for (const id in cart) {
    cartCount += cart[id];
    totalPrice += prices[parseInt(id.replace('product-', ''), 10) - 1] * cart[id];
  }
  document.getElementById('cartCount').textContent = 'Товаров в корзине: ' + cartCount;
  document.getElementById('cartTotal').textContent = 'Итого: ' + totalPrice + ' ₽';
}

document.querySelectorAll('.btn-add').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const id = 'product-' + (index + 1);
    cart[id] = (cart[id] || 0) + 1;
    updateCartDisplay();
    alert('Товар добавлен в корзину. Сейчас в корзине: ' + cartCount);
  });
});

document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  if (cartCount === 0) {
    alert('Корзина пуста. Добавьте хотя бы один товар.');
    return;
  }
  document.getElementById('orderMessage').textContent = 'Заказ создан!';
  cart = {};
  updateCartDisplay();
});
