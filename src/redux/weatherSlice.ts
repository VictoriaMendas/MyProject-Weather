import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
}

interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
}

interface WeatherState {
  coordinates: Coordinates;
  locationName: string;
  oneDayWeather: { hourly: HourlyWeather } | null;
  threeDayWeather: { hourly: HourlyWeather } | null;
  weekWeather: { daily: DailyWeather } | null;
  monthWeather: { daily: DailyWeather } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  coordinates: { latitude: null, longitude: null },
  locationName: "",
  oneDayWeather: null,
  threeDayWeather: null,
  weekWeather: null,
  monthWeather: null,
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
    setLocationName: (state, action: PayloadAction<string>) => {
      state.locationName = action.payload;
    },
    setOneDayWeather: (
      state,
      action: PayloadAction<{ hourly: HourlyWeather }>
    ) => {
      state.oneDayWeather = action.payload;
    },
    setThreeDayWeather: (
      state,
      action: PayloadAction<{ hourly: HourlyWeather }>
    ) => {
      state.threeDayWeather = action.payload;
    },
    setWeekWeather: (state, action: PayloadAction<{ daily: DailyWeather }>) => {
      state.weekWeather = action.payload;
    },
    setMonthWeather: (
      state,
      action: PayloadAction<{ daily: DailyWeather }>
    ) => {
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
  setLocationName,
  setOneDayWeather,
  setThreeDayWeather,
  setWeekWeather,
  setMonthWeather,
  setLoading,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
