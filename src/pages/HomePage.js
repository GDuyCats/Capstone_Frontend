import React from "react";
import { Layout } from "antd";
import ProjectList from "../components/ProjectList";
import { Typography } from "antd";
const { Content } = Layout;

const HomePage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <Typography.Title level={5} style={{ marginBottom: "8px" }}>
            Projects
          </Typography.Title>
          <ProjectList />
        </Content>
      </Layout>
    </Layout>
  );
};

export default React.memo(HomePage);
