# Weather Dashboard

## Description
A weather dashboard in which a user can enter a city and receive the current weather and a 5-day forecast. Powered by the [OpenWeather API](https://openweathermap.org/api) API. The page will load "Boston" as the default city if there is no previous search history.

Deployed app: https://hilbug.github.io/06-weather-dashboard/

Technologies used are: HTML, CSS, Javascript, jQuery, Moment.js, Open Weather API

Contact: hil.ferraro@gmail.com

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

## Screenshots
![Screen Shot 2020-08-04 at 10 55 07 PM](https://user-images.githubusercontent.com/65197724/89366849-a71f0f80-d6a5-11ea-8de8-67556c39e35c.png)
![Weather Dashboard Demo](https://user-images.githubusercontent.com/65197724/89367560-5e685600-d6a7-11ea-83bd-9bfebbdb1d5c.gif)

## Honorable Mentions
- Moment.js cheatsheet: https://devhints.io/moment
- Thank you to Kemp for assisting with traversing the DOM to populate the forecast cards.
- Thank you to study groups which helped me figure out dynamically created buttons for the search history and making them clickable.
- Last but not least to https://openweathermap.org for making weather information readily available and providing great documentation for their APIs.
