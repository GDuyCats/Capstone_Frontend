import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tabs,
  Card,
  Button,
  Space,
  Divider,
  Avatar,
  Tag,
  Spin,
  Modal,
  message,
  Progress,
  List,
  Input,
  Result,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import TipTapViewer from "../components/TipTapViewer";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";
import placeholder from "../assets/placeholder-1-1-1.png";
import {
  fetchProject,
  fetchRewardsByProjectId,
  fetchCreatorInfo,
  fetchProjectCategories,
  staffApproveProject,
} from "../api/apiClient";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const StaffProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [creator, setCreator] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [categories, setCategories] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetchProject(id);
        if (response.data.success) {
          setProject(response.data.data);
          const categoriesResponse = await fetchProjectCategories(
            response.data.data["project-id"] || id
          );
          if (categoriesResponse.data.success) {
            setCategories(categoriesResponse.data.data || []);
          }
          if (response.data.data["creator-id"]) {
            const creatorResponse = await fetchCreatorInfo(
              response.data.data["creator-id"]
            );
            if (creatorResponse.data.success) {
              setCreator(creatorResponse.data.data);
            }
          }
          const rewardsResponse = await fetchRewardsByProjectId(
            response.data.data["project-id"] || id
          );
          if (rewardsResponse.data.success) {
            setRewards(rewardsResponse.data.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const canApproveOrReject = () => {
    if (!project) return false;

    const now = new Date();
    const endDate = new Date(project["end-datetime"]);

    return (
      project.status === "INVISIBLE" ||
      (project.status === "PENDING" && now < endDate)
    );
  };

  const handleApprove = (status) => {
    let reason = "";

    confirm({
      title: `Are you sure you want to ${
        status === "APPROVED" ? "approve" : "reject"
      } this project?`,
      icon: <ExclamationCircleOutlined />,
      content:
        status === "HALTED" ? (
          <Input.TextArea
            rows={4}
            placeholder="Reason..."
            onChange={(e) => {
              reason = e.target.value;
            }}
          />
        ) : null,
      onOk() {
        return staffApproveProject({
          projectId: project["project-id"],
          status,
          reason: status === "HALTED" ? reason : "",
        })
          .then(() => {
            message.success(
              `Project ${
                status === "ONGOING" ? "approved" : "rejected"
              } successfully`
            );
            setProject((prev) => ({ ...prev, status }));
          })
          .catch((error) => {
            message.error(
              `Failed to ${status === "ONGOING" ? "approve" : "reject"} project`
            );
            console.error(error);
          });
      },
    });
  };

  const getStatusTag = () => {
    if (!project) return null;

    const status = project.status || "PENDING";
    const color = {
      ONGOING: "green",
      HALTED: "red",
      DELETED: "orange",
      INVISIBLE: "gray",
    }[status];

    return (
      <Tag color={color} style={{ marginLeft: 8 }}>
        {status}
      </Tag>
    );
  };

  const getTimeStatus = () => {
    if (!project) return { text: "", days: 0 };

    const now = new Date();
    const startDate = new Date(project["start-datetime"]);
    const endDate = new Date(project["end-datetime"]);

    if (now < startDate) {
      const days = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      return { text: `Starts in ${days} days`, days, status: "upcoming" };
    } else if (now >= startDate && now <= endDate) {
      const days = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return { text: `${days} days to go`, days, status: "ongoing" };
    } else {
      return { text: "Funding ended", days: 0, status: "ended" };
    }
  };

  const timeStatus = getTimeStatus();

  const items = [
    {
      key: "1",
      label: "About",
      children: (
        <>
          {project?.story ? (
            <TipTapViewer content={project.story} />
          ) : (
            <Paragraph type="secondary">No story available.</Paragraph>
          )}
          <Divider />
          <Title level={4}>Project Description</Title>
          <Paragraph>
            {project?.description || "No description available."}
          </Paragraph>
          {categories.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {categories.map((category) => (
                <Tag
                  key={category["category-id"]}
                  color="blue"
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  {category.name}
                </Tag>
              ))}
            </div>
          )}

          {creator && (
            <>
              <Divider />
              <Title level={4}>About the Creator</Title>
              <Card>
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar
                      size={64}
                      src={creator.avatar}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  </Col>
                  <Col flex="auto">
                    <Title level={5} style={{ marginBottom: 4 }}>
                      {creator["full-name"]}
                    </Title>
                    <Text
                      type="secondary"
                      style={{ display: "block", marginBottom: 8 }}
                    >
                      Joined:{" "}
                      {new Date(
                        creator["created-datetime"]
                      ).toLocaleDateString()}
                    </Text>
                    {creator.bio && (
                      <Paragraph style={{ marginBottom: 0 }}>
                        {creator.bio}
                      </Paragraph>
                    )}
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "Updates",
      children: <ProjectUpdates updates={project?.updates || []} />,
    },
    {
      key: "3",
      label: "Comments",
      children: <ProjectComments comments={project?.comments || []} />,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <Card>
        <Result
          status="404"
          title="Project Not Found"
          subTitle="The project you're looking for doesn't exist."
          extra={
            <Button type="primary" onClick={() => navigate("/staff/projects")}>
              Back to Projects
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Content style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <Title level={3} style={{ marginBottom: 0 }}>
                  {project.title}
                </Title>
                {getStatusTag()}
              </Space>
            }
            cover={
              <img
                src={
                  !project.thumbnail || project.thumbnail === "unknown"
                    ? placeholder
                    : project.thumbnail
                }
                alt="Project Thumbnail"
                style={{
                  width: "100%",
                  padding: "10px",
                  height: 400,
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
            }
            style={{ marginBottom: 24 }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Paragraph>{project.description}</Paragraph>

              <Space split={<Divider type="vertical" />}>
                <Text>
                  <ClockCircleOutlined /> {timeStatus.text}
                </Text>
                <Text>
                  <UserOutlined /> {project.backers || 0} backers
                </Text>
                <Text>
                  Start at:{" "}
                  {new Date(project["start-datetime"]).toLocaleDateString()}
                </Text>
                <Text>
                  End at:{" "}
                  {new Date(project["end-datetime"]).toLocaleDateString()}
                </Text>
              </Space>
            </Space>
          </Card>

          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {canApproveOrReject() && (
              <Card title="Project Approval">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    block
                    onClick={() => handleApprove("ONGOING")}
                  >
                    Approve Project
                  </Button>

                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    block
                    onClick={() => handleApprove("HALTED")}
                  >
                    Reject Project
                  </Button>
                </Space>
              </Card>
            )}

            <Card title="Funding Progress">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>
                      <DollarOutlined />{" "}
                      {project["total-amount"]?.toLocaleString() || 0}$
                    </Text>
                  </Col>
                  <Col>
                    <Text type="secondary">
                      of {project["minimum-amount"]?.toLocaleString() || 0}$
                      goal
                    </Text>
                  </Col>
                </Row>

                <Progress
                  percent={Math.min(
                    (project["total-amount"] / project["minimum-amount"]) *
                      100 || 0,
                    100
                  )}
                  status="active"
                  strokeColor="#52c41a"
                />

                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ textAlign: "center" }}>
                      <Text strong>
                        <TeamOutlined /> Backers
                      </Text>
                      <Title level={3} style={{ margin: "8px 0" }}>
                        {project.backers || 0}
                      </Title>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: "center" }}>
                      <Text strong>
                        <CalendarOutlined /> Days Left
                      </Text>
                      <Title
                        level={3}
                        style={{
                          margin: "8px 0",
                          color: timeStatus.days <= 3 ? "#f5222d" : "inherit",
                        }}
                      >
                        {timeStatus.days}
                      </Title>
                    </div>
                  </Col>
                </Row>
              </Space>
            </Card>

            <Card
              title={`Rewards (${rewards.length})`}
              bodyStyle={{ padding: rewards.length ? "16px" : 0 }}
            >
              {rewards.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={rewards}
                  renderItem={(reward) => (
                    <List.Item>
                      <Card
                        size="small"
                        style={{
                          borderLeft: "3px solid #1890ff",
                          width: "100%",
                        }}
                      >
                        <Title level={5} style={{ marginBottom: 8 }}>
                          ${reward.amount.toLocaleString()} or more
                        </Title>
                        <Paragraph style={{ marginBottom: 0 }}>
                          {reward.details || "No description provided"}
                        </Paragraph>
                        <Text
                          type="secondary"
                          style={{ display: "block", marginTop: 8 }}
                        >
                          Created:{" "}
                          {new Date(
                            reward["created-datetime"]
                          ).toLocaleDateString()}
                        </Text>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 16px",
                    background: "#fafafa",
                  }}
                >
                  <Paragraph type="secondary">
                    No rewards available for this project
                  </Paragraph>
                </div>
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </Content>
  );
};

export default StaffProjectDetailPage;
