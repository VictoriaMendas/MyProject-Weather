import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// const BASE_URL = "https://api.openweathermap.org/data/2.5";
// axios.defaults.baseURL = BASE_URL;

interface IOneDayWeatherParams {
  address: string;
}
export const getOneDayWeather = async ({ address }: IOneDayWeatherParams) => {
  const { data } = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${address}`,
    {
      params: {
        key: API_KEY,
        language: "en",
        q: `${address}`,
      },
    }
  );

  return data;
};
