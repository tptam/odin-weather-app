const key = "PAVSPUMM5PSLVSLQL6BZAXUV4";

async function getWeatherData(city, unit) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${key}&iconSet=icons2&contentType=json`,
    { mode: "cors" }
  );
  if (!response.ok) {
    throw new Error("Failed to retrieve data.");
  } else {
    return await response.json();
  }
}

function getAddress(json) {
  return json.resolvedAddress;
}

function getCurrentWeather(json) {
  const { datetimeEpoch, icon, conditions, temp, humidity, windspeed } =
    json.currentConditions;
  return {
    date: new Date(datetimeEpoch * 1000),
    icon,
    conditions,
    temp,
    humidity,
    windspeed,
  };
}

function getWeeklyForecast(json) {
  const week = json.days.slice(0, 7).map((day) => {
    const {
      datetimeEpoch,
      icon,
      conditions,
      temp,
      tempmax,
      tempmin,
      humidity,
      windspeed,
    } = day;
    return {
      date: new Date(datetimeEpoch * 1000),
      icon,
      conditions,
      temp,
      tempmax,
      tempmin,
      humidity,
      windspeed,
    };
  });
  return week;
}

function showError(message) {
  console.log(message);
}

// presentation
const current = {
  date: document.querySelector(".current .date"),
  icon: document.querySelector(".current .icon"),
  conditions: document.querySelector(".current div.conditions"),
  temp: document.querySelector(".current div.temp"),
  humidity: document.querySelector(".current div.humidity"),
  windspeed: document.querySelector(".current div.windspeed"),
};
const address = document.querySelector(".address");
const search = document.querySelector(".search");

async function updateScreen() {
  const json = await getWeatherData("tokushima", "metric");
  address.textContent = getAddress(json);
  const curData = getCurrentWeather(json);
  current.date.textContent = curData.date.toLocaleString("sv-SE").slice(0, -3);
  current.conditions.textContent = curData.conditions;
  current.temp.textContent = curData.temp;
  current.humidity.textContent = curData.humidity;
  current.windspeed.textContent = curData.windspeed;
}

function formatDate(date) {}

updateScreen().catch((error) => console.error(error));
