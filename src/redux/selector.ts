import { RootState } from "./store";

export const selectCoordinates = (state: RootState) =>
  state.weather.coordinates;

export const selectCity = (state: RootState) => state.weather.locationName;
