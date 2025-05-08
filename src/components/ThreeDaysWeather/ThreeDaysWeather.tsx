// import { useEffect, useState } from "react";
// import { getOneDayWeather } from "../../services/weatherService";

export const ThreeDaysWeather = () => {
  interface HourlyWeatherData {
    hourly: {
      time: string[];
      temperature_2m: number[];
      weather_code: number[];
    };
  }
  return <div>HourlyWeatherData</div>;
};
