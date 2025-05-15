import { createSlice } from "@reduxjs/toolkit";

// Інтерфейси для типів даних
interface CurrentWeather {
  temperature: number;
  weather_code: number;
  wind_speed: number;
  humidity: number;
  time: string;
}

interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  weather_code: number[]; // Додаємо weather_code для денних даних
}

interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  weather_code: number[]; // Додаємо weather_code для погодинних даних
}

interface OneDayWeather {
  hourly: HourlyWeather;
}

// Основний інтерфейс стану
interface WeatherState {
  coordinates: { latitude: number | null; longitude: number | null };
  locationName: string;
  currentWeather: CurrentWeather | null;
  oneDayWeather: OneDayWeather | null;
  threeDayWeather: { hourly: HourlyWeather } | null;
  weekWeather: { daily: DailyWeather } | null;
  monthWeather: { daily: DailyWeather } | null;
  selectedDayWeather: { hourly: HourlyWeather } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  coordinates: { latitude: null, longitude: null },
  locationName: "",
  currentWeather: null,
  oneDayWeather: null,
  threeDayWeather: null,
  weekWeather: null,
  monthWeather: null,
  selectedDayWeather: null,
  isLoading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    setLocationName: (state, action) => {
      state.locationName = action.payload;
    },
    setCurrentWeather: (state, action) => {
      state.currentWeather = action.payload;
    },
    setOneDayWeather: (state, action) => {
      state.oneDayWeather = action.payload;
    },
    setThreeDayWeather: (state, action) => {
      state.threeDayWeather = action.payload;
    },
    setWeekWeather: (state, action) => {
      state.weekWeather = action.payload;
    },
    setMonthWeather: (state, action) => {
      state.monthWeather = action.payload;
    },
    setSelectedDayWeather: (state, action) => {
      state.selectedDayWeather = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCoordinates,
  setLocationName,
  setCurrentWeather,
  setOneDayWeather,
  setThreeDayWeather,
  setWeekWeather,
  setMonthWeather,
  setSelectedDayWeather,
  setLoading,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
