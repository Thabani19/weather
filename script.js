// ==========================================
// GET HTML ELEMENTS
// ==========================================

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");

const cityName = document.getElementById("cityName");
const date = document.getElementById("date");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");

const lastUpdated = document.getElementById("lastUpdated");

const forecastContainer =
    document.querySelector(".forecast-container");


// ==========================================
// SEARCH BUTTON
// ==========================================

searchButton.addEventListener("click", searchCity);

locationButton.addEventListener(
    "click",
    getCurrentLocation
);


// ==========================================
// SEARCH WHEN PRESSING ENTER
// ==========================================

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchCity();
    }

});


// ==========================================
// AUTOMATIC LOCATION DETECTION
// ==========================================

window.addEventListener(
    "load",
    getCurrentLocation
);


// ==========================================
// GET CURRENT LOCATION
// ==========================================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        console.log(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        // ==========================================
        // SUCCESS
        // ==========================================

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "Location detected:",
                latitude,
                longitude
            );


            getWeatherByCoordinates(
                latitude,
                longitude
            );

        },


        // ==========================================
        // ERROR
        // ==========================================

        function (error) {

            console.log(
                "Location permission was not granted."
            );

            console.log(
                error.message
            );

        }

    );

}


// ==========================================
// GET WEATHER BY COORDINATES
// ==========================================

async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    try {

        // ==========================================
        // FIND CITY
        // ==========================================

        const locationResponse = await fetch(

            `https://geocoding-api.open-meteo.com/v1/reverse?` +
            `latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&language=en` +
            `&format=json`

        );


        const locationData =
            await locationResponse.json();


        let detectedCity =
            "Your Location";


        if (
            locationData.results &&
            locationData.results.length > 0
        ) {

            const location =
                locationData.results[0];


            detectedCity =
                location.name;

        }


        // ==========================================
        // GET WEATHER
        // ==========================================

        const weatherResponse = await fetch(

            `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}` +
            `&longitude=${longitude}` +

            `&current=` +
            `temperature_2m,` +
            `relative_humidity_2m,` +
            `apparent_temperature,` +
            `weather_code,` +
            `surface_pressure,` +
            `wind_speed_10m,` +
            `is_day` +

            `&daily=` +
            `weather_code,` +
            `temperature_2m_max,` +
            `temperature_2m_min,` +
            `precipitation_probability_max` +

            `&forecast_days=5` +

            `&timezone=auto`

        );


        const weatherData =
            await weatherResponse.json();


        // ==========================================
        // DISPLAY WEATHER
        // ==========================================

        displayWeather(
            detectedCity,
            weatherData
        );

    }


    catch (error) {

        console.error(
            "Location weather error:",
            error
        );

    }

}


// ==========================================
// SEARCH CITY
// ==========================================

async function searchCity() {

    const city =
        cityInput.value.trim();


    // ==========================================
    // CHECK EMPTY SEARCH
    // ==========================================

    if (city === "") {

        alert(
            "Please enter a city name."
        );

        return;
    }


    try {

        // ==========================================
        // FIND CITY
        // ==========================================

        const locationResponse =
            await fetch(

                `https://geocoding-api.open-meteo.com/v1/search?` +
                `name=${encodeURIComponent(city)}` +
                `&count=1` +
                `&language=en` +
                `&format=json`

            );


        const locationData =
            await locationResponse.json();


        // ==========================================
        // CHECK CITY
        // ==========================================

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            alert(
                "City not found. Please try another city."
            );

            return;
        }


        // ==========================================
        // GET LOCATION
        // ==========================================

        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // ==========================================
        // GET WEATHER
        // ==========================================

        const weatherResponse =
            await fetch(

                `https://api.open-meteo.com/v1/forecast?` +
                `latitude=${latitude}` +
                `&longitude=${longitude}` +

                `&current=` +
                `temperature_2m,` +
                `relative_humidity_2m,` +
                `apparent_temperature,` +
                `weather_code,` +
                `surface_pressure,` +
                `wind_speed_10m,` +
                `is_day` +

                `&daily=` +
                `weather_code,` +
                `temperature_2m_max,` +
                `temperature_2m_min,` +
                `precipitation_probability_max` +

                `&forecast_days=5` +

                `&timezone=auto`

            );


        const weatherData =
            await weatherResponse.json();


        // ==========================================
        // DISPLAY WEATHER
        // ==========================================

        displayWeather(
            location.name,
            weatherData
        );

    }


    catch (error) {

        console.error(
            "Weather error:",
            error
        );


        alert(
            "Unable to get weather information. Please check your internet connection and try again."
        );

    }

}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(
    locationName,
    weatherData
) {

    const currentWeather =
        weatherData.current;


    const dailyWeather =
        weatherData.daily;


    // ==========================================
    // DISPLAY CITY
    // ==========================================

    cityName.textContent =
        locationName;


    // ==========================================
    // DISPLAY DATE
    // ==========================================

    const currentDate =
        new Date(
            currentWeather.time
        );


    date.textContent =
        currentDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    // ==========================================
    // DISPLAY TEMPERATURE
    // ==========================================

    temperature.textContent =
        Math.round(
            currentWeather.temperature_2m
        );


    // ==========================================
    // DISPLAY FEELS LIKE
    // ==========================================

    feelsLike.textContent =
        Math.round(
            currentWeather.apparent_temperature
        ) + "°C";


    // ==========================================
    // DISPLAY HUMIDITY
    // ==========================================

    humidity.textContent =
        currentWeather.relative_humidity_2m
        + "%";


    // ==========================================
    // DISPLAY WIND
    // ==========================================

    windSpeed.textContent =
        currentWeather.wind_speed_10m
        + " km/h";


    // ==========================================
    // DISPLAY PRESSURE
    // ==========================================

    pressure.textContent =
        Math.round(
            currentWeather.surface_pressure
        ) + " hPa";


    // ==========================================
    // DISPLAY CONDITION
    // ==========================================

    condition.textContent =
        getWeatherDescription(
            currentWeather.weather_code
        );


    // ==========================================
    // DISPLAY ICON
    // ==========================================

    weatherIcon.textContent =
        getWeatherIcon(
            currentWeather.weather_code,
            currentWeather.is_day
        );


    // ==========================================
    // UPDATE BACKGROUND
    // ==========================================

    updateWeatherBackground(
        currentWeather.weather_code,
        currentWeather.is_day
    );
    // ==========================================
// CREATE WEATHER EFFECTS
// ==========================================

createWeatherEffects(
    currentWeather.weather_code
);


    // ==========================================
    // LAST UPDATED
    // ==========================================

    const updatedTime =
        new Date();


    lastUpdated.textContent =
        "Last updated: " +
        updatedTime.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // ==========================================
    // DISPLAY FORECAST
    // ==========================================

    displayForecast(
        dailyWeather
    );

}


// ==========================================
// UPDATE WEATHER BACKGROUND
// ==========================================

function updateWeatherBackground(
    weatherCode,
    isDay
) {

    // ==========================================
    // REMOVE OLD BACKGROUND CLASSES
    // ==========================================

    document.body.classList.remove(

        "clear-sky",
        "mainly-clear",
        "partly-cloudy",
        "overcast",
        "foggy",
        "drizzle",
        "rainy",
        "snowy",
        "thunderstorm",

        "night-clear",
        "night-mainly-clear",
        "night-partly-cloudy",
        "night-overcast",
        "night-foggy",
        "night-drizzle",
        "night-rainy",
        "night-snowy",
        "night-thunderstorm"

    );


    // ==========================================
    // DETERMINE DAY OR NIGHT
    // ==========================================

    const dayTime =
        isDay === 1;


    // ==========================================
    // CLEAR SKY
    // ==========================================

    if (weatherCode === 0) {

        if (dayTime) {

            document.body.classList.add(
                "clear-sky"
            );

        }
        else {

            document.body.classList.add(
                "night-clear"
            );

        }

    }


    // ==========================================
    // MAINLY CLEAR
    // ==========================================

    if (weatherCode === 1) {

        if (dayTime) {

            document.body.classList.add(
                "mainly-clear"
            );

        }
        else {

            document.body.classList.add(
                "night-mainly-clear"
            );

        }

    }


    // ==========================================
    // PARTLY CLOUDY
    // ==========================================

    if (weatherCode === 2) {

        if (dayTime) {

            document.body.classList.add(
                "partly-cloudy"
            );

        }
        else {

            document.body.classList.add(
                "night-partly-cloudy"
            );

        }

    }


    // ==========================================
    // OVERCAST
    // ==========================================

    if (weatherCode === 3) {

        if (dayTime) {

            document.body.classList.add(
                "overcast"
            );

        }
        else {

            document.body.classList.add(
                "night-overcast"
            );

        }

    }


    // ==========================================
    // FOG
    // ==========================================

    if (
        weatherCode === 45 ||
        weatherCode === 48
    ) {

        if (dayTime) {

            document.body.classList.add(
                "foggy"
            );

        }
        else {

            document.body.classList.add(
                "night-foggy"
            );

        }

    }


    // ==========================================
    // DRIZZLE
    // ==========================================

    if (
        weatherCode >= 51 &&
        weatherCode <= 57
    ) {

        if (dayTime) {

            document.body.classList.add(
                "drizzle"
            );

        }
        else {

            document.body.classList.add(
                "night-drizzle"
            );

        }

    }


    // ==========================================
    // RAIN
    // ==========================================

    if (
        (
            weatherCode >= 61 &&
            weatherCode <= 67
        )
        ||
        (
            weatherCode >= 80 &&
            weatherCode <= 82
        )
    ) {

        if (dayTime) {

            document.body.classList.add(
                "rainy"
            );

        }
        else {

            document.body.classList.add(
                "night-rainy"
            );

        }

    }


    // ==========================================
    // SNOW
    // ==========================================

    if (
        (
            weatherCode >= 71 &&
            weatherCode <= 77
        )
        ||
        (
            weatherCode >= 85 &&
            weatherCode <= 86
        )
    ) {

        if (dayTime) {

            document.body.classList.add(
                "snowy"
            );

        }
        else {

            document.body.classList.add(
                "night-snowy"
            );

        }

    }


    // ==========================================
    // THUNDERSTORM
    // ==========================================

    if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {

        if (dayTime) {

            document.body.classList.add(
                "thunderstorm"
            );

        }
        else {

            document.body.classList.add(
                "night-thunderstorm"
            );

        }

    }

}


// ==========================================
// DISPLAY 5-DAY FORECAST
// ==========================================

function displayForecast(
    dailyWeather
) {

    forecastContainer.innerHTML = "";


    for (
        let i = 0;
        i < dailyWeather.time.length;
        i++
    ) {

        // ==========================================
        // GET DATE
        // ==========================================

        const forecastDate =
            new Date(
                dailyWeather.time[i]
                + "T00:00:00"
            );


        // ==========================================
        // DAY NAME
        // ==========================================

        const dayName =
            forecastDate.toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );


        // ==========================================
        // DATE
        // ==========================================

        const dateText =
            forecastDate.toLocaleDateString(
                "en-US",
                {
                    day: "numeric",
                    month: "short"
                }
            );


        // ==========================================
        // WEATHER CODE
        // ==========================================

        const weatherCode =
            dailyWeather.weather_code[i];


        // ==========================================
        // TEMPERATURES
        // ==========================================

        const maximumTemperature =
            Math.round(
                dailyWeather
                    .temperature_2m_max[i]
            );


        const minimumTemperature =
            Math.round(
                dailyWeather
                    .temperature_2m_min[i]
            );


        // ==========================================
        // RAIN PROBABILITY
        // ==========================================

        const rainProbability =
            dailyWeather
                .precipitation_probability_max[i];


        // ==========================================
        // WEATHER DESCRIPTION
        // ==========================================

        const weatherDescription =
            getWeatherDescription(
                weatherCode
            );


        // ==========================================
        // WEATHER ICON
        // ==========================================

        const forecastIcon =
            getWeatherIcon(
                weatherCode,
                1
            );


        // ==========================================
        // CREATE CARD
        // ==========================================

        const forecastCard =
            document.createElement("div");


        forecastCard.className =
            "forecast-card";


        forecastCard.innerHTML = `

            <h3>
                ${dayName}
            </h3>

            <p class="forecast-date">
                ${dateText}
            </p>

            <div class="forecast-icon">
                ${forecastIcon}
            </div>

            <p class="forecast-condition">
                ${weatherDescription}
            </p>

            <p class="forecast-temperature">

                <strong>
                    ${maximumTemperature}°C
                </strong>

                <span>
                    ${minimumTemperature}°C
                </span>

            </p>

            <p class="forecast-rain">
                🌧️ Rain: ${rainProbability}%
            </p>

        `;


        forecastContainer.appendChild(
            forecastCard
        );

    }

}


// ==========================================
// WEATHER DESCRIPTION
// ==========================================

function getWeatherDescription(
    weatherCode
) {

    if (weatherCode === 0) {
        return "Clear Sky";
    }

    if (weatherCode === 1) {
        return "Mainly Clear";
    }

    if (weatherCode === 2) {
        return "Partly Cloudy";
    }

    if (weatherCode === 3) {
        return "Overcast";
    }

    if (
        weatherCode === 45 ||
        weatherCode === 48
    ) {
        return "Foggy";
    }

    if (
        weatherCode >= 51 &&
        weatherCode <= 57
    ) {
        return "Drizzle";
    }

    if (
        weatherCode >= 61 &&
        weatherCode <= 67
    ) {
        return "Rainy";
    }

    if (
        weatherCode >= 71 &&
        weatherCode <= 77
    ) {
        return "Snowy";
    }

    if (
        weatherCode >= 80 &&
        weatherCode <= 82
    ) {
        return "Rain Showers";
    }

    if (
        weatherCode >= 85 &&
        weatherCode <= 86
    ) {
        return "Snow Showers";
    }

    if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {
        return "Thunderstorm";
    }

    return "Unknown";
}


// ==========================================
// WEATHER ICON
// ==========================================

function getWeatherIcon(
    weatherCode,
    isDay
) {

    // ==========================================
    // CLEAR SKY
    // ==========================================

    if (weatherCode === 0) {

        if (isDay === 1) {
            return "☀️";
        }

        return "🌙";
    }


    // ==========================================
    // MAINLY CLEAR
    // ==========================================

    if (weatherCode === 1) {

        if (isDay === 1) {
            return "🌤️";
        }

        return "🌙";
    }


    // ==========================================
    // PARTLY CLOUDY
    // ==========================================

    if (weatherCode === 2) {

        if (isDay === 1) {
            return "⛅";
        }

        return "☁️";
    }


    // ==========================================
    // OVERCAST
    // ==========================================

    if (weatherCode === 3) {
        return "☁️";
    }


    // ==========================================
    // FOG
    // ==========================================

    if (
        weatherCode === 45 ||
        weatherCode === 48
    ) {
        return "🌫️";
    }


    // ==========================================
    // DRIZZLE
    // ==========================================

    if (
        weatherCode >= 51 &&
        weatherCode <= 57
    ) {
        return "🌦️";
    }


    // ==========================================
    // RAIN
    // ==========================================

    if (
        weatherCode >= 61 &&
        weatherCode <= 67
    ) {
        return "🌧️";
    }


    // ==========================================
    // SNOW
    // ==========================================

    if (
        weatherCode >= 71 &&
        weatherCode <= 77
    ) {
        return "❄️";
    }


    // ==========================================
    // RAIN SHOWERS
    // ==========================================

    if (
        weatherCode >= 80 &&
        weatherCode <= 82
    ) {
        return "🌧️";
    }


    // ==========================================
    // SNOW SHOWERS
    // ==========================================

    if (
        weatherCode >= 85 &&
        weatherCode <= 86
    ) {
        return "🌨️";
    }


    // ==========================================
    // THUNDERSTORM
    // ==========================================

    if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {
        return "⛈️";
    }


    return "🌤️";
}

// ==========================================
// CREATE WEATHER CLOUDS
// ==========================================

function createClouds() {

    const weatherEffects =
        document.getElementById("weatherEffects");


    // Clear existing effects

    weatherEffects.innerHTML = "";


    // Create 5 clouds

    for (let i = 0; i < 5; i++) {

        const cloud =
            document.createElement("div");


        cloud.className =
            "weather-cloud";


        // Random vertical position

        cloud.style.top =
            Math.floor(
                Math.random() * 45
            ) + "%";


      

        // Different animation speeds

        cloud.style.animationDuration =
            (35 + Math.random() * 30) + "s";


        // Different starting positions

        cloud.style.animationDelay =
            -(Math.random() * 30) + "s";


        weatherEffects.appendChild(
            cloud
        );

    }

}

// ==========================================
// DETERMINE WEATHER EFFECTS
// ==========================================

function createWeatherEffects(
    weatherCode
) {

    const weatherEffects =
        document.getElementById("weatherEffects");


    // Clear previous effects

    weatherEffects.innerHTML = "";


    // ==========================================
    // CLOUDY WEATHER
    // ==========================================

    if (
        weatherCode === 2 ||
        weatherCode === 3 ||
        weatherCode === 45 ||
        weatherCode === 48
    ) {

        createClouds();

    }

}