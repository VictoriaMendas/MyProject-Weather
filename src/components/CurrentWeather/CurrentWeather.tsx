export const CurrentWeather = () => {
  interface CurrentWeatherData {
    current: {
      time: string;
      temperature_2m: number;
      weather_code: number;
    };
  }
  return <div>CurrentWeather</div>;
};
