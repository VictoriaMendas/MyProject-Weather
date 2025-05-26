import axios from "axios";
import { Coords } from "./getUserInfo";

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

export interface CurrentWeather {
  temperature: number;
  weather_code: number;
  wind_speed: number;
  humidity: number;
  time: string;
}

interface CurrentWeatherDataResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    time: string;
  };
}

export const getCurrentWeather = async (
  coordinates: Coords
): Promise<CurrentWeather> => {
  const response = await axios.get<CurrentWeatherDataResponse>(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        current:
          "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m",
        timezone: "auto",
      },
    }
  );

  const currentData = response.data.current;
  const weatherData: CurrentWeatherData = {
    temperature: currentData.temperature_2m,
    weather_code: currentData.weather_code,
    wind_speed: currentData.wind_speed_10m,
    humidity: currentData.relative_humidity_2m,
    time: currentData.time,
  };

  return weatherData;
};
