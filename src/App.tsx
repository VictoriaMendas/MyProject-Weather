import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { OneDayWeather } from "./components/OneDayWeather/OneDayWeather";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />}>
          <Route index element={<OneDayWeather />} />
          <Route path="three-days" element={<div>3-day weather</div>} />
          <Route path="week" element={<div>1-week weather</div>} />
          <Route path="month" element={<div>1-month weather</div>} />
          {/* Доробити компоненти 3 дня неділя місяць */}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
