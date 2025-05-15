// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";

// const Layout: React.FC = () => {
//   return (
//     <div>
//       <Header />
//       <main>
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Layout;
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/">1 Day</Link> | <Link to="/three-days">3 Days</Link> |{" "}
        <Link to="/week">1 Week</Link> | <Link to="/month">1 Month</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
