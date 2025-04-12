import React from "react";
import { Outlet } from "react-router-dom";


import styles from "./HomePage.module.css";
import { WeatherNav } from "../../components/WeatherNav/WeatherNav";

// interface WeatherData {
//   main: { temp: number; humidity: number };
//   weather: { description: string; icon: string }[];
//   name: string;
// }


const HomePage: React.FC = () => {










  return (
    <main className={styles.container}>


      {/*Зробити комплонент КарентВезер викликати тут*/}
{/*Отримання координат потрібно в Апп виконати і зберегти цю інформацію в редаксі  */}

      {/* {currentWeather && (
        <div className={styles.currentWeather}>
          <h2>{currentWeather.name}</h2>
          <p>Temperature: {currentWeather.main.temp}°C</p>
          <p>Humidity: {currentWeather.main.humidity}%</p>
          <p>Weather: {currentWeather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`}
            alt="weather icon"
          />
        </div> */}
      {/* )} */}

      <WeatherNav />
      <Outlet />

  

     
    
    </main>
  );
};

export default HomePage;
