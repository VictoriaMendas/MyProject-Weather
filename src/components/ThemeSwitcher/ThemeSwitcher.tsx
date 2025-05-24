import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const container = {
  width: 100,
  height: 50,
  backgroundColor: "rgb(0, 0, 0)",
  borderRadius: 50,
  cursor: "pointer",
  display: "flex",
  padding: 10,
};

const handle = {
  width: 50,
  height: 50,
  backgroundColor: "#9911ff",
  borderRadius: "50%",
};

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="toggle-container"
      style={{
        ...container,
        justifyContent: "flex-" + (theme === "light" ? "start" : "end"),
      }}
      onClick={toggleTheme}
    >
      <motion.div
        className="toggle-handle"
        style={handle}
        layout
        transition={{
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </button>
  );
};

export default ThemeSwitcher;
