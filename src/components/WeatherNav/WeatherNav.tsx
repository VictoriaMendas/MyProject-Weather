import { NavLink } from "react-router-dom";

export const WeatherNav = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">One day</NavLink>
        </li>
        <li>
          <NavLink to="/three-days">Three days</NavLink>
        </li>
        <li>
          <NavLink to="/week">One week</NavLink>
        </li>
        <li>
          <NavLink to="/month">One month</NavLink>
        </li>
      </ul>
    </nav>
  );
};
