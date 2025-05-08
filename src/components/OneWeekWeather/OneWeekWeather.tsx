import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { setWeekWeather, setError, setLoading } from "../../redux/weatherSlice";
import { getWeekWeather } from "../../services/weatherService";
import styles from "../OneWeekWeather/OneWeekWeather.module.css";

export const OneWeekWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, weekWeather, isLoading, error } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    if (coordinates) {
      const fetchWeekWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = await getWeekWeather(
            coordinates.latitude,
            coordinates.longitude
          );
          dispatch(setWeekWeather(data));
          dispatch(setError(null));
        } catch (error) {
          dispatch(
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch week weather"
            )
          );
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchWeekWeather();
    }
  }, [coordinates, dispatch]);

  if (isLoading) return <div className={styles.loader}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!weekWeather) return null;

  return (
    <div className={styles.weather}>
      <h2>Week Weather</h2>
      {weekWeather.daily.time.map((time: string, index: number) => (
        <div key={time} className={styles.forecastItem}>
          <p>{new Date(time).toLocaleDateString()}</p>
          <p>Max Temp: {weekWeather.daily.temperature_2m_max[index]}°C</p>
          <p>Min Temp: {weekWeather.daily.temperature_2m_min[index]}°C</p>
          <p>Weather Code: {weekWeather.daily.weather_code[index]}</p>
        </div>
      ))}
    </div>
  );
};
