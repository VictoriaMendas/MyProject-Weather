import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";
axios.defaults.baseURL = BASE_URL;

interface IOneDayWeatherParams {
  lat: number;
  lon: number;
}
export const getOneDayWeather = async ({ lat, lon }: IOneDayWeatherParams) => {
  const response = await axios.get(
    `/forecast/hourly?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  return response.data;
};
