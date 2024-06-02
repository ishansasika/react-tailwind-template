import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import Home from "./app/pages/home";
import Header from "./app/components/header";
import Footer from "./app/components/footer";

import "./App.css";

const AppRoutes = () => {
  let routes = useRoutes([{ path: "/", element: <Home /> }]);
  return routes;
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="page-container">
        <Header />
        <div className="content-wraper">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
