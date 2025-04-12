import React from "react";
import { NavigateFunction } from "react-router-dom";
import styles from "./MobileMenu.module.css";
import WeatherNavMobile from "../WeatherNavMobile/WeatherNavMobile";

interface MobileMenuProps {
  currentCity: string;
  recentCities: string[];
  saveCityToRecent: (city: string) => void;
  setIsSliderOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  currentCity,
  recentCities,
  saveCityToRecent,
  setIsSliderOpen,
  navigate,
}) => {
  return (
    <div className={styles.menu}>
      <h2 className={styles.logo}>Weather App</h2>
      <WeatherNavMobile />
      <h3>Current City: {currentCity}</h3>
      <h3>Recent Cities:</h3>
      <ul className={styles.cityList}>
        {recentCities.map((city) => (
          <li
            key={city}
            className={styles.cityItem}
            onClick={() => {
              saveCityToRecent(city);
              navigate(`/?city=${city}`);
              setIsSliderOpen(false);
            }}
          >
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileMenu;
