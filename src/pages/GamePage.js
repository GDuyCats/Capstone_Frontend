import React from "react";
import { Layout } from "antd";
import GameList from "../components/GameList";
import { Typography } from "antd";

const { Content } = Layout;



const GamePage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <Typography.Title level={5} style={{ marginBottom: "8px" }}>
            Games
          </Typography.Title>
          <GameList />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GamePage;
