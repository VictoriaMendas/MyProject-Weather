import React, { useState, useEffect } from "react";
import axios from "axios";

interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
}

const OneMonthWeather: React.FC = () => {
  const [weather, setWeather] = useState<DailyWeather | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude,
            longitude,
            daily: "temperature_2m_max,temperature_2m_min,weather_code",
            forecast_days: 14, // Змінили на 14 днів (в межах ліміту API)
            timezone: "auto",
          },
        }
      );
      setWeather(response.data.daily);
    } catch (err) {
      setError("Не вдалося отримати дані про погоду");
      console.error("Помилка при отриманні погоди:", err);
    }
  };

  useEffect(() => {
    // Координати для Києва
    fetchMonthWeather(50.4500336, 30.5241361);
  }, []);

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  if (!weather) {
    return <div>Завантаження...</div>;
  }

  return (
    <div>
      <h2>Прогноз погоди на 14 днів</h2>
      {weather.time.map((date, index) => (
        <div key={date}>
          <p>Дата: {date}</p>
          <p>Макс. температура: {weather.temperature_2m_max[index]}°C</p>
          <p>Мін. температура: {weather.temperature_2m_min[index]}°C</p>
          <p>Код погоди: {weather.weather_code[index]}</p>
        </div>
      ))}
    </div>
  );
};

export default OneMonthWeather;
