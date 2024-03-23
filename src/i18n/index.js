import { createI18n } from "vue-i18n";

const messages = {
  ja: {
    message: {
      errorMsg: "入力が無効です。もう一度お試しください。",
      placeHolder: "都市名を入力してください",
      feelsLike: "体感温度 ",
      humidity: "湿度: ",
      wind: "風: ",
      visibility: "視界: ",
      pressure: "圧力: ",
      highTemp: "最高気温: ",
      lowTemp: "最低気温: ",
      clouds: "雲: ",
      sunrise: "日の出: ",
      sunset: "日没: ",
      timezone: "タイムゾーン: ",
      forecast: "2〜3日の予報",
      miles: "マイル/時",
      meters: "メートル",
      pressureSymbol: "mmHg",
      kilometers: "キロメートル/時",
    },
  },
  en: {
    message: {
      errorMsg: "Invalid input! Please try again.",
      placeHolder: "Enter a city name",
      feelsLike: "Feels like ",
      humidity: "Humidity: ",
      wind: "Wind: ",
      visibility: "Visibility: ",
      pressure: "Pressure: ",
      highTemp: "Highest Temp: ",
      lowTemp: "Lowest Temp: ",
      clouds: "Clouds: ",
      sunrise: "Sunrise: ",
      sunset: "Sunset: ",
      timezone: "Timezone: ",
      forecast: "Forecast for 2-3 days",
      miles: "mph",
      meters: "m.",
      pressureSymbol: "mmHg",
      kilometers: "km/h",
    },
  },
  ru: {
    message: {
      errorMsg: "Некорректные данные! Попробуйте ещё раз.",
      placeHolder: "Введите название города",
      feelsLike: "Ощущается как ",
      humidity: "Влажность: ",
      wind: "Ветер: ",
      visibility: "Видимость: ",
      pressure: "Давление: ",
      highTemp: "Макс. температура: ",
      lowTemp: "Мин. температура: ",
      clouds: "Облачность: ",
      sunrise: "Восход: ",
      sunset: "Закат: ",
      timezone: "Часовой пояс: ",
      forecast: "Прогноз на 2-3 дня",
      miles: "миль/ч",
      meters: "м.",
      pressureSymbol: "мм.рт.ст.",
      kilometers: "км/ч",
    },
  },
};

const i18n = createI18n({
  // Устанавливаем локаль по умолчанию
  locale: navigator.language,

  // Устанавливаем локаль, если не найдена установленная локаль по умолчанию
  fallbackLocale: "en-US",

  // Устанавливаем флаг, чтобы не выдавало ошибку, если локаль не найдена
  sync: true,

  // Отключить предупреждения о недостающих ключах
  missingWarn: false,

  // Поддерживаемые локали
  messages,
});

export default i18n;
