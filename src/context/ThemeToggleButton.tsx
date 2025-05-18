// context/ThemeToggleButton.tsx
import React from "react";
import styles from "./ThemeContext.module.css";
import { useTheme } from "./ThemeContext";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.themeToggle} onClick={toggleTheme}>
      {theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
    </button>
  );
};
