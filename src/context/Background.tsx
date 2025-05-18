// context/Background.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ThemeContext.module.css";
import { FaStar, FaGlobe } from "react-icons/fa";
import { GiGalaxy } from "react-icons/gi";
import { useTheme } from "./ThemeContext";

export const Background: React.FC = () => {
  const { theme } = useTheme();

  // Змінюємо фон <body> динамічно
  useEffect(() => {
    document.body.style.background =
      theme === "light"
        ? "linear-gradient(135deg, rgba(135, 206, 250, 1), rgba(0, 47, 108, 1))"
        : "linear-gradient(135deg, #0d0015, #1e3a8a)";
    document.body.style.transition = "background 0.5s ease";
  }, [theme]);

  return (
    <>
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
          <motion.div
            className={styles.planet1}
            initial={{ x: -100 }}
            animate={{ x: "100vw" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ top: "30%" }}
          >
            <FaGlobe size={40} color="#ffcc00" />
          </motion.div>
          <motion.div
            className={styles.planet2}
            initial={{ x: -100 }}
            animate={{ x: "100vw" }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
              delay: 10,
            }}
            style={{ top: "60%" }}
          >
            <FaGlobe size={60} color="#00ccff" />
          </motion.div>
        </>
      )}
    </>
  );
};
