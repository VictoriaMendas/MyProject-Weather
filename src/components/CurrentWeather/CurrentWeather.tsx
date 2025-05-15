import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCurrentWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";

interface CurrentWeatherData {
  temperature: number;
  weather_code: number;
  wind_speed: number;
  humidity: number;
  time: string;
}

export const CurrentWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, currentWeather, error, isLoading } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      if (!coordinates.latitude || !coordinates.longitude) return; // Якщо немає координат, пропускаємо запит

      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              current:
                "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m",
              timezone: "auto",
            },
          }
        );

        const currentData = response.data.current;
        const weatherData: CurrentWeatherData = {
          temperature: currentData.temperature_2m,
          weather_code: currentData.weather_code,
          wind_speed: currentData.wind_speed_10m,
          humidity: currentData.relative_humidity_2m,
          time: currentData.time,
        };

        dispatch(setCurrentWeather(weatherData));
        dispatch(setError(null));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch current weather"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCurrentWeather();
  }, [coordinates, dispatch]);

  if (isLoading) return <div>Loading current weather...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentWeather) return <div>No current weather data available</div>;

  return (
    <div>
      <h2>Current Weather</h2>
      <p>Temperature: {currentWeather.temperature}°C</p>
      <p>Weather Code: {currentWeather.weather_code}</p>
      <p>Wind Speed: {currentWeather.wind_speed} km/h</p>
      <p>Humidity: {currentWeather.humidity}%</p>
      <p>Time: {new Date(currentWeather.time).toLocaleString()}</p>
    </div>
  );
};
