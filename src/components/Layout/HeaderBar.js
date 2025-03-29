
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
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../Hooks/useAuth";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);

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
            }}
          >
            Project Dashboard
          </Link>

          {auth && (
            <Link
              to="/my-projects"
              style={{
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.85)",
                transition: "color 0.3s",
                textDecoration: "none",
                ":hover": {
                  color: "#fff",
                },
              }}
            >
              <ProjectOutlined
                style={{
                  fontSize: "18px",
                  marginRight: "8px",
                }}
              />
              <Text style={{ color: "inherit" }}>My Projects</Text>
            </Link>
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
            <Space style={{ cursor: "pointer", padding: "8px" }}>
              <Avatar
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
                style={{
                  backgroundColor: avatarUrl ? "transparent" : "#1890ff",
                  transition: "transform 0.3s",
                  ":hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
              {auth && (
                <Text style={{ color: "#fff" }}>
                  {auth.userName || "My Account"}
                </Text>
              )}
            </Space>
          </Dropdown>
        </Space>
      </Header>
    </AvatarContext.Provider>

  );
};

export default HeaderBar;
