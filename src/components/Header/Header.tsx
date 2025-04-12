import React, { useState, useEffect } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [currentCity, setCurrentCity] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCities = localStorage.getItem("recentCities");
    if (storedCities) {
      setRecentCities(JSON.parse(storedCities));
    }
  }, []);

  const saveCityToRecent = (city: string): void => {
    setCurrentCity(city);
    const updatedCities = [
      city,
      ...recentCities.filter((c) => c !== city),
    ].slice(0, 3);
    setRecentCities(updatedCities);
    localStorage.setItem("recentCities", JSON.stringify(updatedCities));
    setSearchCity("");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!API_KEY) {
          throw new Error(
            "VITE_OPENWEATHER_API_KEY is not defined in .env file"
          );
        }
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
          throw new Error("City not found");
        }
        saveCityToRecent(searchCity);
        navigate(`/?city=${searchCity}`);
        setIsSliderOpen(false);
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Weather App</div>
      <button
        className={styles.burger}
        onClick={() => setIsSliderOpen(!isSliderOpen)}
      >
        <FaBars size={24} />
      </button>
      <div className={`${styles.slider} ${isSliderOpen ? styles.open : ""}`}>
        <MobileMenu
          currentCity={currentCity}
          recentCities={recentCities}
          saveCityToRecent={saveCityToRecent}
          setIsSliderOpen={setIsSliderOpen}
          navigate={navigate}
        />
      </div>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city..."
            className={styles.searchInput}
          />
        </div>
      </form>
    </header>
  );
};

export default Header;
