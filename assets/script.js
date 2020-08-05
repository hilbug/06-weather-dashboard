$(document).ready(function () {
    // Variables for search
    const searchBtn = $("#button-search");
    let searchTerm = $("#search-term");
    let searchHistory = $("#search-history");
    let searchCity = "";
    const clearBtn = $("#clear-search");

    // Variables for current weather
    const cityHeader = $("#city-date");
    const cityIcon = $("#weather-icon-current");
    const cityTemp = $("#city-temp");
    const cityHumidity = $("#city-humidity");
    const cityWindSpeed = $("#city-wind-speed");
    const cityUVIndex = $("#city-uv-index");

    // Moment Date
    const todaysDate = moment();

    // Function to build current weather query URL
    function buildCurrentQueryURL() {
        // API URL - https://openweathermap.org/current#one
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?";

        // Build object for API call
        let queryParams = { "APPID": "77672c68786de792de20e4e44617bd62" };
        // Search term
        queryParams.q = searchTerm
            .val()
            .trim();
        // Generate URL
        return queryURL + $.param(queryParams);
    }

    // Function to build page content based on API response
    function updateCurrentWeather(response) {
        // Get weather icon details
        let weatherIcon = response.weather[0].icon;
        let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        let weatherIconDescription = response.weather[0].description;
        // Temp: Convert the temp to fahrenheit
        let tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // City Name
        searchCity = response.name;
        // Update Current Weather Details
        cityHeader.text(`${searchCity} (${todaysDate.format("MM/DD/YYYY")}) `);
        cityHeader.append(cityIcon.attr("src", weatherIconURL).attr("alt", `${weatherIconDescription}`).attr("title", `${weatherIconDescription}`));
        cityTemp.text(`Temperature: ${tempF.toFixed(2)} ℉`);
        cityHumidity.text(`Humidity: ${response.main.humidity}%`);
        cityWindSpeed.text(`Wind Speed: ${response.wind.speed} MPH`);

        // Get UV Index... https://openweathermap.org/api/uvi
        let currentLat = response.coord.lat;
        let currentLong = response.coord.lon;
        let uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=77672c68786de792de20e4e44617bd62&lat=${currentLat}&lon=${currentLong}`;
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

        //Get 5-day forecast...https://openweathermap.org/api/one-call-api
        // Use currentLat, currentLong
        let forecastQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLong}&exclude=current,minutely,hourly&appid=77672c68786de792de20e4e44617bd62`;
        // AJAX for Current 5-day forecast cards
        $.ajax({
            url: forecastQueryUrl,
            method: "GET"
        })
            .then(function (response) {
                // Fill out card text
                $(".card-day").each(function (day) {
                    day = day + 1;
                    // Forecast date
                    let cardDateMoment = moment.unix(response.daily[day].dt).format("MM/DD/YYYY");
                    // Weather Icon Details
                    let weatherCardIcon = response.daily[day].weather[0].icon;
                    let weatherCardIconURL = `https://openweathermap.org/img/wn/${weatherCardIcon}.png`;
                    let weatherCardIconDesc = response.daily[day].weather[0].description;
                    // Temp: Convert the temp to fahrenheit
                    let cardTempF = (response.daily[day].temp.day - 273.15) * 1.80 + 32;
                    // Humidity
                    let cardHumidity = response.daily[day].humidity;
                    // Fill out Forecast cards
                    // Date
                    $($(this)[0].children[0].children[0]).text(cardDateMoment);
                    // Weather Icon
                    $($(this)[0].children[0].children[1].children[0]).attr("src", weatherCardIconURL).attr("alt", `${weatherCardIconDesc}`).attr("title", `${weatherCardIconDesc}`);
                    // Temp
                    $($(this)[0].children[0].children[2]).text(`Temp: ${cardTempF.toFixed(2)} ℉`);
                    // Humidity
                    $($(this)[0].children[0].children[3]).text(`Humidity: ${cardHumidity}%`);
                });
            })
    };

    // store search history to get lengh of local storage and use that as a key
    function storeSearchTerms() {
        localStorage.setItem("city" + localStorage.length, searchTerm
            .val()
            .trim());
    }

    // Add searched cities as buttons to Past Searches
    let storedSearchList = "";
    function displaySearchTerms() {
        // Empty the search results div to render only one button per city
        searchHistory.empty();
        // Create a button for each searched city
        for (let i = 0; i < localStorage.length; i++) {
            storedSearchList = localStorage.getItem("city" + i);
            let searchHistoryBtn = $("<button>").text(storedSearchList).addClass("btn btn-primary button-srch m-2").attr("type", "submit");
            searchHistory.append(searchHistoryBtn);

            if (i === localStorage.length - 1) {
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/weather?appid=77672c68786de792de20e4e44617bd62&q=${storedSearchList}`,
                    method: "GET"
                })
                    .then(updateCurrentWeather);
            }
        }
    }

    //Event Listeners
    // Search Box Display weather for searched city
    searchBtn.on("click", function (event) {
        event.preventDefault();
        storeSearchTerms();
        displaySearchTerms();

        let queryURL = buildCurrentQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(updateCurrentWeather);
    });

    // Show past search buttons when the page loads
    displaySearchTerms();

    // Add event listener for the dynamically created buttons
    $(document).on("click", ".button-srch", function () {
        //not needed since there is no "submit" button - event.preventDefault();
        let pastCity = $(this).text();

        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?appid=77672c68786de792de20e4e44617bd62&q=${pastCity}`,
            method: "GET"
        })
            .then(updateCurrentWeather);
    });

    // Clear past search cities
    clearBtn.on("click", function () {
        localStorage.clear();
        searchHistory.empty();
        location.reload();
    });

    // Load default a city
    $(window).on("load", function () {
        if (localStorage.length === 0) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?appid=77672c68786de792de20e4e44617bd62&q=Boston`,
                method: "GET"
            })
                .then(updateCurrentWeather);
        }
    });
});
