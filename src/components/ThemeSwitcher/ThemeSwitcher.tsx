import React from "react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./ThemeSwitcher.module.css";

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={styles.button}>
      Switch to {theme === "light" ? "Dark" : "Light"} Theme
    </button>
  );
};

export default ThemeSwitcher;
