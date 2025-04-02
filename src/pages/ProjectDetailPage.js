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
import placeholder from "../assets/placeholder-1-1-1.png";
import ProjectSidebar from "../components/ProjectDetailPage/ProjectSidebar";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";
import {
  fetchProject,
  fetchRewardsByProjectId,
  fetchCreatorInfo,
} from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [creator, setCreator] = useState(null);
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
        const response = await fetchProject(id);
        if (response.data.success) {
          setProject(response.data.data);

          // Fetch creator info if creator-id exists
          if (response.data.data["creator-id"]) {
            try {
              const creatorResponse = await fetchCreatorInfo(
                response.data.data["creator-id"]
              );
              if (creatorResponse.data.success) {
                setCreator(creatorResponse.data.data);
              }
            } catch (error) {
              console.error("Error fetching creator info:", error);
            }
          }

          const rewardsResponse = await fetchRewardsByProjectId(
            response.data.data["project-id"] || id
          );
          if (rewardsResponse.data.success) {
            setRewards(rewardsResponse.data.data || []);
          }
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

  const getTimeStatus = () => {
    if (!project) return { text: "", days: 0 };

    const now = new Date();
    const startDate = new Date(project["start-datetime"]);
    const endDate = new Date(project["end-datetime"]);

    if (now < startDate) {
      const days = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      return { text: `Starts in ${days} days`, status: "upcoming" };
    } else if (now >= startDate && now <= endDate) {
      const days = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return { text: `${days} days to go`, status: "ongoing" };
    } else {
      return { text: "Funding ended", status: "ended" };
    }
  };

  const timeStatus = getTimeStatus();

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

          {(creator || project?.creator) && (
            <>
              <Divider />
              <Title level={4}>About the Creator</Title>
              <Card
                bordered={false}
                style={{ background: "#f9f9f9", cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/creator/${
                      creator?.["user-id"] || project?.["creator-id"]
                    }`,
                    {
                      state: { from: `/project/${id}` },
                    }
                  )
                }
              >
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar
                      size={64}
                      src={creator?.avatar}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  </Col>
                  <Col flex="auto">
                    <Title level={5} style={{ marginBottom: 0 }}>
                      {creator?.["full-name"] || project?.creator}
                    </Title>
                    {creator?.bio && (
                      <Paragraph
                        style={{ marginTop: 8, marginBottom: 0 }}
                        ellipsis={{ rows: 2 }}
                      >
                        {creator.bio}
                      </Paragraph>
                    )}
                    <Text
                      type="secondary"
                      style={{ display: "block", marginTop: 8 }}
                    >
                      View full profile →
                    </Text>
                  </Col>
                </Row>
              </Card>
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
                  src={
                    !project.thumbnail || project.thumbnail === "Null"
                      ? placeholder
                      : project.thumbnail
                  }
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: 400,
                    objectFit: "cover",
                    border: "black solid 0.5px",
                  }}
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
                  {(creator || project?.creator) && (
                    <Space>
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        src={creator?.avatar}
                      />
                      <Text strong>
                        {creator?.["full-name"] || project?.creator}
                      </Text>
                    </Space>
                  )}
                  <Text>
                    <ClockCircleOutlined /> {timeStatus.text}
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
                timeStatus: timeStatus.status,
              }}
              rewards={rewards}
            />
          </Col>
        </Row>
      )}
    </Content>
  );
};

export default ProjectDetailPage;
