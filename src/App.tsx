import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { setCoordinates, setError, setLoading } from "./redux/weatherSlice";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { OneDayWeather } from "./components/OneDayWeather/OneDayWeather";
import { ThreeDaysWeather } from "./components/ThreeDaysWeather/ThreeDaysWeather";
import { OneWeekWeather } from "./components/OneWeekWeather/OneWeekWeather";
import { OneMonthWeather } from "./components/OneMonthWeather/OneMonthWeather";
import styles from "./App.module.css";
import { useSelector } from "react-redux";

interface OpenCageResponse {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
    components: {
      city?: string;
      town?: string;
      village?: string;
    };
  }>;
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();

  const locationName = useSelector(
    (state: RootState) => state.weather.locationName
  );
  const cityFromUrl = searchParams.get("city") || locationName;

  useEffect(() => {
    if (!cityFromUrl) return;
    const fetchCoordinatesAndLocation = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get<OpenCageResponse>(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              q: cityFromUrl,
              key: import.meta.env.VITE_OPENWEATHER_API_KEY,
              pretty: 1,
              language: "en",
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

    fetchCoordinatesAndLocation();
  }, [cityFromUrl, dispatch]);

  useEffect(() => {
    if (!locationName) return;
    setSearchParams({ city: locationName });
  }, [locationName, setSearchParams]);

  useEffect(() => {
    if (locationName) {
      return;
    }
    getCurrentPosition();
  }, []);

  return (
    <div className={styles.app}>
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
    </div>
  );
};

export default App;

// import React, { useEffect } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import type { AppDispatch, RootState } from "./redux/store";
// import { setCoordinates, setError, setLoading } from "./redux/weatherSlice";
// import { Routes, Route, useSearchParams } from "react-router-dom";
// import Layout from "./components/Layout/Layout";
// import HomePage from "./pages/HomePage/HomePage";
// import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
// import { OneDayWeather } from "./components/OneDayWeather/OneDayWeather";
// import { ThreeDaysWeather } from "./components/ThreeDaysWeather/ThreeDaysWeather";
// import { OneWeekWeather } from "./components/OneWeekWeather/OneWeekWeather";
// import { OneMonthWeather } from "./components/OneMonthWeather/OneMonthWeather";
// import styles from "./App.module.css";
// import { useSelector } from "react-redux";

// interface OpenCageResponse {
//   results: Array<{
//     geometry: {
//       lat: number;
//       lng: number;
//     };
//     components: {
//       city?: string;
//       town?: string;
//       village?: string;
//     };
//   }>;
// }

// const App: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const locationName = useSelector(
//     (state: RootState) => state.weather.locationName
//   );
//   const cityFromUrl = searchParams.get("city") || locationName;

//   // useEffect #1 (не чіпаємо)
//   useEffect(() => {
//     if (!cityFromUrl) return;
//     const fetchCoordinatesAndLocation = async () => {
//       dispatch(setLoading(true));
//       try {
//         const response = await axios.get<OpenCageResponse>(
//           "https://api.opencagedata.com/geocode/v1/json",
//           {
//             params: {
//               q: cityFromUrl,
//               key: import.meta.env.VITE_OPENWEATHER_API_KEY,
//               pretty: 1,
//               language: "en",
//             },
//           }
//         );

//         if (!response.data.results.length) {
//           throw new Error("City not found via geocoding");
//         }

//         const { lat, lng } = response.data.results[0].geometry;
//         dispatch(setCoordinates({ latitude: lat, longitude: lng }));

//         dispatch(setError(null));
//       } catch (error) {
//         dispatch(
//           setError(error instanceof Error ? error.message : "City not found")
//         );
//       } finally {
//         dispatch(setLoading(false));
//       }
//     };

//     fetchCoordinatesAndLocation();
//   }, [cityFromUrl, dispatch]);

//   // useEffect #2 (не чіпаємо)
//   useEffect(() => {
//     if (!locationName) return;
//     setSearchParams({ city: locationName });
//   }, [locationName, setSearchParams]);

//   useEffect(() => {
//     if (locationName) {
//       return;
//     }

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           dispatch(setCoordinates({ latitude, longitude })); // Зберігаємо координати
//         },
//         (error) => {
//           dispatch(setError(error.message || "Failed to get current position"));
//         }
//       );
//     } else {
//       dispatch(setError("Geolocation is not supported by this browser"));
//     }
//   }, [locationName, dispatch]); // Залежність від locationName, щоб реагувати на його зміну

//   return (
//     <div className={styles.app}>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route path="/" element={<HomePage />}>
//             <Route index element={<OneDayWeather />} />
//             <Route path="three-days" element={<ThreeDaysWeather />} />
//             <Route path="week" element={<OneWeekWeather />} />
//             <Route path="month" element={<OneMonthWeather />} />
//           </Route>
//           <Route path="*" element={<NotFoundPage />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// };

// export default App;

//  v useEffect #3(створити) потрібно використатти метод getCurrentPosition()(MDN) додати умову.Якщо
// locationname є тоді просто return  в іншому випадку використовуємо getCurrentPosition і записуємо координати
// locationname зберігати в локалсторєдж через редакс персіст.Тоді сітіфромЮрл треба буде до locationName
