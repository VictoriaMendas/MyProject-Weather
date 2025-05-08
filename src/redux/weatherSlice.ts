import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeatherData {
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
  };
}

// Тип для погодинного прогнозу (1 день, 3 дні)
export interface HourlyWeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
}

// Тип для щоденного прогнозу (тиждень, місяць)
export interface DailyWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

// Тип стану для погоди
interface WeatherState {
  coordinates: Coordinates | null;
  timezone: string | null;
  currentWeather: CurrentWeatherData | null;
  oneDayWeather: HourlyWeatherData | null;
  threeDayWeather: HourlyWeatherData | null;
  weekWeather: DailyWeatherData | null;
  monthWeather: DailyWeatherData | null;
  city: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  coordinates: null,
  timezone: null,
  currentWeather: null,
  oneDayWeather: null,
  threeDayWeather: null,
  weekWeather: null,
  monthWeather: null,
  city: "Kyiv",
  isLoading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setCoordinates: (state, action: PayloadAction<Coordinates>) => {
      state.coordinates = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setCurrentWeather: (state, action: PayloadAction<CurrentWeatherData>) => {
      state.currentWeather = action.payload;
    },
    setOneDayWeather: (state, action: PayloadAction<HourlyWeatherData>) => {
      state.oneDayWeather = action.payload;
    },
    setThreeDayWeather: (state, action: PayloadAction<HourlyWeatherData>) => {
      state.threeDayWeather = action.payload;
    },
    setWeekWeather: (state, action: PayloadAction<DailyWeatherData>) => {
      state.weekWeather = action.payload;
    },
    setMonthWeather: (state, action: PayloadAction<DailyWeatherData>) => {
      state.monthWeather = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCoordinates,
  setCity,
  setCurrentWeather,
  setOneDayWeather,
  setThreeDayWeather,
  setWeekWeather,
  setMonthWeather,
  setLoading,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
