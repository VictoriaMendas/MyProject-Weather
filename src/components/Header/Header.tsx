import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setOneDayWeather,
  setThreeDayWeather,
  setWeekWeather,
  setMonthWeather,
} from "../../redux/weatherSlice";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

import { motion } from "framer-motion";

import { GiHamburgerMenu } from "react-icons/gi";
import { WiThermometer } from "react-icons/wi";
import { fetchCityDetails } from "../../redux/weatherOperations";

import { useTheme } from "../../context/ThemeContext";

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locationName } = useSelector((state: RootState) => state.weather);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const [searchCity, setSearchCity] = useState("");

  const container = {
    width: 100,
    height: 50,
    backgroundColor: "rgb(12, 11, 11)",
    borderRadius: 50,
    borderColor: "none",
    cursor: "pointer",
    display: "flex",
    padding: "5px 8px",
  };

  const handle = {
    width: 40,
    height: 40,
    backgroundColor: "#9911ff",
    borderRadius: "50%",
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search triggered:", searchCity);
    if (!searchCity) return;
    dispatch(fetchCityDetails(searchCity));

    setSearchCity("");
  };

  const toggleSlider = () => {
    console.log("Toggle slider:", !isSliderOpen);
    setIsSliderOpen(!isSliderOpen);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
  };

  const clearWeatherData = (forecastType: string) => {
    // Очищаємо попередні дані перед переходом
    if (forecastType !== "one-day") dispatch(setOneDayWeather(null));
    if (forecastType !== "three-days") dispatch(setThreeDayWeather(null));
    if (forecastType !== "one-week") dispatch(setWeekWeather(null));
    if (forecastType !== "one-month") dispatch(setMonthWeather(null));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSlider();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        closeSlider();
      }
    };
    if (isSliderOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSliderOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <WiThermometer size={30} />
          <span>WeatherApp</span>
        </div>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city..."
            className={styles.searchInput}
          />
        </form>
        <button
          className="toggle-container"
          style={{
            ...container,
            justifyContent: "flex-" + (theme === "light" ? "start" : "end"),
          }}
          onClick={toggleTheme}
        >
          <motion.div
            className="toggle-handle"
            style={handle}
            layout
            transition={{
              type: "spring",
              visualDuration: 0.2,
              bounce: 0.2,
            }}
          />
        </button>
        <div className={styles.burger} onClick={toggleSlider}>
          <GiHamburgerMenu size={30} className={styles.burgerIcon} />
        </div>
      </header>

      <div
        ref={sliderRef}
        className={`${styles.slider} ${isSliderOpen ? styles.sliderOpen : ""}`}
      >
        <div className={styles.sliderContent}>
          <h3>{locationName || "Current City"}</h3>
          <nav className={styles.sliderNav}>
            <Link
              to="/one-day"
              onClick={() => {
                clearWeatherData("one-day");
                closeSlider();
              }}
            >
              1 Day Forecast
            </Link>
            <Link
              to="/three-days"
              onClick={() => {
                clearWeatherData("three-days");
                closeSlider();
              }}
            >
              3 Day Forecast
            </Link>
            <Link
              to="/one-week"
              onClick={() => {
                clearWeatherData("one-week");
                closeSlider();
              }}
            >
              1 Week Forecast
            </Link>
            <Link
              to="/one-month"
              onClick={() => {
                clearWeatherData("one-month");
                closeSlider();
              }}
            >
              1 Month Forecast
            </Link>
          </nav>
        </div>
        <div className={styles.clouds}>
          <div className={styles.cloud1}></div>
          <div className={styles.cloud2}></div>
          <div className={styles.cloud3}></div>
        </div>
      </div>
    </>
  );
};
