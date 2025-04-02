import React, { useState } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import {
  HomeOutlined,
  PlusCircleOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const { auth } = useAuth();
  const role = auth?.role;
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = {
    ADMIN: [
      {
        key: "6",
        label: "Manage Projects",
        path: "/admin/projects",
        icon: <ProjectOutlined />,
        description: "Review and manage all projects",
      },
    ],
    STAFF: [
      {
        key: "11",
        label: "Invisible Projects",
        path: "/invisible-projects",
        icon: <EyeInvisibleOutlined />,
        description: "Review hidden projects",
      },
      {
        key: "12",
        label: "Approved Projects",
        path: "/approved-projects",
        icon: <CheckCircleOutlined />,
        description: "See all approved projects",
      },
    ],
    CUSTOMER: [
      {
        key: "16",
        label: "Create Project",
        path: "/create-project",
        icon: <PlusCircleOutlined />,
        description: "Start a new project",
      },
    ],
  };

  const defaultMenu =
    role !== "STAFF"
      ? [
          {
            key: "1",
            label: "Home",
            path: "/",
            icon: <HomeOutlined />,
            description: "Return to dashboard",
          },
        ]
      : [];

  const itemsToShow = [...defaultMenu, ...(menuItems[role] || [])];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#fff",
        padding: "20px 0",
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
          marginBottom: "24px",
          color: "#001529",
          padding: "0 16px 16px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        GameMkt
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {itemsToShow.map(({ key, label, path, icon, description }) => {
          const active = isActive(path);
          const hovered = hoveredItem === key;

          return (
            <Link
              key={key}
              to={path}
              style={{ textDecoration: "none" }}
              onMouseEnter={() => setHoveredItem(key)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                style={{
                  padding: "12px 24px",
                  marginBottom: "8px",
                  borderRadius: "0 20px 20px 0",
                  backgroundColor: active
                    ? "rgba(24, 144, 255, 0.1)"
                    : hovered
                    ? "rgba(24, 144, 255, 0.05)"
                    : "transparent",
                  borderLeft: active
                    ? "3px solid #1890ff"
                    : hovered
                    ? "3px solid rgba(24, 144, 255, 0.5)"
                    : "3px solid transparent",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: active || hovered ? "#1890ff" : "#555",
                  }}
                >
                  <div
                    style={{
                      marginRight: "12px",
                      fontSize: "18px",
                      transition: "transform 0.3s",
                      transform: hovered ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: active || hovered ? "600" : "normal",
                        transition: "all 0.3s",
                      }}
                    >
                      {label}
                    </div>

                    {/* Description that appears on hover */}
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: hovered ? 0.8 : 0,
                        maxHeight: hovered ? "20px" : "0",
                        transition: "all 0.3s",
                        color: "#666",
                      }}
                    >
                      {description}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer with user role info */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #f0f0f0",
          fontSize: "12px",
          color: "#999",
          textAlign: "center",
        }}
      >
        Logged in as:{" "}
        <span style={{ fontWeight: "bold" }}>{role || "Guest"}</span>
      </div>
    </div>
  );
};

export default Sidebar;
