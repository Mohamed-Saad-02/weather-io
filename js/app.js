"use strict";
import { fetchData, url } from "./api.js";
import {
  addClassName,
  removeClassName,
  monthNames,
  weekDayNames,
  getDate,
  getHours,
} from "./helper.js";

const spinner = document.getElementById("spinner");

// Active Input Search ----> Header Section <----
const iconSearch = document.getElementById("iconSearch"),
  iconClose = document.getElementById("iconClose"),
  searchContainer = document.querySelector(".search.box");

iconSearch.addEventListener("click", () =>
  addClassName(searchContainer, "active")
);
iconClose.addEventListener("click", () =>
  removeClassName(searchContainer, "active")
);

// fetch Data From API by Input

const searchParent = document.getElementById("searchParent");
const inputSearch = document.getElementById("searchLocation");

inputSearch.addEventListener("focus", (e) => {
  if (e.target.value.length > 2) addClassName(searchParent, "show-list");
});

inputSearch.addEventListener("blur", () => {
  if (inputSearch.value.length <= 2) removeClassName(searchParent, "show-list");
});

let controller = new AbortController();

inputSearch.addEventListener("input", (e) => {
  const value = e.target.value;
  if (value.length <= 2) {
    removeClassName(searchParent, "show-list");
    return;
  } else addClassName(searchParent, "show-list");

  // Canceled old request
  controller.abort();
  controller = new AbortController();

  async function getData() {
    try {
      const res = await fetch(url.searchGeo(value), {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Something went wrong with fetching movies");

      const data = await res.json();

      handleDisplayData(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  getData();
});

// Display Data in Tag ul

const listUl = document.getElementById("list");

/**
 * @param {Array} data come by API from function getData in inputSearch => event input
 */
function handleDisplayData(data) {
  listUl.innerHTML = "";

  for (const [index, city] of data.entries()) {
    if (index > 5) return;
    const { lat, lon, name, country } = city;

    const listItem = document.createElement("li");
    listItem.className = "list-item flex items-center justify-between gap-12";
    listItem.dataset.location = `${lat},${lon}`;

    listItem.innerHTML = `
    <div class="icon flex items-center gap-12">
      <i class="fa-solid fa-location-dot"></i>
      <div class="item-name">
      <p class="color-white">${name}</p>
      <span>${country}</span>
      </div>
    </div>
    <div class="image flex-1 flex items-center justify-end">
      <img src="https://www.countryflags.com/wp-content/uploads/${country
        .split(" ")
        .join("-")
        .toLowerCase()}-flag-png-large.png" loading="lazy" width="30" />
    </div>
    `;
    listUl.appendChild(listItem);

    listItem.addEventListener("click", (e) => {
      const current = e.currentTarget;
      const location = current.dataset.location;

      updateWeather(...location.split(","));
      inputSearch.value = "";
      removeClassName(searchParent, "show-list");
    });
  }
}

// Get Current Location Of User
const locationUser = {};
const currentLocationBtn = document.getElementById("currentLocation");
currentLocationBtn.addEventListener("click", currentLocation);
function currentLocation() {
  navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;

      locationUser.latitude = latitude;
      locationUser.longitude = longitude;

      updateWeather(latitude, longitude);
    },
    (err) => {
      console.log(err.message);
      // Default Location
      updateWeather(51.52, -0.11);
    }
  );
}
currentLocation();

// Get Data From API and Display
const currentWebsiteSection = document.getElementById("currentWebsite");
const highlights = document.getElementById("highlights");
const hourlyForecast = document.getElementById("hourlyForecast");
const forecastSection = document.getElementById("forecastSection");

/**
 * Render all weather data in html
 * @param {Number} lat Latitude
 * @param {Number} lon Longitude
 */

function updateWeather(lat, lon) {
  if (locationUser.latitude != lat && locationUser.longitude != lon)
    document
      .querySelector(".current-location button")
      .removeAttribute("disabled");
  else
    document
      .querySelector(".current-location button")
      .setAttribute("disabled", "");

  /**
   * current weather section
   */
  fetchData(url.forecast(lat, lon, "days=5"), function (currentWeather) {
    addClassName(document.querySelector("main"), "hidden");
    addClassName(spinner, "active");

    currentWebsiteSection.innerHTML = "";
    highlights.innerHTML = "";
    hourlyForecast.innerHTML = "";
    forecastSection.innerHTML = "";

    const {
      current: {
        condition: { icon, text },
        temp_c: temp,
        pressure_mb: pressure,
        humidity,
        feelslike_c: feels_like,
        vis_km: visibility,
        air_quality: { no2, o3, so2, pm2_5 },
      },
      location: { name, localtime, country },
      forecast: { forecastday } = {},
    } = currentWeather;

    const { astro: { sunrise, sunset } = {}, hour = [] } = forecastday[0];

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
     <h2 class="title-2">Now</h2>
     <div class="wrapper flex items-center">
       <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
       <img
         src="${icon}"
         alt="${text}"
         width="100"
         height="100"
         class="mx-auto"
       />
     </div>
     <p class="body-3">${text}</p>
     <ul class="meta-list">
       <li class="flex items-center gap-12">
         <i class="fa-regular fa-calendar color-white"></i>
         <span>${getDate(localtime)}</span>
       </li>
       <li class="flex items-center gap-12">
         <div class="flex items-center gap-12">
          <i class="fa-solid fa-location-dot color-white"></i>
          <span data-location>${name}, ${country}</span>
         </div>
         <div class="flex-1 flex items-center justify-end">
         <img src="https://www.countryflags.com/wp-content/uploads/${country
           .split(" ")
           .join("-")
           .toLowerCase()}-flag-png-large.png" loading="lazy" width="30" />
         </div>
       </li>
     </ul>   
    `;

    currentWebsiteSection.appendChild(card);

    /**
     * today's Highlights Section
     */

    const cardHighlights = document.createElement("div");
    cardHighlights.className = "card";

    cardHighlights.innerHTML = `
              <div class="title-2">Todays Highlights</div>
              <div class="highlight-list gap-20">
                <div
                  class="card card-sm highlight-card one flex flex-column position-relative"
                >
                  <h3 class="title-3">Air Quality Index</h3>
                  <div class="flex items-center justify-between gap-16 flex-1">
                    <div class="icon">
                      <i class="fa-solid fa-wind"></i>
                    </div>
                    <ul class="card-list flex items-center flex-1 flex-wrap">
                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(pm2_5).toFixed(1)}</p>
                        <p class="label-1">PM<sub>2.5</sub></p>
                      </li>

                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(so2).toFixed(1)}</p>
                        <p class="label-1">SO<sub>2</sub></p>
                      </li>

                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(no2).toFixed(1)}</p>
                        <p class="label-1">NO<sub>2</sub></p>
                      </li>

                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(o3).toFixed(1)}</p>
                        <p class="label-1">O<sub>3</sub></p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card two flex flex-column position-relative"
                >
                  <h3 class="title-3">Sunrise & Sunset</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="sunrise flex items-center flex-1 gap-20">
                      <i class="fa-regular fa-sun"></i>
                      <div class="info">
                        <div class="label-1">Sunrise</div>
                        <div class="title-1">${sunrise}</div>
                      </div>
                    </div>
                    <div class="sunset flex items-center flex-1 gap-20">
                      <i class="fa-regular fa-moon"></i>
                      <div class="info">
                        <div class="label-1">Sunset</div>
                        <div class="title-1">${sunset}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Humidity</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <img
                        src="./images/humidity.png"
                        alt="humidity"
                        width="40"
                        height="40"
                      />
                    </div>
                    <p class="title-1">${humidity}<sub>%</sub></p>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Pressure</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <img
                        src="./images/pressure.png"
                        alt="pressure"
                        width="40"
                        height="40"
                      />
                    </div>
                    <p class="title-1">${pressure}<sub>hpa</sub></p>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Visibility</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <i class="fa-solid fa-eye"></i>
                    </div>
                    <p class="title-1">${visibility}<sub>km</sub></p>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Feels Like</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <img
                        src="./images/temperature.png"
                        alt="temperature"
                        width="40"
                        height="40"
                      />
                    </div>
                    <p class="title-1">${parseInt(
                      feels_like
                    )}&deg;<sup>c</sup></p>
                  </div>
                </div>
              </div>
      `;

    highlights.appendChild(cardHighlights);

    /**
     * forecast Section
     */

    hourlyForecast.innerHTML = `
          <h2 class="title-2">Today at</h2>
          <div class="slider-container">
            <ul class="slider-list flex items-center gap-20" data-temp></ul>
            <ul class="slider-list flex items-center gap-20" data-wind></ul>
          </div>
      `;

    for (let i = 3; i < hour.length; i += 3) {
      const {
        condition: { icon, text },
        temp_c: temp,
        time_epoch: dateUnix,
        wind_degree: windDirection,
        wind_kph: windSpeed,
      } = hour[i];

      const tempLi = document.createElement("li");
      tempLi.className = "slider-item flex-1";

      tempLi.innerHTML = `
          <div class="card slider-card flex flex-column items-center">
            <p class="body-3">${getHours(dateUnix)}</p>
            <img
              src="${icon}"
              title="${text}"
              alt="${text}"
              width="80"
              height="80"
              loading="lazy"
              class="weather-icon"
            />
            <p class="body-3">${parseInt(temp)}&deg;</p>
          </div>
        `;

      hourlyForecast.querySelector("[data-temp]").appendChild(tempLi);

      const windLi = document.createElement("li");
      windLi.className = "slider-item flex-1";

      windLi.innerHTML = `
          <div class="card slider-card flex flex-column items-center">
            <p class="body-3">${getHours(dateUnix)}</p>
            <div class="icon flex items-center justify-center">
              <img
              src="./images/direction.png"
              title="Air Direction"
              alt="Air Direction"
              width="48"
              height="48"
              loading="lazy"
              class="weather-icon direction"
              style="transform: rotate(${windDirection - 180}deg);"
              />
            </div>
            <p class="body-3">${parseInt(windSpeed)}/h</p>
          </div>
        `;
      hourlyForecast.querySelector("[data-wind]").appendChild(windLi);
    }

    forecastSection.innerHTML = `
        <h2 class="title-2">5 Days Forecast</h2>
        <div class="card">
          <ul data-forecast-list></ul>
        </div>
      `;

    for (const data of forecastday) {
      const {
        date_epoch: dt_unix,
        day: {
          condition: { icon, text },
          maxtemp_c: temp_max,
        },
      } = data;

      const date = new Date(dt_unix * 1000);

      const li = document.createElement("li");
      li.className = "card-item flex items-center";

      li.innerHTML = `
          <div class="icon flex items-center">
            <img
              src="${icon}"
              alt="${text}"
              width="60"
              height="60"
              title="${text}"
              loading="lazy"
            />
            <span class="degree">${parseInt(temp_max)}&deg;</span>
          </div>
          <p class="flex-1 text-right">${date.getDate()} ${
        monthNames[date.getMonth()]
      }</p>
          <p class="flex-1 text-right">${weekDayNames[date.getDay()]}</p>
        `;

      forecastSection.querySelector("[data-forecast-list]").appendChild(li);
    }

    removeClassName(document.querySelector("main"), "hidden");
    setTimeout(() => {
      removeClassName(spinner, "active");
    }, 500);
  });
}
