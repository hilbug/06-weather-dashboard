// Variables for page
// Search button
const searchBtn = $("#button-search");

// Function to build query URL
function buildQueryURL() {
    // API URL
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?";

    // Build object for API call
    let queryParams = { "APPID": "77672c68786de792de20e4e44617bd62" };
    // Search term
    queryParams.q = $("#search-term")
        .val()
        .trim();
    // Generate URL
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

// Function to build page content based on API response
function updatePage(WeatherData) {

};

searchBtn.on("click", function(event) {
    event.preventDefault();

    let queryURL = buildQueryURL();

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(queryURL);
            console.log(response);
        });
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
