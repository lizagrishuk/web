console.log('Загрузка приложения погоды');

const weatherContainer = document.getElementById('weather');

/**
 * Получение прогноза погоды по координатам
 */
async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Ошибка при загрузке погоды');
  }

  return response.json();
}

/**
 * Отображение прогноза (3 дня)
 */
function renderWeather(data) {
  weatherContainer.innerHTML = '';

  const days = data.daily.time.slice(0, 3);

  days.forEach((date, index) => {
    const dayElement = document.createElement('div');

    dayElement.innerHTML = `
      <h3>${date}</h3>
      <p>Максимум: ${data.daily.temperature_2m_max[index]} °C</p>
      <p>Минимум: ${data.daily.temperature_2m_min[index]} °C</p>
    `;

    weatherContainer.appendChild(dayElement);
  });
}

/**
 * Тестовая загрузка погоды (Минск)
 */
async function loadTestWeather() {
  weatherContainer.innerHTML = '<p class="status">Загрузка погоды...</p>';

  try {
    const data = await fetchWeather(53.9, 27.56);
    renderWeather(data);
  } catch (error) {
    weatherContainer.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
    console.error(error);
  }
}

loadTestWeather();

