import React, { useEffect, useState, createContext, useContext } from "react";
import { Layout, Menu, Input, Avatar, Dropdown, message } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../Hooks/useAuth";

const { Header } = Layout;

// ✅ Tạo context để chia sẻ avatar giữa các component
const AvatarContext = createContext();

export const useAvatar = () => useContext(AvatarContext);

const HeaderBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);

  // ✅ Gọi API lấy avatar khi component mount
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

    fetchUserAvatar();
  }, [auth]);

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    message.success("Logged out successfully!");
    navigate("/");
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
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Project Dashboard
          </Link>
        </div>

        <Input
          placeholder="Search projects..."
          prefix={<SearchOutlined />}
          style={{ width: "300px", marginRight: "20px" }}
        />

        {/* ✅ Avatar cập nhật ngay khi thay đổi */}
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar
            src={avatarUrl}
            icon={!avatarUrl && <UserOutlined />}
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      </Header>
    </AvatarContext.Provider>
  );
};

export default HeaderBar;
