import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const Sidebar = () => {
  const { auth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth);
  const isAdmin = auth?.role === "Admin";
  const isCustomer = auth?.role === "Customer";
  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#f0f0f0",
        padding: "16px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        GameMkt
      </div>
      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>

        {isAdmin && (
          <Menu.Item key="6">
            <Link to="/admin/projects">AdminProject</Link>
          </Menu.Item>
        )}

        {isCustomer && (
          <Menu.Item key="4">
            <Link to="/create-project">Create Project</Link>
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default Sidebar;
