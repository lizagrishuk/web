console.log('Загрузка приложения погоды');

const weatherContainer = document.getElementById('weather');
const addCitySection = document.getElementById('addCity');
const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');
const citiesContainer = document.getElementById('cities');

let cities = []; // список городов с координатами

/**
 * Простейший справочник городов с координатами (для теста)
 */
const cityCoordinates = {
  "Минск": { lat: 53.9, lon: 27.5667 },
  "Москва": { lat: 55.7558, lon: 37.6173 },
  "Лондон": { lat: 51.5074, lon: -0.1278 },
  "Варшава": { lat: 52.2297, lon: 21.0122 },
  "Берлин": { lat: 52.52, lon: 13.405 }
};

/**
 * Получение прогноза погоды
 */
async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) throw new Error('Ошибка при загрузке погоды');
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
 * UI состояния
 */
function showLoading(message = 'Загрузка...') {
  weatherContainer.innerHTML = `<p class="status">${message}</p>`;
}

function showError(message = 'Ошибка загрузки данных') {
  weatherContainer.innerHTML = `<p class="error">${message}</p>`;
}

/**
 * Добавление кнопок городов
 */
function renderCityButtons() {
  citiesContainer.innerHTML = '';
  cities.forEach(city => {
    const btn = document.createElement('button');
    btn.textContent = city;
    btn.onclick = () => loadCityWeather(city);
    citiesContainer.appendChild(btn);
  });
}

/**
 * Загрузка погоды для выбранного города
 */
async function loadCityWeather(cityName) {
  const coords = cityCoordinates[cityName];
  if (!coords) {
    showError('Город не найден');
    return;
  }

  showLoading(`Загрузка погоды для ${cityName}...`);
  try {
    const data = await fetchWeather(coords.lat, coords.lon);
    renderWeather(data);
  } catch (error) {
    showError('Ошибка загрузки данных');
    console.error(error);
  }
}

/**
 * Добавление города
 */
addCityBtn.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  if (!cityCoordinates[cityName]) {
    alert('Город не найден в базе');
    return;
  }
  if (!cities.includes(cityName)) {
    cities.push(cityName);
    renderCityButtons();
    cityInput.value = '';
  }
});

/**
 * Геолокация
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
 * Инициализация
 */
async function initApp() {
  showLoading('Определение местоположения...');

  try {
    const coords = await getUserLocation();
    showLoading('Загрузка погоды...');
    const data = await fetchWeather(coords.latitude, coords.longitude);
    renderWeather(data);
    addCitySection.style.display = 'block';
  } catch (error) {
    showError('Геолокация недоступна');
    addCitySection.style.display = 'block';
    console.warn('Геолокация отклонена или ошибка загрузки', error);
  }
}

initApp();
