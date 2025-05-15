import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCurrentWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./CurrentWeather.module.css";

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
      if (!coordinates.latitude || !coordinates.longitude) return;

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

  if (isLoading)
    return <div className={styles.loader}>Loading current weather...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!currentWeather) return <div>No current weather data available</div>;

  return (
    <div className={styles.weather}>
      <h2>Current Weather</h2>
      <div className={styles.weatherMain}>
        <div className={styles.iconContainer}>
          {getWeatherIcon(currentWeather.weather_code, styles.weatherIcon)}
        </div>
        <div className={styles.tempContainer}>
          <p className={styles.temperature}>{currentWeather.temperature}°C</p>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <span className={styles.detail}>
          Wind: {currentWeather.wind_speed} km/h
        </span>
        <span className={styles.detail}>
          Humidity: {currentWeather.humidity}%
        </span>
        <span className={styles.detail}>
          Time: {new Date(currentWeather.time).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
