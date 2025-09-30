// Начальное кол-во торваров
let cartCount = 0;

// Добавляем обработчик на каждую кнопку "Добавить в корзину"
document.querySelectorAll('.btn-add').forEach(button => {
  button.addEventListener('click', () => {
    cartCount++;
    alert('Товар добавлен в корзину. Сейчас в корзине: ' + cartCount);
  });
});

// Обработка отправки формы заказа
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault(); // Отменяем стандартное поведение формы

  if (cartCount === 0) {
    alert('Корзина пуста. Добавьте хотя бы один товар.');
    return;
  }

  document.getElementById('orderMessage').textContent = 'Заказ создан!';
  cartCount = 0;  // Очистка корзины
});
