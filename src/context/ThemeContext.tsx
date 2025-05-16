// context/ThemeContext.tsx
// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import Particles from "react-particles";
import { loadSlim } from "@tsparticles/slim"; // Змінено з loadFull на loadSlim
import type { ISourceOptions } from "@tsparticles/engine";
import styles from "./ThemeContext.module.css";

// Типи для контексту
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

// Опції для частинок у світлій темі (хмарки)
const lightThemeParticles: ISourceOptions = {
  particles: {
    number: {
      value: 15,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
    },
    size: {
      value: { min: 20, max: 50 },
    },
    move: {
      enable: true,
      speed: 1,
      direction: "right",
      random: false,
      straight: false,
      outModes: {
        default: "out",
      },
    },
    color: {
      value: "rgba(255, 255, 255, 0.5)",
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
};

// Опції для частинок у темній темі (зірки та планети)
const darkThemeParticles: ISourceOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    shape: {
      type: ["circle", "image"],
      image: [
        {
          src: "https://www.pngall.com/wp-content/uploads/10/Saturn-PNG-Images-HD.png",
          width: 32,
          height: 32,
        },
      ],
    },
    opacity: {
      value: { min: 0.4, max: 0.8 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 10 },
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "out",
      },
    },
    color: {
      value: ["#ffffff", "#ffcc00", "#ff3300"],
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "connect",
      },
    },
    modes: {
      connect: {
        distance: 100,
        links: {
          opacity: 0.5,
        },
      },
    },
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const particlesInit = async (engine: any) => {
    await loadSlim(engine); // Змінено з loadFull на loadSlim
  };

  const backgroundStyle = useMemo(
    () => ({
      background:
        theme === "light"
          ? "linear-gradient(135deg, rgba(135, 206, 250, 0.8), rgba(0, 47, 108, 0.8))"
          : "linear-gradient(135deg, #0d0015, #1e3a8a)",
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={styles.themeWrapper} style={backgroundStyle}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={theme === "light" ? lightThemeParticles : darkThemeParticles}
          className={styles.particles}
        />
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
        </button>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
