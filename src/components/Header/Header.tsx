import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setCoordinates, setLocationName } from "../../redux/weatherSlice";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { GiHamburgerMenu } from "react-icons/gi";

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locationName } = useSelector((state: RootState) => state.weather);
  const [searchCity, setSearchCity] = useState("");
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchCity
        )}`
      );
      const data = await response.json();
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
    setIsSliderOpen(!isSliderOpen);
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
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
          {/* Тимчасово текстовий логотип */}
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
            <Link to="/one-day" onClick={closeSlider}>
              1 Day Forecast
            </Link>
            <Link to="/three-days" onClick={closeSlider}>
              3 Day Forecast
            </Link>
            <Link to="/one-week" onClick={closeSlider}>
              1 Week Forecast
            </Link>
            <Link to="/one-month" onClick={closeSlider}>
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
