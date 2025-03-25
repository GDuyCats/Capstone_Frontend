import React, { useEffect, useState } from "react";
import { fetchProjectDetails } from "../api/apiClient";
import TipTapViewer from "../components/TipTapViewer";
import ProjectSidebar from "../components/ProjectDetailPage/ProjectSidebar";
import { Spin } from "antd";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tabs,
  Button,
  Card,
  Space,
  Divider,
  Avatar,
  Result,
  Tag,
} from "antd";
import { useParams } from "react-router-dom";
import {
  ClockCircleOutlined,
  UserOutlined,
  HeartOutlined,
  ShareAltOutlined,
  BulbOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const handleAddUpdate = (updatedUpdates) => {
    setProject((prevProject) => ({
      ...prevProject,
      updates: updatedUpdates,
    }));
  };

  useEffect(() => {
    fetchProjectDetails(id)
      .then((response) => {
        setProject(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
        setLoading(false);
      });
  }, [id]);

  // Only calculate daysLeft if project exists
  const daysLeft = project
    ? Math.ceil(
        (new Date(project?.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const items = [
    {
      key: "1",
      label: (
        <span>
          <BulbOutlined /> About
        </span>
      ),
      children: (
        <div className="project-about">
          <TipTapViewer content={project?.description} />

          {project?.features && (
            <>
              <Title level={4}>Key Features</Title>
              <ul style={{ fontSize: 16 }}>
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </>
          )}

          {project?.creator && (
            <>
              <Divider />
              <Title level={4}>About the Creator</Title>
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar
                    size={64}
                    src={project.creator.avatar}
                    icon={<UserOutlined />}
                  />
                </Col>
                <Col flex="auto">
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {project.creator.name}
                  </Title>
                  <Paragraph>{project.creator.bio}</Paragraph>
                </Col>
              </Row>
            </>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <MessageOutlined /> Updates
        </span>
      ),
      children: (
        <ProjectUpdates
          updates={project?.updates || []}
          onAddUpdate={handleAddUpdate}
        />
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <MessageOutlined /> Comments
        </span>
      ),
      children: (
        <ProjectComments
          comments={[
            {
              id: 1,
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              name: "John Doe",
              content: "This project looks amazing!",
              date: "2025-03-10T10:00:00",
              edited: false,
            },
            {
              id: 2,
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              name: "Jane Smith",
              content: "Can't wait to support this!",
              date: "2025-03-11T15:30:00",
              edited: true,
            },
          ]}
          onAddComment={(content) => console.log("Add Comment:", content)}
          onEditComment={(id, newContent) =>
            console.log("Edit Comment:", id, newContent)
          }
        />
      ),
    },
  ];

  return (
    <Content style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "50px 0",
          }}
        >
          <Spin size="large" />
        </div>
      ) : !project ? (
        <Card>
          <Result
            status="404"
            title="Project Not Found"
            subTitle="Sorry, the project you're looking for doesn't exist."
            extra={
              <Button type="primary" href="/">
                Browse Projects
              </Button>
            }
          />
        </Card>
      ) : (
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={16}>
            <Card
              cover={
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  style={{ width: "100%", height: 400, objectFit: "cover" }}
                />
              }
              style={{ marginBottom: 24, border: "black solid 0.5px" }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div>
                  <Space size={8}>
                    {project.categories?.map((category) => (
                      <Tag key={category} color="blue">
                        {category}
                      </Tag>
                    ))}
                  </Space>
                  <Title level={2} style={{ marginTop: 8, marginBottom: 4 }}>
                    {project.title}
                  </Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    {project.shortDescription}
                  </Paragraph>
                </div>

                <Space split={<Divider type="vertical" />}>
                  {project.creator && (
                    <Space>
                      <Avatar
                        size="small"
                        src={project.creator.avatar}
                        icon={<UserOutlined />}
                      />
                      <Text strong>{project.creator.name}</Text>
                    </Space>
                  )}
                  <Text>
                    <ClockCircleOutlined />{" "}
                    {daysLeft > 0 ? `${daysLeft} days to go` : "Funding ended"}
                  </Text>
                  <Text>
                    <UserOutlined /> {project.backers} backers
                  </Text>
                </Space>

                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button icon={<HeartOutlined />}>Favorite</Button>
                  <Button icon={<ShareAltOutlined />}>Share</Button>
                </Space>
              </Space>
            </Card>

            <Card style={{ border: "black solid 0.5px" }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                size="large"
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <ProjectSidebar project={project} />
          </Col>
        </Row>
      )}
    </Content>
  );
};

export default ProjectDetailPage;
