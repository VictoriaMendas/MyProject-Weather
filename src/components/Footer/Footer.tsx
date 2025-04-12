import React from "react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`${styles.footer} ${theme}`}>
      <p>© 2025 Weather App</p>
    </footer>
  );
};

export default Footer;
