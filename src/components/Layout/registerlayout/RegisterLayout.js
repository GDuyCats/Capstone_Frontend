import React from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { Outlet } from "react-router-dom";
function RegisterLayout() {
  return (
    <div className="flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
}

export default RegisterLayout;
