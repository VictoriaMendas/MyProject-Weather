import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  setCoordinates,
  setLocationName,
  setOneDayWeather,
  setThreeDayWeather,
  setWeekWeather,
  setMonthWeather,
} from "../../redux/weatherSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { WiThermometer } from "react-icons/wi";

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locationName } = useSelector((state: RootState) => state.weather);
  const [searchCity, setSearchCity] = useState("");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search triggered:", searchCity);
    if (!searchCity) return;

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "json",
            q: searchCity,
            limit: 1,
          },
          headers: {
            "User-Agent": "WeatherApp/1.0 (your-email@example.com)",
          },
        }
      );

      const data = response.data;
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        dispatch(
          setCoordinates({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          })
        );
        dispatch(setLocationName(display_name));
        setSearchCity("");
      } else {
        alert("City not found");
      }
    } catch (error) {
      console.error("Error searching city:", error);
      alert("Error searching city");
    }
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
