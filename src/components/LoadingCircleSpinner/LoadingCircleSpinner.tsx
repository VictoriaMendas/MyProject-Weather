"use client";

import { motion } from "framer-motion";
import style from "./LoadingCircleSpinner.module.css";
function LoadingCircleSpinner() {
  return (
    <div className={style.container}>
      <motion.div
        className={style.spinner}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default LoadingCircleSpinner;
