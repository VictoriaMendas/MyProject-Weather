import { useState } from "react";
import { Header } from "../Header/Header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
      {isOpen && <div>Mobile Menu</div>}
    </>
  );
};
