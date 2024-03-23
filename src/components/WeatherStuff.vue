<!-- Component for weather app (api key is from OpenWeather) -->

<template>
  <div class="weather">
    <input
      type="text"
      :placeholder="$t('message.placeHolder')"
      v-model="city"
      @keyup.enter="getWeather"
    />

    <p v-if="weather == 'Error'" style="color: red">
      {{ $t("message.errorMsg") }}
    </p>
    <div id="wrapper" style="display: none">
      <h1>Weather in</h1>
      <h1 class="city-name">
        {{ weather.name }}
      </h1>

      <h2>Country: {{ weather.sys?.country }}</h2>
      <h3>
        {{ weather.main?.temp }}°F ({{
          (((weather.main?.temp - 32) * 5) / 9).toFixed(1)
        }}°C)
      </h3>
      <h3>{{ weather.weather?.[0].description }}</h3>

      <div class="separator"></div>

      <p>
        {{ $t("message.feelsLike") }} {{ weather.main?.feels_like }}°F ({{
          (((weather.main?.feels_like - 32) * 5) / 9).toFixed(1)
        }}°C)
      </p>
      <br />
      <p>{{ $t("message.humidity") }}{{ weather.main?.humidity }}%</p>
      <p>
        {{ $t("message.wind") }}{{ weather.wind?.speed }} {{ $t("message.miles") }} ({{
          (weather.wind?.speed * 1.609344).toFixed(2)
        }}
        {{ $t("message.kilometers") }})
      </p>
      <p>{{ $t("message.visibility") }}{{ weather.visibility }} {{ $t("message.meters") }}</p>
      <p>
        {{ $t("message.pressure")
        }}{{ (weather.main?.pressure / 1.33322387415).toFixed(1) }}
        {{ $t("message.pressureSymbol") }}
      </p>
      <p>
        {{ $t("message.highTemp") }}{{ weather.main?.temp_max }}°F ({{
          (((weather.main?.temp_max - 32) * 5) / 9).toFixed(1)
        }}°C)
      </p>
      <p>
        {{ $t("message.lowTemp") }}{{ weather.main?.temp_min }}°F ({{
          (((weather.main?.temp_min - 32) * 5) / 9).toFixed(1)
        }}°C)
      </p>
      <p>{{ $t("message.humidity") }}{{ weather.clouds?.all }}%</p>
      <br />
      <p>{{ $t("message.sunrise") }}{{ sunrise }}</p>
      <p>{{ $t("message.sunset") }}{{ sunset }}</p>
      <p>{{ $t("message.timezone") }}{{ weather.timezone }}</p>
    </div>

    <div id="forecast" style="display: none">
      <div class="separator"></div>
      <h3 style="font-weight: bolder">{{ $t("message.forecast") }}</h3>
      <br />
      <ul style="list-style: none; padding: 0">
        <li v-for="item in predictions" style="line-height: 1.5">
          {{ item.date }}, {{ item.temp }}°F ({{
            (((item.temp - 32) * 5) / 9).toFixed(1)
          }}°C)
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

//! API key from OpenWeather
const api = "b6d2d5e764dfc9d33bdc413bc0becacd";

export default {
  name: "WeatherStuff",

  setup() {
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
          document.getElementById("forecast").style.display = "none";
          weather.value = "Error";
          // Удаление класса, который меняет фоновый цвет
          let name = document.body.classList;
          document.body.classList.remove(`${name.value}`);
        } else {
          setTimeout(() => {
            document.getElementById("wrapper").style.display = "block";
            document.getElementById("forecast").style.display = "block";
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
  min-width: fit-content;
  padding: 1em;
  text-align: center;
}
#wrapper {
  width: 100%;
}
input {
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  padding: 10px;
  width: 100%;
}
.city-name {
  color: rgb(0, 255, 115);
  text-shadow: 2px 2px 2px #000, -2px 2px 2px #000, -2px -2px 0 #000,
    2px -2px 0 #000;
  font-weight: bolder;
}
.rain_bg {
  background-image: url("/src/assets/weather_bg/rain.jpg");
  animation-name: fadeInOpacity;
}
.cloudy_bg {
  background-image: url("/src/assets/weather_bg/cloudy.jpg");
  animation-name: fadeInOpacity;
}
.sunny_bg {
  background-image: url("/src/assets/weather_bg/sunny.jpg");
  animation-name: fadeInOpacity;
}
.snow_bg {
  background-image: url("/src/assets/weather_bg/snow.jpg");
  animation-name: fadeInOpacity;
}

@media (min-width: 320px) {
  h3 {
    font-size: 1em;
  }
  .weather {
    margin: 0 auto;
    width: fit-content;
  }
}
</style>
