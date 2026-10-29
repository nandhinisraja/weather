// 1. Paste your OpenWeatherMap API key here (https://home.openweathermap.org/api_keys)
const API_KEY = "YOUR_API_KEY_HERE";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// 2. Grab DOM elements
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const message = document.getElementById("message");
const card = document.getElementById("weather-card");

const cityName = document.getElementById("city-name");
const condition = document.getElementById("condition");
const icon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feels-like");
const wind = document.getElementById("wind");

// 3. Helpers
function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "Loading..." : "Search";
}

// 4. Fetch weather data (Fetch API + JSON parsing)
async function fetchWeather(city) {
  const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const data = await response.json(); // parse the JSON body

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found. Check the spelling and try again.");
    }
    if (response.status === 401) {
      throw new Error("Invalid API key. New keys can take up to 2 hours to activate.");
    }
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

// 5. Update the DOM with the parsed JSON
function displayWeather(data) {
  const weather = data.weather[0];

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  condition.textContent = weather.description;
  icon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  icon.alt = weather.main;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  wind.textContent = `${data.wind.speed} m/s`;

  card.classList.remove("hidden");
  showMessage("");
}

// 6. Handle the search
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Please enter a city name.", true);
    return;
  }
  if (API_KEY === "YOUR_API_KEY_HERE") {
    showMessage("Add your OpenWeatherMap API key in script.js first.", true);
    return;
  }

  setLoading(true);
  showMessage("Fetching weather...");
  card.classList.add("hidden");

  try {
    const data = await fetchWeather(city);
    displayWeather(data);
  } catch (error) {
    const offline = error instanceof TypeError;
    showMessage(offline ? "Network error. Check your internet connection." : error.message, true);
  } finally {
    setLoading(false);
  }
});