# weather-widget

weather-widget is a JavaScript widget that displays historical weather data for a specified location. It provides a user-friendly interface for users to enter a city name or coordinates (latitude, longitude) and retrieve historical weather data for the previous week.

## Prerequisites

- Docker: weather-widget can be easily run in a Docker container. Make sure you have Docker installed on your system.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/DoriHai/weather-widget
   cd weather-widget
   ````
2. Build the Docker image:
   ```bash
   docker build -t weather-image .
   ````
3. Run the Docker container:
   ```bash
   docker run -p 8080:80 weather-image
   ````
## Usage

1. Initiate the WeatherWidget class:
   ```javascript
   var weather = new WeatherWidget();
   ```
2. Inject the weather widget into a container: 
   ```javascript
   weather.injectWeatherDiv();
   ````
   By default, the widget will be create and inject into a container with the ID       "weather-widget". You can specify a different container ID as an argument: 
   ```javascript
   weather.injectWeatherDiv('custom-container-id');
   ```
   


## Run Locally

To test the Weather Image locally on any website, use the following code in your browser's console:
   ```javascript
   var script = document.createElement('script');
   script.src = 'http://localhost:8080/weather-image.js';
   document.head.appendChild(script);
   ```

## Tech Stack

* JavaScript
* HTML
* CSS
* Docker

## Customization
The Weather Image UI can be customized by modifying the style/weather-widget.css file.
## Author
Hai Dori