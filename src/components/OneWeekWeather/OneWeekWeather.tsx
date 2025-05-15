import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  setWeekWeather,
  setSelectedDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import axios from "axios";

export const OneWeekWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, weekWeather, selectedDayWeather, isLoading, error } =
    useSelector((state: RootState) => state.weather);

  // Локальний стан для відстеження обраного дня
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Запит за даними на тиждень
  useEffect(() => {
    const fetchWeekWeather = async () => {
      if (!coordinates.latitude || !coordinates.longitude) return;

      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              daily:
                "temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m,wind_speed_10m",
              forecast_days: 7, // 7 днів
              timezone: "auto",
            },
          }
        );

        const dailyData = response.data.daily;
        dispatch(setWeekWeather({ daily: dailyData }));
        dispatch(setError(null));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error ? err.message : "Failed to fetch week weather"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchWeekWeather();
  }, [coordinates, dispatch]);

  // Запит за погодинними даними для обраного дня
  useEffect(() => {
    const fetchHourlyWeatherForDay = async () => {
      if (!selectedDay || !coordinates.latitude || !coordinates.longitude)
        return;

      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              hourly:
                "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
              start_date: selectedDay,
              end_date: selectedDay,
              timezone: "auto",
            },
          }
        );

        const hourlyData = response.data.hourly;
        dispatch(setSelectedDayWeather({ hourly: hourlyData }));
        dispatch(setError(null));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch hourly weather"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchHourlyWeatherForDay();
  }, [selectedDay, coordinates, dispatch]);

  if (isLoading) return <div>Loading week weather...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weekWeather) return <div>No week weather data available</div>;

  return (
    <div>
      <h2>Weather for the Next 7 Days</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {weekWeather.daily.time.map((day, index) => (
          <div
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: selectedDay === day ? "#e0e0e0" : "white",
            }}
          >
            <p>Date: {new Date(day).toLocaleDateString()}</p>
            <p>Max Temp: {weekWeather.daily.temperature_2m_max[index]}°C</p>
            <p>Min Temp: {weekWeather.daily.temperature_2m_min[index]}°C</p>
            <p>Weather Code: {weekWeather.daily.weather_code[index]}</p>
            <p>Humidity: {weekWeather.daily.relative_humidity_2m[index]}%</p>
            <p>Wind Speed: {weekWeather.daily.wind_speed_10m[index]} km/h</p>
          </div>
        ))}
      </div>

      {selectedDay && selectedDayWeather && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            Hourly Weather for {new Date(selectedDay).toLocaleDateString()}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {selectedDayWeather.hourly.time.map((time, index) => (
              <div
                key={time}
                style={{ padding: "5px", border: "1px solid #ddd" }}
              >
                <p>Time: {new Date(time).toLocaleTimeString()}</p>
                <p>
                  Temperature: {selectedDayWeather.hourly.temperature_2m[index]}
                  °C
                </p>
                <p>
                  Weather Code: {selectedDayWeather.hourly.weather_code[index]}
                </p>
                <p>
                  Humidity:{" "}
                  {selectedDayWeather.hourly.relative_humidity_2m[index]}%
                </p>
                <p>
                  Wind Speed: {selectedDayWeather.hourly.wind_speed_10m[index]}{" "}
                  km/h
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
