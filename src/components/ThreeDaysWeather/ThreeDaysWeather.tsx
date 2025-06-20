// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../redux/store";
// import {
//   setThreeDayWeather,
//   setError,
//   setLoading,
// } from "../../redux/weatherSlice";
// import { getThreeDayWeather } from "../../services/weatherService";
// import { getWeatherIcon } from "../../utils/weatherIcons";
// import styles from "./ThreeDaysWeather.module.css";

// export const ThreeDaysWeather: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { coordinates, locationName, threeDayWeather, isLoading, error } =
//     useSelector((state: RootState) => state.weather);

//   useEffect(() => {
//     if (coordinates && coordinates.latitude && coordinates.longitude) {
//       const fetchThreeDayWeather = async () => {
//         dispatch(setLoading(true));
//         try {
//           const data = await getThreeDayWeather(
//             coordinates.latitude!,
//             coordinates.longitude!
//           );
//           dispatch(setThreeDayWeather(data));
//           dispatch(setError(null));
//         } catch (error) {
//           dispatch(
//             setError(
//               error instanceof Error
//                 ? error.message
//                 : "Failed to fetch three day weather"
//             )
//           );
//         } finally {
//           dispatch(setLoading(false));
//         }
//       };
//       fetchThreeDayWeather();
//     }
//   }, [coordinates, dispatch]);

//   if (isLoading) return <div className={styles.loader}>Loading...</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!threeDayWeather || !threeDayWeather.hourly) return null;

//   // Поточний час
//   const now = new Date();
//   const currentHour = now.getHours();
//   const currentDay = now.getDate();

//   // Фільтруємо дані
//   const filteredData = threeDayWeather.hourly.time
//     .map((time: string, index: number) => ({
//       time,
//       temperature: threeDayWeather.hourly.temperature_2m[index],
//       weatherCode: threeDayWeather.hourly.weather_code[index],
//       humidity: threeDayWeather.hourly.relative_humidity_2m[index],
//       windSpeed: threeDayWeather.hourly.wind_speed_10m[index],
//     }))
//     .filter((item) => {
//       const date = new Date(item.time);
//       const hour = date.getHours();
//       const day = date.getDate();
//       if (day === currentDay) {
//         return hour >= currentHour;
//       }
//       return true; // Показуємо всі наступні дні
//     });

//   return (
//     <div className={styles.weather}>
//       <h2>3 Day Weather in {locationName}</h2>
//       <div className={styles.forecastContainer}>
//         {filteredData.map((item, idx) => (
//           <div key={idx} className={styles.forecastItem}>
//             <div className={styles.forecastHeader}>
//               {getWeatherIcon(item.weatherCode, styles.weatherIcon)}
//               <p>
//                 {new Date(item.time).toLocaleString([], {
//                   month: "short",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </p>
//             </div>
//             <p>Temperature: {item.temperature}°C</p>
//             <p>
//               Wind: {item.windSpeed} km/h, Humidity: {item.humidity}%
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  setThreeDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import axios from "axios";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./ThreeDaysWeather.module.css";
import LoadingCircleSpinner from "../LoadingCircleSpinner/LoadingCircleSpinner";
import { Coords } from "../../services/getUserInfo";

export const ThreeDaysWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, locationName, threeDayWeather, isLoading, error } =
    useSelector((state: RootState) => state.weather);

  useEffect(() => {
    const fetchThreeDayWeather = async (coordinates: Coords | null) => {
      if (!coordinates) return;
      if (!coordinates.latitude || !coordinates.longitude) return;

      dispatch(setLoading(true));
      try {
        const today = new Date().toISOString().split("T")[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 2);
        const endDateStr = endDate.toISOString().split("T")[0];

        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              hourly:
                "temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code",
              start_date: today,
              end_date: endDateStr,
              timezone: "auto",
            },
          }
        );

        const hourlyData = response.data.hourly;
        dispatch(setThreeDayWeather({ hourly: hourlyData }));
        dispatch(setError(null));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch three day weather"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchThreeDayWeather(coordinates);
  }, [coordinates, dispatch]);

  if (isLoading) return <LoadingCircleSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!threeDayWeather || !threeDayWeather.hourly) return null;

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDate();

  const filteredData = threeDayWeather.hourly.time
    .map((time: string, index: number) => ({
      time,
      temperature: threeDayWeather.hourly.temperature_2m[index],
      weatherCode: threeDayWeather.hourly.weather_code[index],
      humidity: threeDayWeather.hourly.relative_humidity_2m[index],
      windSpeed: threeDayWeather.hourly.wind_speed_10m[index],
    }))
    .filter((item) => {
      const date = new Date(item.time);
      const hour = date.getHours();
      const day = date.getDate();
      if (day === currentDay) {
        return hour >= currentHour;
      }
      return true;
    });

  return (
    <div className={styles.weather}>
      <h2>3 Day Weather in {locationName}</h2>
      <div className={styles.forecastContainer}>
        {filteredData.map((item, idx) => (
          <div key={idx} className={styles.forecastItem}>
            <div className={styles.forecastHeader}>
              {getWeatherIcon(item.weatherCode, styles.weatherIcon)}
              <p>
                {new Date(item.time).toLocaleString([], {
                  month: "short",
                  day: "numeric",
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
