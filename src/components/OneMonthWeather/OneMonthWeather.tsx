// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../redux/store";
// import {
//   setMonthWeather,
//   setSelectedDayWeather,
//   setError,
//   setLoading,
// } from "../../redux/weatherSlice";
// import axios from "axios";
// import styles from "./OneMonthWeather.module.css";

// export const OneMonthWeather: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     coordinates,
//     locationName,
//     monthWeather,
//     selectedDayWeather,
//     isLoading,
//     error,
//   } = useSelector((state: RootState) => state.weather);

//   const [selectedDay, setSelectedDay] = useState<string | null>(null);

//   // Запит за даними на місяць (14 днів)
//   useEffect(() => {
//     const fetchMonthWeather = async () => {
//       if (!coordinates.latitude || !coordinates.longitude) return;

//       dispatch(setLoading(true));
//       try {
//         // Спочатку отримуємо дати для 14 днів
//         const dailyResponse = await axios.get(
//           "https://api.open-meteo.com/v1/forecast",
//           {
//             params: {
//               latitude: coordinates.latitude,
//               longitude: coordinates.longitude,
//               daily: "temperature_2m_max",
//               forecast_days: 14,
//               timezone: "auto",
//             },
//           }
//         );

//         const dailyData = dailyResponse.data.daily;
//         const startDate = dailyData.time[0]; // Перший день
//         const endDate = dailyData.time[dailyData.time.length - 1]; // Останній день

//         // Отримуємо погодинні дані за весь період
//         const hourlyResponse = await axios.get(
//           "https://api.open-meteo.com/v1/forecast",
//           {
//             params: {
//               latitude: coordinates.latitude,
//               longitude: coordinates.longitude,
//               hourly: "wind_speed_10m,relative_humidity_2m",
//               start_date: startDate,
//               end_date: endDate,
//               timezone: "auto",
//             },
//           }
//         );

//         const hourlyData = hourlyResponse.data.hourly;

//         // Агрегуємо погодинні дані в денні
//         const aggregatedData: {
//           time: string[];
//           temperature_2m_max: number[];
//           wind_speed_10m: number[];
//           relative_humidity_2m: number[];
//         } = {
//           time: dailyData.time,
//           temperature_2m_max: dailyData.temperature_2m_max,
//           wind_speed_10m: [],
//           relative_humidity_2m: [],
//         };

//         dailyData.time.forEach((day: string) => {
//           // Фільтруємо погодинні дані за поточним днем
//           const dayStart = new Date(day).setHours(0, 0, 0, 0);
//           const dayEnd = new Date(day).setHours(23, 59, 59, 999);

//           const dayHourlyIndices = hourlyData.time
//             .map((time: string, index: number) => ({ time, index }))
//             .filter(({ time }: { time: string }) => {
//               const timeMs = new Date(time).getTime();
//               return timeMs >= dayStart && timeMs <= dayEnd;
//             })
//             .map(({ index }: { index: number }) => index);

//           // Обчислюємо максимальну швидкість вітру за день
//           const windSpeeds = dayHourlyIndices.map(
//             (index: number) => hourlyData.wind_speed_10m[index]
//           );
//           const maxWindSpeed =
//             windSpeeds.length > 0 ? Math.max(...windSpeeds) : 0;

//           // Обчислюємо середню вологість за день
//           const humidities = dayHourlyIndices.map(
//             (index: number) => hourlyData.relative_humidity_2m[index]
//           );
//           const avgHumidity =
//             humidities.length > 0
//               ? humidities.reduce((sum: number, val: number) => sum + val, 0) /
//                 humidities.length
//               : 0;

//           aggregatedData.wind_speed_10m.push(maxWindSpeed);
//           aggregatedData.relative_humidity_2m.push(avgHumidity);
//         });

//         console.log("Aggregated data:", aggregatedData); // Дебагінг
//         dispatch(setMonthWeather({ daily: aggregatedData }));
//         dispatch(setError(null));
//       } catch (err) {
//         dispatch(
//           setError(
//             err instanceof Error ? err.message : "Failed to fetch month weather"
//           )
//         );
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     fetchMonthWeather();
//   }, [coordinates, dispatch]);

//   // Форматування дати для API
//   const formatDateForApi = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toISOString().split("T")[0]; // Формат YYYY-MM-DD
//   };

//   // Запит за погодинними даними для обраного дня
//   useEffect(() => {
//     const fetchHourlyWeatherForDay = async () => {
//       if (!selectedDay || !coordinates.latitude || !coordinates.longitude)
//         return;

//       dispatch(setLoading(true));
//       try {
//         const formattedDate = formatDateForApi(selectedDay);
//         const response = await axios.get(
//           "https://api.open-meteo.com/v1/forecast",
//           {
//             params: {
//               latitude: coordinates.latitude,
//               longitude: coordinates.longitude,
//               hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
//               start_date: formattedDate,
//               end_date: formattedDate,
//               timezone: "auto",
//             },
//           }
//         );

//         const hourlyData = response.data.hourly;
//         console.log("Hourly data for selected day:", hourlyData); // Дебагінг
//         if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) {
//           throw new Error("No hourly data available for the selected day");
//         }
//         dispatch(setSelectedDayWeather({ hourly: hourlyData }));
//         dispatch(setError(null));
//       } catch (err) {
//         dispatch(
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Failed to fetch hourly weather"
//           )
//         );
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     fetchHourlyWeatherForDay();
//   }, [selectedDay, coordinates, dispatch]);

//   const formatDate = (dateStr: string) => {
//     return new Date(dateStr).toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatTime = (timeStr: string) => {
//     return new Date(timeStr).toLocaleString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) return <div className={styles.loader}>Loading...</div>;
//   if (error) return <div className={styles.error}>{error}</div>;
//   if (!monthWeather) return null;

//   return (
//     <div className={styles.weather}>
//       <h2>14-Day Weather in {locationName}</h2>
//       <div className={styles.forecastContainer}>
//         {monthWeather.daily.time.map((day, index) => (
//           <div
//             key={day}
//             className={styles.forecastItem}
//             onClick={() => setSelectedDay(day)}
//           >
//             <div className={styles.forecastHeader}>
//               <p>{formatDate(day)}</p>
//             </div>
//             <p>Temperature: {monthWeather.daily.temperature_2m_max[index]}°C</p>
//             <p>
//               Wind: {monthWeather.daily.wind_speed_10m[index]} km/h, Humidity:{" "}
//               {monthWeather.daily.relative_humidity_2m[index]}%
//             </p>
//           </div>
//         ))}
//       </div>

//       {selectedDay &&
//         selectedDayWeather &&
//         selectedDayWeather.hourly &&
//         selectedDayWeather.hourly.time && (
//           <div className={styles.weather}>
//             <h3>Hourly Weather for {formatDate(selectedDay)}</h3>
//             <div className={styles.forecastContainer}>
//               {selectedDayWeather.hourly.time.map((time, index) => (
//                 <div key={time} className={styles.forecastItem}>
//                   <div className={styles.forecastHeader}>
//                     <p>{formatTime(time)}</p>
//                   </div>
//                   <p>
//                     Temperature:{" "}
//                     {selectedDayWeather.hourly.temperature_2m[index]}°C
//                   </p>
//                   <p>
//                     Wind: {selectedDayWeather.hourly.wind_speed_10m[index]}{" "}
//                     km/h, Humidity:{" "}
//                     {selectedDayWeather.hourly.relative_humidity_2m[index]}%
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  setMonthWeather,
  setSelectedDayWeather,
  setError,
  setLoading,
} from "../../redux/weatherSlice";
import axios from "axios";
import { getWeatherIcon } from "../../utils/weatherIcons";
import styles from "./OneMonthWeather.module.css";
import LoadingCircleSpinner from "../LoadingCircleSpinner/LoadingCircleSpinner";
import { Coords } from "../../services/getUserInfo";

export const OneMonthWeather: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    coordinates,
    locationName,
    monthWeather,
    selectedDayWeather,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.weather);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthWeather = async (coordinates: Coords): Promise<void> => {
      console.log(coordinates);
      if (!coordinates.latitude || !coordinates.longitude) return;

      dispatch(setLoading(true));
      try {
        const dailyResponse = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              daily: "temperature_2m_max,weather_code",
              forecast_days: 14,
              timezone: "auto",
            },
          }
        );

        const dailyData = dailyResponse.data.daily;
        const startDate = dailyData.time[0];
        const endDate = dailyData.time[dailyData.time.length - 1];

        const hourlyResponse = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              hourly: "wind_speed_10m,relative_humidity_2m",
              start_date: startDate,
              end_date: endDate,
              timezone: "auto",
            },
          }
        );

        const hourlyData = hourlyResponse.data.hourly;

        const aggregatedData: {
          time: string[];
          temperature_2m_max: number[];
          wind_speed_10m: number[];
          relative_humidity_2m: number[];
          weather_code: number[];
        } = {
          time: dailyData.time,
          temperature_2m_max: dailyData.temperature_2m_max,
          weather_code: dailyData.weather_code,
          wind_speed_10m: [],
          relative_humidity_2m: [],
        };

        dailyData.time.forEach((day: string) => {
          const dayStart = new Date(day).setHours(0, 0, 0, 0);
          const dayEnd = new Date(day).setHours(23, 59, 59, 999);

          const dayHourlyIndices = hourlyData.time
            .map((time: string, index: number) => ({ time, index }))
            .filter(({ time }: { time: string }) => {
              const timeMs = new Date(time).getTime();
              return timeMs >= dayStart && timeMs <= dayEnd;
            })
            .map(({ index }: { index: number }) => index);

          const windSpeeds = dayHourlyIndices.map(
            (index: number) => hourlyData.wind_speed_10m[index]
          );
          const maxWindSpeed =
            windSpeeds.length > 0 ? Math.max(...windSpeeds) : 0;

          const humidities = dayHourlyIndices.map(
            (index: number) => hourlyData.relative_humidity_2m[index]
          );
          const avgHumidity =
            humidities.length > 0
              ? humidities.reduce((sum: number, val: number) => sum + val, 0) /
                humidities.length
              : 0;

          aggregatedData.wind_speed_10m.push(maxWindSpeed);
          aggregatedData.relative_humidity_2m.push(avgHumidity);
        });

        console.log("Aggregated data:", aggregatedData);
        dispatch(setMonthWeather({ daily: aggregatedData }));
        dispatch(setError(null));
      } catch (err) {
        dispatch(
          setError(
            err instanceof Error ? err.message : "Failed to fetch month weather"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMonthWeather();
  }, [coordinates, dispatch]);

  const formatDateForApi = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchHourlyWeatherForDay = async (coordinates: Coords) => {
      if (!selectedDay || !coordinates.latitude || !coordinates.longitude)
        return;

      dispatch(setLoading(true));
      try {
        const formattedDate = formatDateForApi(selectedDay);
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              hourly:
                "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
              start_date: formattedDate,
              end_date: formattedDate,
              timezone: "auto",
            },
          }
        );

        const hourlyData = response.data.hourly;
        console.log("Hourly data for selected day:", hourlyData);
        if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) {
          throw new Error("No hourly data available for the selected day");
        }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <LoadingCircleSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!monthWeather) return null;

  return (
    <div className={styles.weather}>
      <h2>14-Day Weather in {locationName}</h2>
      <div className={styles.forecastContainer}>
        {monthWeather.daily.time.map((day, index) => (
          <div
            key={day}
            className={styles.forecastItem}
            onClick={() => setSelectedDay(day)}
          >
            <div className={styles.forecastHeader}>
              {getWeatherIcon(
                monthWeather.daily.weather_code[index],
                styles.weatherIcon
              )}
              <p>{formatDate(day)}</p>
            </div>
            <p>Temperature: {monthWeather.daily.temperature_2m_max[index]}°C</p>
            <p>
              Wind: {monthWeather.daily.wind_speed_10m[index]} km/h, Humidity:{" "}
              {monthWeather.daily.relative_humidity_2m[index]}%
            </p>
          </div>
        ))}
      </div>

      {selectedDay &&
        selectedDayWeather &&
        selectedDayWeather.hourly &&
        selectedDayWeather.hourly.time && (
          <div className={styles.weather}>
            <h3>Hourly Weather for {formatDate(selectedDay)}</h3>
            <div className={styles.forecastContainer}>
              {selectedDayWeather.hourly.time.map((time, index) => (
                <div key={time} className={styles.forecastItem}>
                  <div className={styles.forecastHeader}>
                    {getWeatherIcon(
                      selectedDayWeather.hourly.weather_code[index],
                      styles.weatherIcon
                    )}
                    <p>{formatTime(time)}</p>
                  </div>
                  <p>
                    Temperature:{" "}
                    {selectedDayWeather.hourly.temperature_2m[index]}°C
                  </p>
                  <p>
                    Wind: {selectedDayWeather.hourly.wind_speed_10m[index]}{" "}
                    km/h, Humidity:{" "}
                    {selectedDayWeather.hourly.relative_humidity_2m[index]}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
