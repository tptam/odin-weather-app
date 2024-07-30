const api_key = "PAVSPUMM5PSLVSLQL6BZAXUV4";

async function getWeatherData(city, unit) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${api_key}&iconSet=icons2&contentType=json`
  );
  return await response.json();
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

getWeatherData("tokushima", "metric").then((json) => {
  console.log(getWeeklyForecast(json));
});
