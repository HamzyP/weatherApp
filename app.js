const weatherDiv = document.getElementById('weather');
const button = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput'); // Get the city input field

// Your OpenWeatherMap API key
const API_KEY = '81c41ba7e270d8de7b344b0eccc2e0fb'; // Replace with your actual API key
//const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}&units=metric`;

// Main function to initialize everything
function main() {
    // Set up event listener for the button click
    button.addEventListener('click', getWeather);
    // You could call getWeather on page load if you want to fetch weather immediately
    // getWeather();
}



// Function to format time in "hh:mm" format
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to determine the color based on temperature
function getTempColor(temp) {
    if (temp < 10) {
        return 'text-blue-500'; // Cool temperatures (Blue)
    } else if (temp >= 10 && temp < 20) {
        return 'text-yellow-500'; // Mild temperatures (Yellow)
    } else if (temp >= 20 && temp < 30) {
        return 'text-orange-500'; // Warm temperatures (Orange)
    } else {
        return 'text-red-500'; // Hot temperatures (Red)
    }
}


// Function to fetch weather data from the API
async function getWeather() {

    const city = cityInput.value; // Get the value entered in the input field
    console.log(city);
    let API_URL;
    if (!city) {
        weatherDiv.innerHTML = 'Please enter a city name.';
        return;
    }
    if (/^[A-Za-z]+$/.test(city)) {
        // If city contains only letters
        API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},GB&appid=${API_KEY}&units=metric`;
        }
    else if (/^\d+$/.test(city)) {
        // If city contains only numbers
        API_URL = `https://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${API_KEY}&units=metric`
    }
        try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data); // Log the response to the console

        // Extract data from the response
        const temp = data.main.temp;
        const feels_like = data.main.feels_like;
        const weather = data.weather[0].description;

        const utcTime = data.dt; // The UTC time from the API response (in seconds)
        const timezoneOffset = data.timezone; // Time zone offset from UTC (in seconds)
        
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        const tempColorClass = getTempColor(temp);
        const feelsColorClass = getTempColor(feels_like);

        console.log("utctime:", utcTime);
        console.log("timezoneOffset:", timezoneOffset);

        // Calculate the local time for the given city based on its timezone
        const localTime = formatTime(utcTime + timezoneOffset); // Add the offset to the UTC time
        

        

        // Display the weather info on the page
        weatherDiv.innerHTML = `
        <h4 class="text-2xl font-bold dark:text-white">Current Weather in  <span class="text-blue-600 dark:text-blue-500">${data.name}</span></h4>
        
        <strong class="${tempColorClass}">Temperature:</strong> ${temp}°C 
        <br> 
        <strong class = "${feelsColorClass}" >Feels Like:</strong> ${data.main.feels_like}°C
        <br>
        <strong>Condition:</strong> ${weather}
        <br>
        <strong>Visibility:</strong> ${data.visibility / 1000} km
        <br>
        <strong class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400">Sunrise:</strong> ${sunriseTime}
        <br>
        <strong class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500" >Sunset:</strong> ${sunsetTime}
        <br>
        <strong>Local Time:</strong> ${localTime}
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherDiv.innerHTML = 'Error fetching weather data. Please try again.';
    }
}

// Call the main function to initialize the app
main();
