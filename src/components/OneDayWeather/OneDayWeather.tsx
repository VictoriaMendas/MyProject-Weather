// ЗРОБИТИ АНИНХРОНУ ОПЕРАЦІЮ (СЕЛЕКТ ОПЕРЕЦІОНЮ СЕРВІСИ)
// Цей ЮзЕффект робити в Арр тільки не робити запитюІ записувати цю інфу в редакс.Налаштувати Редакс для початку.
// зберегти або координати або населений пунк залежить від запиту який я знайду і поміняю.
// коли я отримаю координати.треба визначити координати і за цими координатами визначити населений пункт
// з редаксу після збереження зчитувати код населеного пункту або координатюВиконувати запит і рендерити інфу.
// ,в кожному компоненті буде свій запит і рендер той чи іншої інфи
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setOneDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import { getOneDayWeather } from "../../services/weatherService";
import styles from "../OneDayWeather/OneDayWeather.module.css";

export const OneDayWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, oneDayWeather, isLoading, error } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    if (coordinates) {
      const fetchOneDayWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = await getOneDayWeather(
            coordinates.latitude,
            coordinates.longitude
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
  if (!oneDayWeather) return null;

  return (
    <div className={styles.weather}>
      <h2>1 Day Weather</h2>
      {oneDayWeather.hourly.time.map((time: string, index: number) => (
        <div key={time} className={styles.forecastItem}>
          <p>{new Date(time).toLocaleTimeString()}</p>
          <p>Temperature: {oneDayWeather.hourly.temperature_2m[index]}°C</p>
          <p>Weather Code: {oneDayWeather.hourly.weather_code[index]}</p>
        </div>
      ))}
    </div>
  );
};
