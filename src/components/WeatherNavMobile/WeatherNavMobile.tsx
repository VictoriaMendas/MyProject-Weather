import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./WeatherNavMobile.module.css";

const WeatherNavMobile: React.FC = () => {
  const { theme } = useTheme();
  const [format, setFormat] = useState("1 Day");
  const formats = ["1 Day", "3 Days", "Week", "Month"];

  return (
    <div className={`${styles.nav} ${theme}`}>
      {formats.map((fmt) => (
        <button
          key={fmt}
          onClick={() => setFormat(fmt)}
          className={`${styles.button} ${format === fmt ? styles.active : ""}`}
        >
          {fmt}
        </button>
      ))}
    </div>
  );
};

export default WeatherNavMobile;
