import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <header>Header</header>
      <Outlet />
      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
