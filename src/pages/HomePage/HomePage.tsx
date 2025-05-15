import React from "react";
import { Outlet } from "react-router-dom";

import styles from "./HomePage.module.css";
import { WeatherNav } from "../../components/WeatherNav/WeatherNav";
import { CurrentWeather } from "../../components/CurrentWeather/CurrentWeather";

const HomePage: React.FC = () => {
  return (
    <main className={styles.container}>
      <CurrentWeather />

      <WeatherNav />
      <Outlet />
    </main>
  );
};

export default HomePage;
