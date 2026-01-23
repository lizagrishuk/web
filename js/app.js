// Получение элементов DOM
const weatherContainer = document.getElementById('weather');
const addCitySection = document.getElementById('addCity');
const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');
const citiesContainer = document.getElementById('cities');
const suggestionsContainer = document.getElementById('suggestions');
const errorMessage = document.querySelector('#addCity .error');
const refreshBtn = document.getElementById('refreshBtn');

// Ключ localStorage
const STORAGE_KEY = 'weather_app_data';

// Состояние приложения
let cities = [];
let currentCity = null;
let userLocation = null;

// Сохранение данных
function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      cities,
      currentCity,
      userLocation
    })
  );
}

// Загрузка данных
function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!data) return;

  cities = data.cities || [];
  currentCity = data.currentCity || null;
  userLocation = data.userLocation || null;
}

// Получение погоды
async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&forecast_days=3` +
    `&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) throw new Error();

  return response.json();
}

// Геокодинг городов
async function searchCity(name) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(name)}&count=5&language=ru`;

  const response = await fetch(url);
  if (!response.ok) throw new Error();

  return response.json();
}

// Статус загрузки
function showLoading(text) {
  weatherContainer.textContent = '';
  const p = document.createElement('p');
  p.className = 'status';
  p.textContent = text;
  weatherContainer.appendChild(p);
}

// Ошибка
function showError(text) {
  weatherContainer.textContent = '';
  const p = document.createElement('p');
  p.className = 'error';
  p.textContent = text;
  weatherContainer.appendChild(p);
}

// Отображение погоды
function renderWeather(data) {
  weatherContainer.textContent = '';

  for (let i = 0; i < 3; i++) {
    const day = document.createElement('div');
    day.className = 'day';

    const img = document.createElement('img');
    const maxTemp = data.daily.temperature_2m_max[i];

    if (maxTemp >= 25) img.src = 'icons/sun.png';
    else if (maxTemp >= 15) img.src = 'icons/cloud.png';
    else img.src = 'icons/rain.png';

    img.alt = 'Погода';

    const info = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = data.daily.time[i];

    const max = document.createElement('p');
    max.textContent = `Максимум: ${data.daily.temperature_2m_max[i]} °C`;

    const min = document.createElement('p');
    min.textContent = `Минимум: ${data.daily.temperature_2m_min[i]} °C`;

    info.appendChild(title);
    info.appendChild(max);
    info.appendChild(min);

    day.appendChild(img);
    day.appendChild(info);
    weatherContainer.appendChild(day);
  }
}

// Кнопки городов
function renderCityButtons() {
  citiesContainer.textContent = '';

  cities
    .filter(city => city && city.name)
    .forEach(city => {
      const btn = document.createElement('button');
      btn.textContent = city.name;
      btn.addEventListener('click', () => loadCityWeather(city));
      citiesContainer.appendChild(btn);
    });
}

// Загрузка погоды города
async function loadCityWeather(city) {
  currentCity = city;
  saveData();

  showLoading('Загрузка погоды...');

  try {
    const data = await fetchWeather(city.lat, city.lon);
    renderWeather(data);
  } catch {
    showError('Ошибка загрузки погоды');
  }
}

// Автодополнение
cityInput.addEventListener('input', async () => {
  const value = cityInput.value.trim();
  suggestionsContainer.textContent = '';
  errorMessage.textContent = '';

  if (!value) return;

  try {
    const data = await searchCity(value);
    if (!data.results) return;

    data.results.forEach(item => {
      const div = document.createElement('div');
      div.textContent = `${item.name}, ${item.country}`;
      div.addEventListener('click', () => {
        cityInput.value = item.name;
        suggestionsContainer.textContent = '';
      });
      suggestionsContainer.appendChild(div);
    });
  } catch {}
});

// Добавление города
addCityBtn.addEventListener('click', async () => {
  const name = cityInput.value.trim();
  errorMessage.textContent = '';

  if (!name) return;

  try {
    const data = await searchCity(name);
    if (!data.results || data.results.length === 0) {
      errorMessage.textContent = 'Город не найден';
      return;
    }

    const city = data.results[0];
    const cityData = {
      name: city.name,
      lat: city.latitude,
      lon: city.longitude
    };

    if (!cities.find(c => c.name === cityData.name)) {
      cities.push(cityData);
      saveData();
      renderCityButtons();
    }

    cityInput.value = '';
    suggestionsContainer.textContent = '';
  } catch {
    errorMessage.textContent = 'Ошибка поиска города';
  }
});

// Геолокация
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      () => reject(),
      { timeout: 10000 }
    );
  });
}

// Обновить
refreshBtn.addEventListener('click', async () => {
  if (currentCity) {
    loadCityWeather(currentCity);
    return;
  }

  showLoading('Определение местоположения...');

  try {
    const coords = await getUserLocation();
    const data = await fetchWeather(coords.latitude, coords.longitude);
    renderWeather(data);
  } catch {
    showError('Геолокация недоступна');
  }
});

// Инициализация
async function initApp() {
  loadData();
  addCitySection.style.display = 'block';
  renderCityButtons();

  showLoading('Определение местоположения...');

  try {
    const coords = await getUserLocation();

    userLocation = {
      lat: coords.latitude,
      lon: coords.longitude
    };

    const locationCity = {
      name: 'Текущее местоположение',
      lat: userLocation.lat,
      lon: userLocation.lon
    };

    if (!cities.find(c => c.name === locationCity.name)) {
      cities.unshift(locationCity);
    }

    currentCity = locationCity;
    saveData();
    renderCityButtons();

    const data = await fetchWeather(locationCity.lat, locationCity.lon);
    renderWeather(data);
  } catch {
    showError('Геолокация недоступна');
  }
}

// Запуск
initApp();
