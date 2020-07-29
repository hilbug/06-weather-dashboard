$(document).ready(function () {
    // Variables for search
    const searchBtn = $("#button-search");
    let searchTerm = $("#search-term");
    let searchHistory = $("#search-history");
    const srchBtn = $(".button-srch");
    // Variables for page elements
    const cityHeader = $("#city-date");
    const cityIcon = $("#weather-icon-current");
    const cityTemp = $("#city-temp");
    const cityHumidity = $("#city-humidity");
    const cityWindSpeed = $("#city-wind-speed");
    const cityUVIndex = $("#city-uv-index");
    const forecastCards = $("#5-day-cast");
    // Moment Date
    const todaysDate = moment();
    // Store search terms
    searchTermList = [];

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
        let weatherIcon = response.weather[0].icon;
        let weatherIconURL = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
        console.log(response.weather[0].icon);
        console.log(weatherIconURL);
        // Temp: Convert the temp to fahrenheit
        let tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // Update Current Weather Header
        cityHeader.text(`${response.name} (${todaysDate.format("MM/DD/YYYY")}) `);
        cityHeader.append(cityIcon.attr("src", weatherIconURL).attr("alt", "weather icon"));
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
            .then(function (response) {
                let uvValue = response.value;
                cityUVIndex.text(`UV Index: `);
                let uvSpan = $("<span>").text(uvValue).addClass("p-2");

                // Add bg-color based on UV value
                if (uvValue >= 0 && uvValue < 3) {
                    uvSpan.addClass("green-uv");
                }
                else if (uvValue >= 3 && uvValue < 6) {
                    uvSpan.addClass("yellow-uv");
                }
                else if (uvValue >= 6 && uvValue < 8) {
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

        //Get 5-day forecast...https://openweathermap.org/forecast16
        // Use currentLat, currentLong
        let resultsCount = 5;
        let forecastQueryUrl = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${currentLat}&lon=${currentLong}&cnt=${resultsCount}&appid=77672c68786de792de20e4e44617bd62`;
        // AJAX for Current UV Index
        $.ajax({
            url: forecastQueryUrl,
            method: "GET"
        })
            .then(function (response) {
                // For each response, create a card with:
                // Date
                // Weather Icon
                // Temp in F
                // Humidity
                // Append the card to forecastCards
            })
    };

    // Display weather for searched city
    searchBtn.on("click", function (event) {
        event.preventDefault();

        let queryURL = buildCurrentQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(
                updateCurrentWeather,
                storeSearchTerms,
                displaySearchTerms
                );
    });

    // Local Storage stuff!
    // Store city searched cities to local storage
    // We need to extract response.name from updateCurrentWeather into a variable.
    // How do we avoid duplicate values getting pushed?
    function storeSearchTerms() {
        searchTermList.push(response.name);
        localStorage.setItem("searchTerms", JSON.stringify(searchTermList));
        console.log(searchTermList);
    }
    // Add searched cities as buttons to Past Searches
    // Issue: upon reload page, the buttons go away. When new city searched, the local storage is wiped. Why? 
    function displaySearchTerms() {
        let storedSearchList = JSON.parse(localStorage.getItem("searchTerms"));
        console.log(storedSearchList);
        let searchHistoryBtn = $("<button>").text(response.name).addClass("btn btn-primary button-srch m-2").attr("type", "submit");
        searchHistory.append(searchHistoryBtn);
    }
});

// srchBtn.on("click", load page based on search term city)
//searchBtn.on("click", storeSearchTerm());


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
