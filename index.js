const api_key = "PAVSPUMM5PSLVSLQL6BZAXUV4";

async function getWeatherData(city, unit) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${api_key}&iconSet=icons2&contentType=json`
  );
  return await response.json();
}

getWeatherData("tokushima", "metric").then((response) => console.log(response));
