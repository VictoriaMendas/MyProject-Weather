import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { Layout } from "./components/Layout/Layout";
import { NotFound } from "./pages/NotFoundPage/NotFoundPage";

// const Layout = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <Header />
//       <main>
//         <Outlet />
//       </main>
//       <footer>footer</footer>
//       {isOpen && <div>Mobile Menu</div>}
//     </>
//   );
// };

// const Header = () => {
//   return (
//     <header>
//       Header <button onClick={() => {}}>Burger</button>
//     </header>
//   );
// };

// const HomePage = () => {
//   return (
//     <>
//       <section>
//         <h1>Weather Page</h1>
//         <nav>
//           <NavLink to="/">Day</NavLink>
//           <NavLink to="/three-days">3 Days</NavLink>
//           <NavLink to="/week">Week</NavLink>
//         </nav>
//         <Outlet />
//       </section>
//     </>
//   );
// };

// const NotFound = () => {
//   return (
//     <section>
//       <h1>404 (Not Found)</h1>
//     </section>
//   );
// };

export default function App(): React.FC {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />}>
            <Route index element={<div>Day weather</div>} />
            <Route path="three-days" element={<div>3 Days weather</div>} />
            <Route path="week" element={<div>Week weather</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
