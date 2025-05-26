import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./CurrentWeather.module.css";
import { fetchCurrentWeather } from "../../redux/weatherOperations";

export const CurrentWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWeather, locationName, error, isLoading } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    if (!locationName) return;
    dispatch(fetchCurrentWeather());
  }, [dispatch, locationName]);

  if (isLoading)
    return <div className={styles.loader}>Loading current weather...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!currentWeather) return <div>No current weather data available</div>;

  return (
    <div className={styles.weather}>
      <h2>Current Weather in {locationName || "Unknown Location"}</h2>
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
