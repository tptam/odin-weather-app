const key = "PAVSPUMM5PSLVSLQL6BZAXUV4";

async function getWeatherData(city, unit) {
  //   const response = await fetch(
  //     `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${key}&iconSet=icons2&contentType=json`,
  //     { mode: "cors" }
  //   );
  const response = await fetch("./dummy.json");
  throw new Error("failed to retrieve data.");

  if (!response.ok) {
    throw new Error("failed to retrieve data.");
  } else {
    return await response.json();
  }
}

function getAddress(json) {
  return json.resolvedAddress;
}

function getCurrentWeather(json) {
  const date = json.days[0].datetime;
  const time = json.currentConditions.datetime;
  const { icon, conditions, temp, humidity, windspeed } =
    json.currentConditions;
  return {
    date,
    time,
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
      datetime,
      icon,
      conditions,
      temp,
      tempmax,
      tempmin,
      humidity,
      windspeed,
      precipprob,
    } = day;
    return {
      date: datetime,
      icon,
      conditions,
      temp,
      tempmax,
      tempmin,
      humidity,
      windspeed,
      precipprob,
    };
  });
  return week;
}

function getSkyColor(json) {
  const sunrise = new Date(json.days[0].sunriseEpoch * 1000);
  const sunset = new Date(json.days[0].sunsetEpoch * 1000);
  const cloudcover = json.currentConditions.cloudcover;
  console.log(cloudcover);
  const now = new Date();
  const hourInMillisec = 3600000;
  if (Math.abs(now - sunrise) < 3600000 || Math.abs(now - sunset) < 3600000) {
    return "orange";
  } else if (now > sunrise && now < sunset) {
    return cloudcover > 75 ? "gray" : "blue";
  } else {
    return "black";
  }
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

const week = {
  date: document.querySelectorAll(".week tr.date th[scope]"),
  icon: document.querySelectorAll(".week tr.icon img"),
  tempmax: document.querySelectorAll(".week tr.temp .max"),
  tempmin: document.querySelectorAll(".week tr.temp .min"),
  humidity: document.querySelectorAll(".week tr.humidity td"),
  windspeed: document.querySelectorAll(".week tr.windspeed td"),
};

const body = document.querySelector("body");
const content = document.querySelector("#content");
const error = document.querySelector("#error");
const address = document.querySelector(".address");
const search = document.querySelector("#search");
const celsius = document.querySelector("#celsius");
const fahrenheit = document.querySelector("#fahrenheit");
const form = document.querySelector("form");
const loading = document.querySelector("dialog");

function getTempExpression(tempInC) {
  if (celsius.checked) {
    return `${tempInC} °C`;
  } else {
    return `${Math.round(10 * (tempInC * 1.8 + 32)) / 10} °F`;
  }
}

function switchTempUnit() {
  const curData = getCurrentWeather(json);
  current.temp.textContent = getTempExpression(curData.temp);
  const weekData = getWeeklyForecast(json);
  weekData.forEach((day, index) => {
    week.tempmax[index].textContent = getTempExpression(day.tempmax);
    week.tempmin[index].textContent = getTempExpression(day.tempmin);
  });
}

function showError(message) {
  error.querySelector(".error-message").textContent = "Error: " + message;
  loading.close();
  content.hidden = true;
  error.hidden = false;
}

function hideError() {
  error.querySelector(".error-message").textContent = "";
  content.hidden = false;
  error.hidden = true;
}

async function updateScreen() {
  loading.showModal();
  json = await getWeatherData(search.value, "metric");
  loading.close();
  hideError();

  body.setAttribute("data-sky", getSkyColor(json));
  address.textContent = getAddress(json);

  //   current weather
  const curData = getCurrentWeather(json);
  current.date.textContent = `${curData.date} ${curData.time.slice(0, -3)}`;
  current.conditions.textContent = curData.conditions;
  current.temp.textContent = getTempExpression(curData.temp);
  current.humidity.textContent = curData.humidity + " %";
  current.windspeed.textContent = curData.windspeed + " m/s";
  current.icon.src = `./images/${curData.icon}.svg`;
  current.icon.alt = `${curData.icon} icon`;

  //   weekly forecast
  const weekData = getWeeklyForecast(json);
  weekData.forEach((day, index) => {
    week.date[index].textContent = day.date;
    week.icon[index].src = `./images/${day.icon}.svg`;
    week.tempmax[index].textContent = getTempExpression(day.tempmax);
    week.tempmin[index].textContent = getTempExpression(day.tempmin);
    week.humidity[index].textContent = day.humidity + " %";
    week.windspeed[index].textContent = day.windspeed + " m/s";
  });
}

updateScreen().catch((error) => showError(error.message));

celsius.addEventListener("change", switchTempUnit);
fahrenheit.addEventListener("change", switchTempUnit);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (search.validity.valueMissing) {
    search.setCustomValidity("Please enter address");
    return;
  } else {
    search.setCustomValidity("");
  }
  updateScreen().catch((error) => showError(error.message));
});
