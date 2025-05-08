import { useEffect, useState } from "react";
import { getOneDayWeather } from "../../services/weatherService";

interface DailyWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

export const OneDayWeather = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    // ЗРОБИТИ АНИНХРОНУ ОПЕРАЦІЮ (СЕЛЕКТ ОПЕРЕЦІОНЮ СЕРВІСИ)
    // Цей ЮзЕффект робити в Арр тільки не робити запитюІ записувати цю інфу в редакс.Налаштувати Редакс для початку.
    // зберегти або координати або населений пунк залежить від запиту який я знайду і поміняю.
    // коли я отримаю координати.треба визначити координати і за цими координатами визначити населений пункт
    // з редаксу після збереження зчитувати код населеного пункту або координатюВиконувати запит і рендерити інфу.
    // ,в кожному компоненті буде свій запит і рендер той чи іншої інфи
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    async function success() {
      try {
        const data = await getOneDayWeather(12);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
      console.log("Your current position is:");
      console.log(`Address : ${address}`);
    }

    function error(err: { code: number; message: string }) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);
  return <div>One Day Weather</div>;
};
