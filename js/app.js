console.log('Загрузка приложения погоды');

const weatherContainer = document.getElementById('weather');
const addCitySection = document.getElementById('addCity');

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

  data.daily.time.slice(0, 3).forEach((date, index) => {
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
 * Запрос геолокации
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position.coords),
      error => reject(error)
    );
  });
}

/**
 * Инициализация приложения
 */
async function initApp() {
  weatherContainer.innerHTML = '<p class="status">Определение местоположения...</p>';

  try {
    const coords = await getUserLocation();
    const data = await fetchWeather(coords.latitude, coords.longitude);
    renderWeather(data);
    addCitySection.style.display = 'none';
  } catch (error) {
    weatherContainer.innerHTML = '<p class="status">Геолокация недоступна</p>';
    addCitySection.style.display = 'block';
    console.warn('Геолокация отклонена');
  }
}

initApp();
