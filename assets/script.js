// Variables for search
const searchBtn = $("#button-search");
let searchTerm = $("#search-term");
// Variables for page elements
const cityHeader = $("#city-date");
const cityIcon=$("#weather-icon-current");
const cityTemp = $("#city-temp");
const cityHumidity = $("#city-humidity");
const cityWindSpeed = $("#city-wind-speed");
const cityUVIndex = $("#city-uv-index");
// Moment Date
const todaysDate = moment();

// Function to build current weather query URL
function buildCurrentQueryURL() {
    // API URL - https://openweathermap.org/current#one
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?";

    // Build object for API call
    let queryParams = { "APPID": "77672c68786de792de20e4e44617bd62" };
    // Search term
    queryParams.q = searchTerm
        .val()
        .trim();
    // Generate URL
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

// Function to build page content based on API response
function updateCurrentWeather(response) {
    console.log(response);
    console.log(response.name);
    // Get weather icon
    let weatherIcon=response.weather[0].icon;
    let weatherIconURL=`http://openweathermap.org/img/wn/${weatherIcon}.png`;
    console.log(response.weather[0].icon);
    console.log(weatherIconURL);
    // Temp: Convert the temp to fahrenheit
    let tempF = (response.main.temp - 273.15) * 1.80 + 32;
    // Update Current Weather Header
    cityHeader.text(`${response.name} (${todaysDate.format("MM/DD/YYYY")}) `);
    cityHeader.append(cityIcon.attr("src",weatherIconURL).attr("alt","weather icon"));
    cityTemp.text(`Temperature: ${tempF.toFixed(2)} ℉`);
    cityHumidity.text(`Humidity: ${response.main.humidity}%`);
    cityWindSpeed.text(`Wind Speed: ${response.wind.speed} MPH`);
    
    // Get UV Index... https://openweathermap.org/api/uvi
    let currentLat = response.coord.lat;
    let currentLong = response.coord.lon;
    let uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=77672c68786de792de20e4e44617bd62&lat=${currentLat}&lon=${currentLong}`;
    // AJAX for Current UV Index
    $.ajax({
        url: uvQueryURL,
        method: "GET"
      })
        .then (function(response) { 
            let uvValue = response.value;
            cityUVIndex.text(`UV Index: `);
            let uvSpan = $("<span>").text(uvValue).addClass("p-2");

            // Add bg-color based on UV value
            if (uvValue >= 0 && uvValue < 3) {
                uvSpan.addClass("green-uv");
            }
            else if (uvValue >=3 && uvValue < 6) {
                uvSpan.addClass("yellow-uv");
            }
            else if (uvValue >=6 && uvValue < 8) {
                uvSpan.addClass("orange-uv");
            }
            else if (uvValue >= 8 && uvValue < 11) {
                uvSpan.addClass("red-uv");
            }
            else if (uvValue >= 11) {
                uvSpan.addClass("purple-uv");
            }

            // Append UV span with CSS to text
            cityUVIndex.append(uvSpan);
        });
};

searchBtn.on("click", function(event) {
    event.preventDefault();

    let queryURL = buildCurrentQueryURL();

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(updateCurrentWeather);
});


// Pseudocode
// On search click:
//     city is searched.
//     search term saved to local storage
//     Search term displayed back in button form
//     When button is clicked, the city is searched again.
// Weather is displayed
//     Daily weather on top
//     5 day forecast on the bottom
//     Weather icons: https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
