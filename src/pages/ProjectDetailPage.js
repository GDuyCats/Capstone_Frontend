import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Spin,
} from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  HeartOutlined,
  ShareAltOutlined,
  BulbOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import TipTapViewer from "../components/TipTapViewer";
import ProjectSidebar from "../components/ProjectDetailPage/ProjectSidebar";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";
import { fetchProject } from "../api/apiClient"; // Sửa lại import này

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
    const fetchProjectData = async () => {
      try {
        const response = await fetchProject(id); // Sửa lại cách gọi API ở đây
        if (response.data.success) {
          setProject(response.data.data);
        } else {
          console.error("Error fetching project:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // Calculate days left
  const daysLeft = project
    ? Math.ceil(
        (new Date(project["end-datetime"]) - new Date()) / (1000 * 60 * 60 * 24)
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
          <TipTapViewer content={project?.story} />

          <Divider />
          <Title level={4}>Project Description</Title>
          <Paragraph style={{ fontSize: 16 }}>{project?.description}</Paragraph>

          {project?.creator && (
            <>
              <Divider />
              <Title level={4}>About the Creator</Title>
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar size={64} icon={<UserOutlined />} />
                </Col>
                <Col flex="auto">
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {project.creator}
                  </Title>
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
      children: <ProjectUpdates updates={[]} onAddUpdate={handleAddUpdate} />,
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
          comments={[]}
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
                  <Title level={2} style={{ marginTop: 8, marginBottom: 4 }}>
                    {project.title}
                  </Title>
                  <Paragraph style={{ fontSize: 16 }}>
                    {project.description}
                  </Paragraph>
                </div>

                <Space split={<Divider type="vertical" />}>
                  {project.creator && (
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text strong>{project.creator}</Text>
                    </Space>
                  )}
                  <Text>
                    <ClockCircleOutlined />{" "}
                    {daysLeft > 0 ? `${daysLeft} days to go` : "Funding ended"}
                  </Text>
                  <Text>
                    <UserOutlined /> {project?.backers} backers
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
            <ProjectSidebar
              project={{
                ...project,
                currentAmount: project?.["total-amount"] ?? 0,
                goalAmount: project?.["minimum-amount"] ?? 0,
                endDate: project?.["end-datetime"],
                rewards: [],
              }}
            />
          </Col>
        </Row>
      )}
    </Content>
  );
};

export default ProjectDetailPage;
