const apiKey = "2f5513f6ad9d9f27897a23a6a32fc28f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const bgImage = document.querySelector(".bg-image");
if (bgImage.complete) {
  bgImage.classList.add("loaded");
} else {
  bgImage.addEventListener("load", () => {
    bgImage.classList.add("loaded");
  });
}

const searchBox = document.querySelector(".input-wrapper input");
const searchBtn = document.querySelector(".search-btn");
const clearBtn = document.querySelector(".clear-btn");
const inputWrapper = document.querySelector(".input-wrapper");
const weatherIcon = document.querySelector(".weather-icon");
const welcomeMessage = document.querySelector(".welcome-message");
const cardsContainer = document.querySelector(".cards-container");

async function checkWeather(city) {
  welcomeMessage.style.display = "none";
  cardsContainer.style.display = "flex";

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";

    const { lat, lon } = data.coord;
    const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const aqiData = await aqiResponse.json();
    const aqiLevels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.querySelector(".aqi").textContent = aqiLevels[aqiData.list[0].main.aqi];

    const weatherMain = data.weather[0].main;
    const icons = {
      Clouds: "clouds.png",
      Clear: "clear.png",
      Rain: "rain.png",
      Drizzle: "drizzle.png",
      Mist: "mist.png",
    };
    weatherIcon.src = "images/" + (icons[weatherMain] || "clear.png");

    document.querySelector(".error").style.display = "none";
  } catch (err) {
    document.querySelector(".error").style.display = "block";
    cardsContainer.style.display = "none";
  }
}


searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (!city) {
    document.querySelector(".error").style.display = "block";
    cardsContainer.style.display = "none";
    return;
  }
  checkWeather(city);
});

searchBox.addEventListener("keyup", (e) => e.key === "Enter" && searchBtn.click());
searchBox.addEventListener("input", () => inputWrapper.classList.toggle("has-text", searchBox.value.length > 0));
clearBtn.addEventListener("click", () => {
  searchBox.value = "";
  inputWrapper.classList.remove("has-text");
  searchBox.focus();
});
