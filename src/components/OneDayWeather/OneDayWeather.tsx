// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../redux/store";
// import {
//   setOneDayWeather,
//   setError,
//   setLoading,
// } from "../../redux/weatherSlice";
// import axios from "axios";
// import styles from "./OneDayWeather.module.css";

// export const OneDayWeather: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { coordinates, locationName, oneDayWeather, isLoading, error } =
//     useSelector((state: RootState) => state.weather);

//   useEffect(() => {
//     const fetchOneDayWeather = async () => {
//       if (!coordinates.latitude || !coordinates.longitude) return;

//       dispatch(setLoading(true));
//       try {
//         const today = new Date().toISOString().split("T")[0]; // Сьогоднішня дата у форматі YYYY-MM-DD
//         const response = await axios.get(
//           "https://api.open-meteo.com/v1/forecast",
//           {
//             params: {
//               latitude: coordinates.latitude,
//               longitude: coordinates.longitude,
//               hourly: "temperature_2m,wind_speed_10m,relative_humidity_2m",
//               start_date: today,
//               end_date: today,
//               timezone: "auto",
//             },
//           }
//         );

//         const hourlyData = response.data.hourly;
//         dispatch(setOneDayWeather({ hourly: hourlyData }));
//         dispatch(setError(null));
//       } catch (err) {
//         dispatch(
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Failed to fetch one day weather"
//           )
//         );
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     fetchOneDayWeather();
//   }, [coordinates, dispatch]);

//   const formatTime = (timeStr: string) => {
//     return new Date(timeStr).toLocaleString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) return <div className={styles.loader}>Loading...</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!oneDayWeather) return null;

//   return (
//     <div className={styles.weather}>
//       <h2>Today's Weather in {locationName}</h2>
//       <div className={styles.forecastContainer}>
//         {oneDayWeather.hourly.time.map((time, index) => (
//           <div key={time} className={styles.forecastItem}>
//             <div className={styles.forecastHeader}>
//               <p>{formatTime(time)}</p>
//             </div>
//             <p>Temperature: {oneDayWeather.hourly.temperature_2m[index]}°C</p>
//             <p>
//               Wind: {oneDayWeather.hourly.wind_speed_10m[index]} km/h, Humidity:{" "}
//               {oneDayWeather.hourly.relative_humidity_2m[index]}%
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  setOneDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import axios from "axios";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./OneDayWeather.module.css";
import LoadingCircleSpinner from "../LoadingCircleSpinner/LoadingCircleSpinner";

export const OneDayWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coordinates, locationName, oneDayWeather, isLoading, error } =
    useSelector((state: RootState) => state.weather);

  useEffect(() => {
    const fetchOneDayWeather = async () => {
      if (!coordinates.latitude || !coordinates.longitude) return;

      dispatch(setLoading(true));
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              hourly:
                "temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code",
              start_date: today,
              end_date: today,
              timezone: "auto",
            },
          }
        );

        const hourlyData = response.data.hourly;
        dispatch(setOneDayWeather({ hourly: hourlyData }));
        dispatch(setError(null));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch one day weather"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchOneDayWeather();
  }, [coordinates, dispatch]);

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <LoadingCircleSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!oneDayWeather) return null;

  return (
    <div className={styles.weather}>
      <h2>Today's Weather in {locationName}</h2>
      <div className={styles.forecastContainer}>
        {oneDayWeather.hourly.time.map((time, index) => (
          <div key={time} className={styles.forecastItem}>
            <div className={styles.forecastHeader}>
              {getWeatherIcon(
                oneDayWeather.hourly.weather_code[index],
                styles.weatherIcon
              )}
              <p>{formatTime(time)}</p>
            </div>
            <p>Temperature: {oneDayWeather.hourly.temperature_2m[index]}°C</p>
            <p>
              Wind: {oneDayWeather.hourly.wind_speed_10m[index]} km/h, Humidity:{" "}
              {oneDayWeather.hourly.relative_humidity_2m[index]}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
