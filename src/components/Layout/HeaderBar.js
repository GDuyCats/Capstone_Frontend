import React, { useEffect, useState, createContext, useContext } from "react";
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Dropdown,
  message,
  Typography,
  Space,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ProjectOutlined,
  FileOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/logo.png";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../Hooks/useAuth";
import AvatarContext from "antd/es/avatar/AvatarContext";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const res = await axios.get(
          "https://marvelous-gentleness-production.up.railway.app/api/User/GetUserById",
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );

        if (res.data?.data?.avatar) {
          setAvatarUrl(`${res.data.data.avatar}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error("Lỗi khi lấy avatar:", error);
      }
    };

    if (auth?.token) {
      fetchUserAvatar();
    }
  }, [auth]);

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    message.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      {auth ? (
        <>
          <Menu.Item key="1">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="2" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="3">
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  const navItems = [
    {
      key: "projects",
      icon: <ProjectOutlined />,
      label: "My Projects",
      path: "/my-projects",
      roles: ["CUSTOMER"],
    },
    {
      key: "pledges",
      icon: <DollarOutlined />,
      label: "My Pledges",
      path: "/pledges",
      roles: ["CUSTOMER"],
    },
    {
      key: "FAQ",
      icon: <QuestionCircleOutlined />,
      label: "FAQ Management",
      path: "/manage-faqs",
      roles: ["CUSTOMER"],
    },
    {
      key: "files",
      icon: <FileOutlined />,
      label: "My Files",
      path: "/files",
      roles: ["CUSTOMER"],
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      <Header
        style={{
          background: "#001529",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              marginRight: "24px",
              textDecoration: "none",
              position: "relative",
              padding: "0 4px",
            }}
            onMouseEnter={() => setHoveredItem("home")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{
                height: "150px",
                marginRight: "8px",
                transition: "transform 0.3s",
                transform: hoveredItem === "home" ? "scale(1.05)" : "scale(1)",
              }}
            />{" "}
            {hoveredItem === "home" && (
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: "#1890ff",
                  transition: "width 0.3s ease",
                  animation: "slideIn 0.3s ease",
                }}
              />
            )}
          </Link>

          {auth && (
            <Space size="middle">
              {navItems.map((item) => {
                if (item.roles && !item.roles.includes(auth.role)) {
                  return null;
                }
                const active = isActive(item.path);
                const hovered = hoveredItem === item.key;

                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color:
                        active || hovered
                          ? "#1890ff"
                          : "rgba(255, 255, 255, 0.85)",
                      transition: "color 0.3s",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      background: active
                        ? "rgba(24, 144, 255, 0.1)"
                        : hovered
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {React.cloneElement(item.icon, {
                      style: {
                        fontSize: "18px",
                        marginRight: "8px",
                        transition: "transform 0.3s",
                        transform: hovered ? "scale(1.2)" : "scale(1)",
                      },
                    })}
                    <Text
                      style={{
                        color: "inherit",
                        transition: "transform 0.3s",
                        transform: hovered
                          ? "translateX(2px)"
                          : "translateX(0)",
                      }}
                    >
                      {item.label}
                    </Text>

                    {(active || hovered) && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "2px",
                          background: "#1890ff",
                          transition: "width 0.3s ease",
                          animation: "slideIn 0.3s ease",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </Space>
          )}
        </div>
        <Space size="middle">
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined />}
            style={{
              width: "300px",
              borderRadius: "4px",
              border: "none",
              boxShadow: "none",
            }}
            allowClear
          />

          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <Space
              style={{
                cursor: "pointer",
                padding: "8px",
                transition: "background-color 0.3s",
                borderRadius: "4px",
                ":hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onMouseEnter={() => setHoveredItem("user")}
              onMouseLeave={() => setHoveredItem(null)}
              className="user-dropdown"
            >
              <Avatar
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
                style={{
                  backgroundColor: avatarUrl ? "transparent" : "#1890ff",
                  transition: "all 0.3s",
                  transform: hoveredItem === "user" ? "scale(1.1)" : "scale(1)",
                }}
              />
              {auth && (
                <Text
                  style={{
                    color: "#fff",
                    transition: "opacity 0.3s",
                    opacity: hoveredItem === "user" ? 1 : 0.85,
                  }}
                >
                  {auth.userName || "My Account"}
                </Text>
              )}
            </Space>
          </Dropdown>
        </Space>
      </Header>
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0;
            left: 50%;
          }
          to {
            width: 100%;
            left: 0;
          }
        }

        .user-dropdown:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </AvatarContext.Provider>
  );
};

export default HeaderBar;
