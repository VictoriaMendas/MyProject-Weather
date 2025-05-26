//реакт скрл ту топ бібліотека

import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { setError } from "./redux/weatherSlice";
import { Routes, Route } from "react-router-dom";
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
import { fetchUserInfo } from "./redux/weatherOperations";
import { Coords } from "./services/getUserInfo";
import { selectCity } from "./redux/selector";
import ScrollToTop from "react-scroll-to-top";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locationName = useSelector(selectCity);

  const { theme } = useTheme(); // Отримуємо поточну тему

  useEffect(() => {
    if (locationName) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const crd: Coords = {
            latitude,
            longitude,
          };
          dispatch(fetchUserInfo(crd));
        },
        (error) => {
          dispatch(setError(error.message || "Failed to get current position"));
        }
      );
    } else {
      dispatch(setError("Geolocation is not supported by this browser"));
    }
  }, [locationName, dispatch]);

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
      <ScrollToTop smooth component={<p style={{ color: "blue" }}>UP</p>} />
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
