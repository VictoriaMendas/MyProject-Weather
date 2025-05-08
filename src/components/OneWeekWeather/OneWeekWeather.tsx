interface DailyWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

export const OneWeekWeather = () => {
  return <div>OneWeekWeather</div>;
};
