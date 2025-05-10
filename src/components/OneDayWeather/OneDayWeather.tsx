import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setOneDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import { getOneDayWeather } from "../../services/weatherService";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./OneDayWeather.module.css";

export const OneDayWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, locationName, oneDayWeather, isLoading, error } =
    useSelector((state: RootState) => state.weather);

  useEffect(() => {
    if (
      coordinates &&
      coordinates.latitude !== null &&
      coordinates.longitude !== null
    ) {
      const fetchOneDayWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = await getOneDayWeather(
            coordinates.latitude!,
            coordinates.longitude!
          );
          dispatch(setOneDayWeather(data));
          dispatch(setError(null));
        } catch (error) {
          dispatch(
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch one day weather"
            )
          );
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchOneDayWeather();
    }
  }, [coordinates, dispatch]);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!oneDayWeather || !oneDayWeather.hourly) return null;

  // Поточний час
  const now = new Date();
  const currentHour = now.getHours();

  // Фільтруємо дані, створюючи новий масив об’єктів
  const filteredData = oneDayWeather.hourly.time
    .map((time: string, index: number) => ({
      time,
      temperature: oneDayWeather.hourly.temperature_2m[index],
      weatherCode: oneDayWeather.hourly.weather_code[index],
      humidity: oneDayWeather.hourly.relative_humidity_2m[index],
      windSpeed: oneDayWeather.hourly.wind_speed_10m[index],
    }))
    .filter((item) => {
      const hour = new Date(item.time).getHours();
      return hour >= currentHour;
    });

  return (
    <div className={styles.weather}>
      <h2>1 Day Weather in {locationName}</h2>
      <div className={styles.forecastContainer}>
        {filteredData.map((item, idx) => (
          <div key={idx} className={styles.forecastItem}>
            <div className={styles.forecastHeader}>
              {getWeatherIcon(item.weatherCode, styles.weatherIcon)}
              <p>
                {new Date(item.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p>Temperature: {item.temperature}°C</p>
            <p>
              Wind: {item.windSpeed} km/h, Humidity: {item.humidity}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
