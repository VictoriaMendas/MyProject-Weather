import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setThreeDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import { getThreeDayWeather } from "../../services/weatherService";
import styles from "../ThreeDaysWeather/ThreeDaysWeather.module.css";

export const ThreeDaysWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, threeDayWeather, isLoading, error } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    if (coordinates) {
      const fetchThreeDayWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = await getThreeDayWeather(
            coordinates.latitude,
            coordinates.longitude
          );
          dispatch(setThreeDayWeather(data));
          dispatch(setError(null));
        } catch (error) {
          dispatch(
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch three day weather"
            )
          );
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchThreeDayWeather();
    }
  }, [coordinates, dispatch]);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!threeDayWeather) return null;

  return (
    <div className={styles.weather}>
      <h2>3 Day Weather</h2>
      {threeDayWeather.hourly.time.map((time: string, index: number) => (
        <div key={time} className={styles.forecastItem}>
          <p>{new Date(time).toLocaleString()}</p>
          <p>Temperature: {threeDayWeather.hourly.temperature_2m[index]}°C</p>
          <p>Weather Code: {threeDayWeather.hourly.weather_code[index]}</p>
        </div>
      ))}
    </div>
  );
};
