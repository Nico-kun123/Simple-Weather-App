<!-- Component for weather app (api key is from OpenWeather) -->
<!-- prettier-ignore -->
<template>
  <div class="weather">
    <input
      type="text"
      :placeholder="$t('placeHolder')"
      v-model="city"
      @keyup.enter="getWeather"
    />
    <br />
    <br />
    <p v-if="weather == 'Error'" style="color: red;">
        {{ $t("errorMsg")  }}
    </p>
    <div id="wrapper" style="display: none;">
        <div style="border-bottom-width: 3px; border-bottom-color: #000; border-bottom-style: dashed; padding-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: 12rem auto; justify-items: center; grid-row-gap: 1rem; align-items: center; justify-content: center;">
                <h1 style="font-weight: bolder">Weather in</h1>
                <h1 style="color: rgb(0, 255, 115); text-shadow: 2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 0 #000, 2px -2px 0 #000; font-weight: bolder;">{{ weather.name }}</h1>
            </div>
            <h2 style="font-weight: 600">Country: {{ weather.sys?.country }}</h2>
            <h2>{{ weather.main?.temp }}°F ({{ ((weather.main?.temp - 32) * 5/9).toFixed(1) }}°C)</h2>
            <h3>{{ weather.weather?.[0].description }}</h3>
        </div>
    
        <br />
        <h3>{{ $t('feelsLike') }} {{ weather.main?.feels_like }}°F ({{ ((weather.main?.feels_like - 32) * 5/9).toFixed(1) }}°C)</h3>
        <br />
        <h3>{{ $t('humidity') }}{{ weather.main?.humidity }}%</h3>
        <h3>{{ $t('wind') }}{{ weather.wind?.speed }} {{ $t('miles') }} ({{ (weather.wind?.speed * 1.609344).toFixed(2) }} {{ $t('kilometers') }})</h3>
        <h3>{{ $t('visibility') }}{{ weather.visibility }} {{ $t('meters') }}</h3>
        <h3>{{ $t('pressure') }}{{ (weather.main?.pressure / 1.33322387415 ).toFixed(1) }} {{ $t('pressureSymbol') }}</h3>
        <h3>{{ $t('highTemp') }}{{ weather.main?.temp_max }}°F ({{ ((weather.main?.temp_max - 32) * 5/9).toFixed(1) }}°C)</h3>
        <h3>{{ $t('lowTemp') }}{{ weather.main?.temp_min }}°F ({{ ((weather.main?.temp_min - 32) * 5/9).toFixed(1) }}°C)</h3>
        <h3>{{ $t('humidity') }}{{ weather.clouds?.all }}%</h3>
        <br>
        <h3>{{ $t('sunrise') }}{{ sunrise }}</h3>
        <h3>{{ $t('sunset') }}{{ sunset }}</h3>
        <h3>{{ $t('timezone') }}{{ weather.timezone }}</h3>
    
    </div>
    <br>
    <div id="wrapper2" style="display: none;">
        <div style="padding-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: 12rem auto; justify-items: center; grid-row-gap: 1rem; align-items: center; justify-content: center;">
                <h3 style="font-weight: bolder">{{ $t('forecast') }}</h3>
            </div>
        </div>
        <ul style="list-style: none; margin-left: -2.5rem;">
            <li v-for="item in predictions">
                <h3>{{ item.date }}, {{ item.temp }}°F ({{ ((item.temp - 32) * 5/9).toFixed(1) }}°C)</h3>
                <br>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
//? Importing the ref function from vue
import { ref } from "vue";

//! API key from OpenWeather
const api = "b6d2d5e764dfc9d33bdc413bc0becacd";

//? Exporting the component
export default {
  //? Name of the component
  name: "WeatherStuff",

  //? Data for the component
  setup() {
    //? Creating reactive variables
    const city = ref("");
    const weather = ref({});
    const forecast = ref({});
    const sunrise = ref("");
    const sunset = ref("");
    const predictions = ref([]);

    //? Function to get the weather data
    const getWeather = async () => {
      try {
        //? Fetching the weather data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=imperial&appid=${api}`
        );
        const weatherData = await weatherResponse.json();

        //? Checking if the location is valid
        if (weatherData.cod === "400" || weatherData.cod === "404") {
          document.getElementById("wrapper").style.display = "none";
          document.getElementById("wrapper2").style.display = "none";
          weather.value = "Error";
          // Удаление класса, который меняет фоновый цвет
          let name = document.body.classList;
          document.body.classList.remove(`${name.value}`);
        } else {
          setTimeout(() => {
            document.getElementById("wrapper").style.display = "block";
            document.getElementById("wrapper2").style.display = "block";
          }, 100);

          // Changing the background color based on the weather
          if (weatherData.weather?.[0].main == "Clouds") {
            document.body.classList.add("cloudy_bg");
          } else document.body.classList.remove("cloudy_bg");

          if (weatherData.weather?.[0].main == "Clear") {
            document.body.classList.add("sunny_bg");
          } else document.body.classList.remove("sunny_bg");

          if (weatherData.weather?.[0].main == "Rain") {
            document.body.classList.add("rain_bg");
          } else document.body.classList.remove("rain_bg");

          if (weatherData.weather?.[0].main == "Snow") {
            document.body.classList.add("snow_bg");
          } else document.body.classList.remove("snow_bg");

          // Установка значений в реактивные переменные
          weather.value = weatherData;

          // console.log('d', weather._rawValue)

          // Timezone offset in seconds
          const sunriseTimestamp = weatherData.sys.sunrise * 1000;
          const sunsetTimestamp = weatherData.sys.sunset * 1000;

          // Getting dates from timestamps
          sunrise.value = formatDateWithTimezone(
            sunriseTimestamp,
            weatherData.timezone
          );
          sunset.value = formatDateWithTimezone(
            sunsetTimestamp,
            weatherData.timezone
          );

          // console.log(sunrise.value, sunset.value)
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&units=imperial&appid=${api}`
        );
        const forecastData = await forecastResponse.json();

        if (forecastData.cod != "400" && forecastData.cod != "404") {
          predictions.value = [];

          forecastData.list.forEach((item, index) => {
            if (index < 16) {
              // making an array with the predictions of the weather for the next 2-3 days
              predictions.value.push({
                date: formatDateWithTimezone(
                  item.dt * 1000,
                  weather.value.timezone
                ),
                temp: item.main.temp,
              });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    /**
     * Переводит дату в формат "dd-mm-yyyy hh:mm:ss"
     * @param {*} timestamp Дата в миллисекундах
     * @param {*} timezone Часовой пояс
     * @returns Дата в формате "dd-mm-yyyy hh:mm:ss"
     */
    const formatDateWithTimezone = (timestamp, timezone) => {
      const date = new Date(timestamp);
      const offset = timezone / 3600; // перевод в часы
      date.setHours(date.getHours() + offset); // прибавляем к дате часовой пояс

      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    // Возвращаем значения
    return {
      city,
      weather,
      forecast,
      sunrise,
      sunset,
      predictions,
      getWeather,
    };
  },
};
</script>

<style>
body {
  background-attachment: fixed;
}
.weather {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  max-width: max-content;
  min-width: max-content;
  padding: 20px;
  text-align: center;
}
#wrapper {
  border-bottom: black 3px dashed;
  padding-bottom: 15px;
}
input {
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  padding: 10px;
  width: 200px;
  min-width: max-content;
}
.rain_bg {
  background-image: url("/src/components/weather_bg/rain.jpg");
  animation-name: fadeInOpacity;
}
.cloudy_bg {
  background-image: url("/src/components/weather_bg/cloudy.jpg");
  animation-name: fadeInOpacity;
}
.sunny_bg {
  background-image: url("/src/components/weather_bg/sunny.jpg");
  animation-name: fadeInOpacity;
}
.snow_bg {
  background-image: url("/src/components/weather_bg/snow.jpg");
  animation-name: fadeInOpacity;
}
@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
