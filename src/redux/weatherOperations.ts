import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Coords,
  getCityDetailsByCoords,
  getCityDetailsByQuery,
} from "../services/getUserInfo";
import { getCurrentWeather } from "../services/weatherService";
import { RootState } from "./store";

export const fetchUserInfo = createAsyncThunk(
  "weather/fetchUserInfo",
  async (crd: Coords) => {
    const data = await getCityDetailsByCoords(crd);

    return data;
  }
);

export const fetchCityDetails = createAsyncThunk(
  "weather/fetchCityDetails",
  async (query: string) => {
    const data = await getCityDetailsByQuery(query);
    return data;
  }
);

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrentWeather",
  async (_, thunkApi) => {
    const crd = (thunkApi.getState() as RootState).weather.coordinates;
    try {
      const data = await getCurrentWeather(crd!);

      return data;
    } catch {
      return thunkApi.rejectWithValue("Somesing went wrong");
    }
  },
  {
    condition: (_: void, thunkApi) => {
      const state = thunkApi.getState() as RootState;
      return Boolean(state.weather.coordinates);
    },
  }
);
