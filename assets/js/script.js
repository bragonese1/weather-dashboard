document.addEventListener("DOMContentLoaded", function () {
   //API key for open weather map
    const apiKey = "26fb7c85bbf857af69a67b743c18a1b1";
    // Get references to HTML elements
    const searchForm = document.getElementById("search-weather");
    const searchInput = document.getElementById("search-input");
    const searchHistoryList = document.getElementById("search-history");
    const dailyForecastDiv = document.getElementById("daily-forecast");
    const forecastCardsContainer = document.querySelector("#five-day-forecast .forecast-info");

    // Add event listener to search input
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const cityName = searchInput.value.trim();
        if (cityName === "") return;

        // Fetching current weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                saveSearchHistory(cityName);
            })
            .catch(error => console.error("Error fetching current weather:", error));

        // Fetch 5-day forecast
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => displayForecast(data))
            .catch(error => console.error("Error fetching forecast:", error));
    });
    //Function created to display the current weather
    function displayCurrentWeather(data) {
        // Getting the city name, date, icon, temperature, humidity, and wind speed from the API response
        const cityName = data.name;
        const date = new Date(data.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        // Current weather display using city name that was inputted
        dailyForecastDiv.innerHTML = `
            <h2 class="section-title"><u>Today's Forecast for ${cityName}</u></h2>
            <div class="forecast-info">
                <p>Date: ${date.toLocaleDateString()}</p>
                <img src="${iconUrl}" alt="${data.weather[0].description}">
                <p>Temperature: ${temperature}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} mph</p>
            </div>
            </div>
        `;
    }
    // Function created to display the 5 day forecast (* date by 1000 to convert seconds to milliseconds/i += 8 to account for 3 hour interval in data.)
    function displayForecast(data) {
        forecastCardsContainer.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt*1000);
            const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
            const temperature = forecast.main.temp;
            const humidity = forecast.main.humidity;
            const windSpeed = forecast.wind.speed;

            // Creating forecast card for each day
            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `
                <p>Date: ${date.toLocaleDateString()}</p>
                <img src="${iconUrl}" alt="${forecast.weather[0].description}">
                <p>Temperature: ${temperature}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} mph</p>
            `;

            // Adding forecast card to container
            forecastCardsContainer.appendChild(card);
        }
    }
//Function created to save the search history to the local storage
    function saveSearchHistory(cityName) {
        //get the search history from local storage
        let searchHistory = localStorage.getItem("searchHistory");
        if (!searchHistory) {
            searchHistory = [];
        } else {
            searchHistory = JSON.parse(searchHistory);
        }

        // Add new search to history and update the local
        if (!searchHistory.includes(cityName)) {
            searchHistory.push(cityName);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

            // Render the updated search history
            renderSearchHistory(searchHistory);
        }
    }
// Function created to render the search history
    function renderSearchHistory(history) {
        // Clearing existing search history list
        searchHistoryList.innerHTML = "";

        // Render each search history item as a list item
        history.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            li.classList.add("list-group-item");
            li.addEventListener("click", function () {
                // Perform a new search when a history item is clicked
                searchInput.value = item;
                searchForm.dispatchEvent(new Event("submit"));
            });
            searchHistoryList.appendChild(li);
        });
    }

    // Load search history from the local storage on page load
    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
        renderSearchHistory(JSON.parse(storedSearchHistory));
    }
});
