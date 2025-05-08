import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./redux/store";
import {
  setCoordinates,
  setCity,
  setError,
  setLoading,
} from "./redux/weatherSlice";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { OneDayWeather } from "./components/OneDayWeather/OneDayWeather";
import { ThreeDaysWeather } from "./components/ThreeDaysWeather/ThreeDaysWeather";
import { OneWeekWeather } from "./components/OneWeekWeather/OneWeekWeather";
import { OneMonthWeather } from "./components/OneMonthWeather/OneMonthWeather";

interface OpenCageResponse {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { city } = useSelector((state: RootState) => state.weather);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cityFromUrl = searchParams.get("city") || city;
    dispatch(setCity(cityFromUrl));

    const fetchCoordinates = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get<OpenCageResponse>(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              q: cityFromUrl,
              key: import.meta.env.VITE_OPENWEATHER_API_KEY,
              pretty: 1,
              language: "uk",
            },
          }
        );

        if (!response.data.results.length) {
          throw new Error("City not found via geocoding");
        }

        const { lat, lng } = response.data.results[0].geometry;
        dispatch(setCoordinates({ latitude: lat, longitude: lng }));
        dispatch(setError(null));
      } catch (error) {
        dispatch(
          setError(error instanceof Error ? error.message : "City not found")
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCoordinates();
  }, [city, searchParams, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />}>
          <Route index element={<OneDayWeather />} />
          <Route path="three-days" element={<ThreeDaysWeather />} />
          <Route path="week" element={<OneWeekWeather />} />
          <Route path="month" element={<OneMonthWeather />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
