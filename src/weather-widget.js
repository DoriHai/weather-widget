class WeatherWidget {
    baseUrl = 'http://localhost:8080';
    apiKey = '650d38dcbf17418d86166b53be30afa7';
    weatherApiBaseUrl = 'https://api.weatherbit.io/v2.0';
    dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    constructor() {
        this.loadCSS(`${this.baseUrl}/style/weather-widget.css`);
    }

    async fetchWeatherData(location) {
        const { startDate, endDate } = this.getPreviousWeekStartAndEndDates();
        const query = {
            start_date: startDate,
            end_date: endDate,
            key: this.apiKey,
            ...(this.isCoordinates(location) ? this.getCoordinatesQuery(location) : { city: location }),
        };
        const queryParams = new URLSearchParams(query);
        const apiUrl = `${this.weatherApiBaseUrl}/history/daily?${queryParams}`;
        try {
            const response = await fetch(apiUrl);
            return await response.json();
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    }

    displayWeatherData(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        const resultsContainer = document.createElement("div");
        resultsContainer.classList.add('weather-data');
        data.forEach((day, idx) => {
            const dayDiv = this.createDayDiv(this.dayNames[idx], this.getWeatherImage(day.temp), day.temp);
            resultsContainer.appendChild(dayDiv);
        });
        container.appendChild(resultsContainer);
    }

    createDayDiv(dayName, imageUrl, temperature) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('weather-day');
        dayDiv.innerHTML = `
            <div class="weather-day__name">${dayName}</div>
            <div class="weather-day__image">
                <img src="${this.baseUrl}/assets/${imageUrl}" alt="Weather Image">
            </div>
            <div class="weather-day__temperature">${temperature}°C</div>
        `;
        return dayDiv;
    }

    injectWeatherDiv(containerId = 'weather-widget') {
        const container = document.getElementById(containerId);
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = containerId;
            document.body.appendChild(newContainer);
        }
        const targetContainer = container || document.getElementById(containerId);
        const existingWeatherData = targetContainer.querySelector('.weather-data');
        if (existingWeatherData) targetContainer.removeChild(existingWeatherData);
        const inputContainer = this.createInputContainer();
        targetContainer.appendChild(inputContainer);
        const submitButton = inputContainer.querySelector('.weather-input__button');
        submitButton.addEventListener('click', async () => {
            const locationInput = inputContainer.querySelector('.weather-input__input');
            const location = locationInput.value;
            const { data } = await this.fetchWeatherData(location);
            if (data) {
                targetContainer.removeChild(inputContainer);
                this.displayWeatherData(data, containerId);
            }
        });
    }

    createInputContainer() {
        const inputContainer = document.createElement('div');
        inputContainer.innerHTML = `
            <input class="weather-input__input" type="text" placeholder="Enter City Name or Coordinates (divided by ',')">
            <button class="weather-input__button" type="button">Get Weather</button>
        `;
        inputContainer.classList.add('weather-input');
        return inputContainer;
    }

    loadCSS(filename) {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = filename;
        document.head.appendChild(linkElement);
    }

    getPreviousWeekStartAndEndDates() {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 6);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        return {
            startDate: this.formatDate(startDate),
            endDate: this.formatDate(endDate),
        };
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isCoordinates(location) {
        return /^[+-]?\d+(\.\d+)?,[+-]?\d+(\.\d+)?$/.test(location);
    }

    getCoordinatesQuery(location) {
        const [lat, lon] = location.split(',');
        return { lat, lon };
    }

    getWeatherImage(temperature) {
        return temperature >= 20 ? 'sun.png' : 'cloud.png';
    }
}

window.WeatherWidget = WeatherWidget;
