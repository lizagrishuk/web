console.log('Загрузка приложения погоды');

const weatherContainer = document.getElementById('weather');
const addCitySection = document.getElementById('addCity');
const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');
const citiesContainer = document.getElementById('cities');
const suggestionsContainer = document.getElementById('suggestions');
const errorMessage = document.querySelector('#addCity .error');

const STORAGE_KEY = 'weather_app_data';
let cities = [];
let currentCity = null;

const cityCoordinates = {
  "Минск": { lat: 53.9, lon: 27.5667 },
  "Москва": { lat: 55.7558, lon: 37.6173 },
  "Лондон": { lat: 51.5074, lon: -0.1278 },
  "Варшава": { lat: 52.2297, lon: 21.0122 },
  "Берлин": { lat: 52.52, lon: 13.405 }
};

/**
 * LocalStorage
 */
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    cities,
    currentCity
  }));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data) {
    cities = data.cities || [];
    currentCity = data.currentCity || null;
  }
}

/**
 * Получение прогноза
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
 * Кнопки городов
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
  currentCity = cityName;
  saveData();
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
 * Автодополнение и валидация
 */
cityInput.addEventListener('input', () => {
  const query = cityInput.value.trim().toLowerCase();
  suggestionsContainer.innerHTML = '';
  errorMessage.textContent = '';

  if (!query) return;

  const matches = Object.keys(cityCoordinates).filter(city =>
    city.toLowerCase().includes(query)
  );

  matches.forEach(city => {
    const div = document.createElement('div');
    div.textContent = city;
    div.onclick = () => {
      cityInput.value = city;
      suggestionsContainer.innerHTML = '';
    };
    suggestionsContainer.appendChild(div);
  });
});

/**
 * Добавление города
 */
addCityBtn.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  if (!cityCoordinates[cityName]) {
    errorMessage.textContent = 'Город не найден';
    return;
  }
  if (!cities.includes(cityName)) {
    cities.push(cityName);
    renderCityButtons();
    saveData();
  }
  cityInput.value = '';
  suggestionsContainer.innerHTML = '';
  errorMessage.textContent = '';
});

/**
 * Геолокация
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err)
    );
  });
}

/**
 * Инициализация
 */
async function initApp() {
  loadData();
  addCitySection.style.display = 'block';

  if (currentCity) {
    loadCityWeather(currentCity);
    renderCityButtons();
    return;
  }

  showLoading('Определение местоположения...');
  try {
    const coords = await getUserLocation();
    showLoading('Загрузка погоды...');
    const data = await fetchWeather(coords.latitude, coords.longitude);
    renderWeather(data);
    currentCity = null;
    saveData();
  } catch (error) {
    showError('Геолокация недоступна');
    console.warn('Геолокация отклонена или ошибка загрузки', error);
  }
}

initApp();

// Кнопка "Обновить"
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', async () => {
  if (currentCity) {
    // Если выбран город из списка
    loadCityWeather(currentCity);
  } else {
    // Если нет города — используем геолокацию
    showLoading('Определение местоположения...');
    try {
      const coords = await getUserLocation();
      showLoading('Загрузка погоды...');
      const data = await fetchWeather(coords.latitude, coords.longitude);
      renderWeather(data);
    } catch (error) {
      showError('Геолокация недоступна');
      console.warn(error);
    }
  }
});
