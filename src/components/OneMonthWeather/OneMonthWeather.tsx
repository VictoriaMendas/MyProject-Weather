import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setMonthWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import { getMonthWeather } from "../../services/weatherService";
import styles from "../OneMonthWeather/OneMonthWeather.module.css";

export const OneMonthWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, monthWeather, isLoading, error } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    if (coordinates) {
      const fetchMonthWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = await getMonthWeather(
            coordinates.latitude,
            coordinates.longitude
          );
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
  if (!monthWeather) return null;

  return (
    <div className={styles.weather}>
      <h2>Month Weather (16 Days)</h2>
      {monthWeather.daily.time.map((time: string, index: number) => (
        <div key={time} className={styles.forecastItem}>
          <p>{new Date(time).toLocaleDateString()}</p>
          <p>Max Temp: {monthWeather.daily.temperature_2m_max[index]}°C</p>
          <p>Min Temp: {monthWeather.daily.temperature_2m_min[index]}°C</p>
          <p>Weather Code: {monthWeather.daily.weather_code[index]}</p>
        </div>
      ))}
    </div>
  );
};
