import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const Sidebar = () => {
  const { auth } = useAuth();
  const role = auth?.role;

  // Danh sách menu theo từng role
  const menuItems = {
    Admin: [{ key: "6", label: "AdminProject", path: "/admin/projects" }],
    Staff: [
      { key: "11", label: "Invisible projects", path: "/invisible-projects" },
      { key: "12", label: "Approved projects", path: "/approved-projects" },
    ],
    Customer: [{ key: "16", label: "Create Project", path: "/create-project" }],
  };

  const defaultMenu =
    role !== "Staff" ? [{ key: "1", label: "Home", path: "/" }] : [];

  const itemsToShow = [...defaultMenu, ...(menuItems[role] || [])];

  return (
    <div
      style={{ width: "200px", backgroundColor: "#f0f0f0", padding: "16px" }}
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
        {itemsToShow.map(({ key, label, path }) => (
          <Menu.Item key={key}>
            <Link to={path}>{label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
