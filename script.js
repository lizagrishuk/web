let cartCount = 0;
let totalPrice = 0;
const prices = [1000, 2000]; // Цены товаров 1 и 2

function updateCartDisplay() {
  document.getElementById('cartCount').textContent = 'Товаров в корзине: ' + cartCount;
  document.getElementById('cartTotal').textContent = 'Итого: ' + totalPrice + ' ₽';
}

document.querySelectorAll('.btn-add').forEach((button, index) => {
  button.addEventListener('click', () => {
    cartCount++;
    totalPrice += prices[index];
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
  cartCount = 0;
  totalPrice = 0;
  updateCartDisplay();
});

