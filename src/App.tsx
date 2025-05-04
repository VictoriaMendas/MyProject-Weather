import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { OneDayWeather } from "./components/OneDayWeather/OneDayWeather";
import { ThreeDaysWeather } from "./components/ThreeDaysWeather/ThreeDaysWeather";
import { OneWeekWeather } from "./components/OneWeekWeather/OneWeekWeather";
import { OneMonthWeather } from "./components/OneMonthWeather/OneMonthWeather";

const App: React.FC = () => {
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
