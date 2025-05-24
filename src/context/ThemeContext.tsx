// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./ThemeContext.module.css";
import { FaStar } from "react-icons/fa";
import { GiGalaxy } from "react-icons/gi";
import ThemeSwitcher from "../components/ThemeSwitcher/ThemeSwitcher";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const backgroundStyle = useMemo(
    () => ({
      background:
        theme === "light"
          ? "linear-gradient(135deg, rgba(135, 206, 250, 1), rgb(53, 121, 211), #8b0597)"
          : "linear-gradient(155deg, #8b0597, #0d0015, #1e3a8a, #8b0597)",
      transition: "background 0.5s ease",
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={styles.themeWrapper} style={backgroundStyle}>
        {theme === "light" ? (
          <>
            <motion.div
              className={styles.cloud}
              initial={{ x: -100 }}
              animate={{ x: "100vw" }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ top: "20%" }}
            />
            <motion.div
              className={styles.cloud}
              initial={{ x: -100 }}
              animate={{ x: "100vw" }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
                delay: 5,
              }}
              style={{ top: "50%" }}
            />
          </>
        ) : (
          <>
            <motion.div
              className={styles.milkyway1}
              initial={{ x: -200 }}
              animate={{ x: "100vw" }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ top: "10%" }}
            >
              <GiGalaxy size={150} color="rgba(255, 255, 255, 0.5)" />
            </motion.div>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.star}
                style={{
                  top: `${Math.random() * 100}vh`,
                  left: `${Math.random() * 100}vw`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <FaStar size={5} color="#fff" />
              </motion.div>
            ))}
          </>
        )}
        <div className={styles.themeToggle}>
          <ThemeSwitcher />
        </div>

        {children}
      </div>
    </ThemeContext.Provider>
  );
};
