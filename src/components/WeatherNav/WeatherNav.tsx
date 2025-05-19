import { NavLink } from "react-router-dom";
import styles from "./WeatherNav.module.css";

export const WeatherNav: React.FC = () => {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navButton} ${isActive ? styles.active : ""}`;

  return (
    <nav className={styles.nav}>
      <NavLink to="/one-day" className={getNavClass}>
        One Day
      </NavLink>
      <NavLink to="/three-days" className={getNavClass}>
        Three Days
      </NavLink>
      <NavLink to="/one-week" className={getNavClass}>
        One Week
      </NavLink>
      <NavLink to="/one-month" className={getNavClass}>
        One Month
      </NavLink>
    </nav>
  );
};
