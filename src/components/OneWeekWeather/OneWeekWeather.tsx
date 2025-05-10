import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { setWeekWeather, setError, setLoading } from "../../redux/weatherSlice";
import { getWeekWeather } from "../../services/weatherService";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./OneWeekWeather.module.css";

export const OneWeekWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, locationName, weekWeather, isLoading, error } =
    useSelector((state: RootState) => state.weather);

  useEffect(() => {
    if (
      coordinates &&
      coordinates.latitude !== null &&
      coordinates.longitude !== null
    ) {
      const fetchWeekWeather = async () => {
        dispatch(setLoading(true));
        try {
          const data = (await getWeekWeather(
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
  if (!weekWeather || !weekWeather.daily) return null;

  // Формуємо дані для відображення
  const dailyData = weekWeather.daily.time.map(
    (time: string, index: number) => ({
      time,
      maxTemp: weekWeather.daily.temperature_2m_max[index],
      minTemp: weekWeather.daily.temperature_2m_min[index],
      weatherCode: weekWeather.daily.weather_code[index],
      humidity: weekWeather.daily.relative_humidity_2m[index],
      windSpeed: weekWeather.daily.wind_speed_10m[index],
    })
  );

  return (
    <div className={styles.weather}>
      <h2>Week Weather in {locationName}</h2>
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
