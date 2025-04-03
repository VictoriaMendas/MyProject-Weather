import { NavLink } from "react-router-dom";

export const HomePage = () => {
  return (
    <>
      <section>
        <h1>Weather Page</h1>
        <nav>
          <NavLink to="/">Day</NavLink>
          <NavLink to="/three-days">3 Days</NavLink>
          <NavLink to="/week">Week</NavLink>
        </nav>
        {/* <Outlet /> */}
      </section>
    </>
  );
};
