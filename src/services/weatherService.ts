import axios from "axios";
import {
  CurrentWeatherData,
  HourlyWeatherData,
  DailyWeatherData,
} from "../redux/weatherSlice";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const getCurrentWeather = async (
  latitude: number,
  longitude: number
): Promise<CurrentWeatherData> => {
  try {
    const response = await axios.get<CurrentWeatherData>(BASE_URL, {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,weather_code",
        timezone: "Europe/Kyiv", // Статичний часовий пояс
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Current weather not available"
    );
  }
};

export const getOneDayWeather = async (
  latitude: number,
  longitude: number
): Promise<HourlyWeatherData> => {
  try {
    const response = await axios.get<HourlyWeatherData>(BASE_URL, {
      params: {
        latitude,
        longitude,
        hourly: "temperature_2m,weather_code",
        timezone: "Europe/Kyiv",
        past_days: 0,
        forecast_days: 1,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "One day weather not available"
    );
  }
};

export const getThreeDayWeather = async (
  latitude: number,
  longitude: number
): Promise<HourlyWeatherData> => {
  try {
    const response = await axios.get<HourlyWeatherData>(BASE_URL, {
      params: {
        latitude,
        longitude,
        hourly: "temperature_2m,weather_code",
        timezone: "Europe/Kyiv",
        past_days: 0,
        forecast_days: 3,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Three day weather not available"
    );
  }
};

export const getWeekWeather = async (
  latitude: number,
  longitude: number
): Promise<DailyWeatherData> => {
  try {
    const response = await axios.get<DailyWeatherData>(BASE_URL, {
      params: {
        latitude,
        longitude,
        daily: "temperature_2m_max,temperature_2m_min,weather_code",
        timezone: "Europe/Kyiv",
        past_days: 0,
        forecast_days: 7,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Week weather not available"
    );
  }
};

export const getMonthWeather = async (
  latitude: number,
  longitude: number
): Promise<DailyWeatherData> => {
  try {
    const response = await axios.get<DailyWeatherData>(BASE_URL, {
      params: {
        latitude,
        longitude,
        daily: "temperature_2m_max,temperature_2m_min,weather_code",
        timezone: "Europe/Kyiv",
        past_days: 0,
        forecast_days: 16,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Month weather not available"
    );
  }
};
