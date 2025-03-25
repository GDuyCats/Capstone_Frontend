import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Sidebar = () => {
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
        {/* <Menu.Item key="5">
          <Link to="/games">Game Page</Link>
        </Menu.Item> */}
        <Menu.Item key="6">
          <Link to="/admin/projects">AdminProject</Link>
        </Menu.Item>
        {/* <Menu.Item key="2">
          <Link to="/project/1">My Project</Link>
        </Menu.Item> */}
        {/* <Menu.Item key="3">
          <Link to="/task">Task</Link>
        </Menu.Item> */}
        <Menu.Item key="4">
          <Link to="/create-project">Create Project</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
