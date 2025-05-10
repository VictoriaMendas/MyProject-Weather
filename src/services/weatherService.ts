import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const getCoordinates = async (q: string) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${q}`
  );
  const data = response.data[0];
  if (!data) throw new Error("City not found");
  return { lat: parseFloat(data.lat), lon: parseFloat(data.lon) };
};

export const getOneDayWeather = async (latitude: number, longitude: number) => {
  const response = await axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      hourly: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
      forecast_days: 1,
    },
  });
  return response.data;
};

export const getThreeDayWeather = async (
  latitude: number,
  longitude: number
) => {
  const response = await axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      hourly: "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m",
      forecast_days: 3,
    },
  });
  return response.data;
};

export const getWeekWeather = async (latitude: number, longitude: number) => {
  const response = await axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      daily:
        "temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m,wind_speed_10m",
      forecast_days: 7,
    },
  });
  return response.data;
};

export const getMonthWeather = async (latitude: number, longitude: number) => {
  const response = await axios.get(BASE_URL, {
    params: {
      latitude,
      longitude,
      daily:
        "temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m,wind_speed_10m",
      forecast_days: 16,
    },
  });
  return response.data;
};
