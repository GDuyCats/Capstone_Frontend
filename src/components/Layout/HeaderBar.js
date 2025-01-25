import React from "react";
import { Layout, Menu, Input, Avatar, Dropdown } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header } = Layout;

const HeaderBar = () => {
  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  return (
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

      <Dropdown overlay={userMenu} placement="bottomRight">
        <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
