import React, { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { setCity } from "../../redux/weatherSlice";
import MobileMenu from "../MobileMenu/MobileMenu";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const { city } = useSelector((state: RootState) => state.weather);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const saveCityToRecent = (city: string): void => {
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
      dispatch(setCity(searchCity));
      saveCityToRecent(searchCity);
      navigate(`/?city=${searchCity}`);
      setIsSliderOpen(false);
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
          currentCity={city}
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
