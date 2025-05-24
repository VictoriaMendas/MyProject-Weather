//

import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { setCoordinates, setError, setLoading } from "./redux/weatherSlice";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { OneDayWeather } from "./components/OneDayWeather/OneDayWeather";
import { ThreeDaysWeather } from "./components/ThreeDaysWeather/ThreeDaysWeather";
import { OneWeekWeather } from "./components/OneWeekWeather/OneWeekWeather";
import { OneMonthWeather } from "./components/OneMonthWeather/OneMonthWeather";
import styles from "./App.module.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion"; // Додаємо для анімації
import { WiCloud } from "react-icons/wi"; // Іконка хмарки
import { FaStar } from "react-icons/fa"; // Іконки зірок і планет
import { useTheme } from "./context/ThemeContext"; // Використовуємо ThemeContext

interface OpenCageResponse {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
    components: {
      city?: string;
      town?: string;
      village?: string;
    };
  }>;
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const locationName = useSelector(
    (state: RootState) => state.weather.locationName
  );
  const cityFromUrl = searchParams.get("city") || locationName;
  const { theme } = useTheme(); // Отримуємо поточну тему

  // useEffect #1 (не чіпаємо)
  useEffect(() => {
    if (!cityFromUrl) return;
    const fetchCoordinatesAndLocation = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get<OpenCageResponse>(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              q: cityFromUrl,
              key: import.meta.env.VITE_OPENWEATHER_API_KEY,
              pretty: 1,
              language: "en",
            },
          }
        );

        if (!response.data.results.length) {
          throw new Error("City not found via geocoding");
        }

        const { lat, lng } = response.data.results[0].geometry;
        dispatch(setCoordinates({ latitude: lat, longitude: lng }));

        dispatch(setError(null));
      } catch (error) {
        dispatch(
          setError(error instanceof Error ? error.message : "City not found")
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCoordinatesAndLocation();
  }, [cityFromUrl, dispatch]);

  // useEffect #2 (не чіпаємо)
  useEffect(() => {
    if (!locationName) return;
    setSearchParams({ city: locationName });
  }, [locationName, setSearchParams]);

  useEffect(() => {
    if (locationName) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setCoordinates({ latitude, longitude })); // Зберігаємо координати
        },
        (error) => {
          dispatch(setError(error.message || "Failed to get current position"));
        }
      );
    } else {
      dispatch(setError("Geolocation is not supported by this browser"));
    }
  }, [locationName, dispatch]); // Залежність від locationName, щоб реагувати на його зміну

  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />}>
            <Route index path="one-day" element={<OneDayWeather />} />
            <Route path="three-days" element={<ThreeDaysWeather />} />
            <Route path="one-week" element={<OneWeekWeather />} />
            <Route path="one-month" element={<OneMonthWeather />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Додаємо плаваючі іконки */}
      {theme === "light" ? (
        <>
          {/* Хмарка 1 */}
          <motion.div
            className={styles.cloud}
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ top: "20%" }}
          >
            <WiCloud size={80} color="rgba(255, 255, 255, 0.8)" />
          </motion.div>
          {/* Хмарка 2 */}
          <motion.div
            className={styles.cloud}
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw" }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              delay: 5,
            }}
            style={{ top: "40%" }}
          >
            <WiCloud size={60} color="rgba(255, 255, 255, 0.7)" />
          </motion.div>

          <motion.div
            className={styles.cloud}
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw" }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              delay: 10,
            }}
            style={{ top: "60%" }}
          >
            <WiCloud size={100} color="rgba(255, 255, 255, 0.6)" />
          </motion.div>
          <motion.div
            className={styles.cloud}
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ top: "20%" }}
          >
            <WiCloud size={80} color="rgba(255, 255, 255, 0.8)" />
          </motion.div>
          <motion.div
            className={styles.cloud}
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw" }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              delay: 5,
            }}
            style={{ top: "40%" }}
          >
            <WiCloud size={60} color="rgba(255, 255, 255, 0.7)" />
          </motion.div>
        </>
      ) : (
        <>
          {/* Зірки */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.star}
              style={{
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <FaStar size={Math.random() * 5 + 3} color="#fff" />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default App;
