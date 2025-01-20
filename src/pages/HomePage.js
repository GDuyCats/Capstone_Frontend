import React from "react";
import { Layout } from "antd";
import ProjectList from "../components/ProjectList";

const { Content } = Layout;

const HomePage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <h1>Project Dashboard</h1>
          <ProjectList />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
