import React from "react";
import { Layout } from "antd";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const LayoutCom = () => {
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderBar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar /> {/* Use Sidebar component here */}
        <Content style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </Content>
      </div>
      <Footer />
    </Layout>
  );
};

export default LayoutCom;
