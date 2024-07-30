const api_key = "PAVSPUMM5PSLVSLQL6BZAXUV4";

async function getWeatherData(city, unit) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${api_key}&iconSet=icons2&contentType=json`
  );
  return await response.json();
}

function getCurrentWeather(json) {
  const { icon, conditions, temp, humidity, windspeed } =
    json.currentConditions;
  return { icon, conditions, temp, humidity, windspeed };
}

getWeatherData("tokushima", "metric").then((json) =>
  console.log(getCurrentWeather(json))
);
