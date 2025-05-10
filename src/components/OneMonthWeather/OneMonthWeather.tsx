import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setMonthWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import { getMonthWeather } from "../../services/weatherService";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./OneMonthWeather.module.css";

export const OneMonthWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, locationName, monthWeather, isLoading, error } =
    useSelector((state: RootState) => state.weather);

  useEffect(() => {
    if (
      coordinates &&
      coordinates.latitude !== null &&
      coordinates.longitude !== null
    ) {
      const fetchMonthWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = (await getMonthWeather(
            coordinates.latitude!,
            coordinates.longitude!
          )) as {
            daily: {
              time: string[];
              temperature_2m_max: number[];
              temperature_2m_min: number[];
              weather_code: number[];
              relative_humidity_2m: number[];
              wind_speed_10m: number[];
            };
          };
          dispatch(setMonthWeather(data));
          dispatch(setError(null));
        } catch (error) {
          dispatch(
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch month weather"
            )
          );
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchMonthWeather();
    }
  }, [coordinates, dispatch]);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!monthWeather || !monthWeather.daily) return null;

  // Формуємо дані для відображення
  const dailyData = monthWeather.daily.time.map(
    (time: string, index: number) => ({
      time,
      maxTemp: monthWeather.daily.temperature_2m_max[index],
      minTemp: monthWeather.daily.temperature_2m_min[index],
      weatherCode: monthWeather.daily.weather_code[index],
      humidity: monthWeather.daily.relative_humidity_2m[index],
      windSpeed: monthWeather.daily.wind_speed_10m[index],
    })
  );

  return (
    <div className={styles.weather}>
      <h2>Month Weather (16 Days) in {locationName}</h2>
      <div className={styles.forecastContainer}>
        {dailyData.map((item, idx) => (
          <div key={idx} className={styles.forecastItem}>
            <div className={styles.forecastHeader}>
              {getWeatherIcon(item.weatherCode, styles.weatherIcon)}
              <p>
                {new Date(item.time).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <p>Max Temp: {item.maxTemp}°C</p>
            <p>Min Temp: {item.minTemp}°C</p>
            <p>
              Wind: {item.windSpeed} km/h, Humidity: {item.humidity}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
