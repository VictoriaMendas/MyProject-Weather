import React, { useState } from "react";
import styles from "./WeatherNavMain.module.css";

interface WeatherNavMainProps {
  onFormatChange: (format: string) => void;
}

const WeatherNavMain: React.FC<WeatherNavMainProps> = ({ onFormatChange }) => {
  const [format, setFormat] = useState("1 Day");
  const formats = ["1 Day", "3 Days", "Week", "Month"];

  const handleFormatChange = (fmt: string) => {
    setFormat(fmt);
    onFormatChange(fmt);
  };

  return (
    <div className={styles.nav}>
      {formats.map((fmt) => (
        <button
          key={fmt}
          onClick={() => handleFormatChange(fmt)}
          className={`${styles.button} ${format === fmt ? styles.active : ""}`}
        >
          {fmt}
        </button>
      ))}
    </div>
  );
};

export default WeatherNavMain;
