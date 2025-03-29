import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProject, fetchRewardsByProjectId } from "../api/apiClient";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tabs,
  Card,
  Spin,
  Divider,
  Tag,
} from "antd";
import { motion } from "framer-motion";
import { UserOutlined } from "@ant-design/icons";
import TipTapViewer from "../components/TipTapViewer";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";
import placeholder from "../assets/placeholder-1-1-1.png";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const StaffProjectDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [rewardsLoading, setRewardsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetchProject(id);
        if (response.data.success) {
          setProject(response.data.data);
          // Fetch rewards after project data is loaded
          fetchRewardsData(response.data.data["project-id"] || id);
        } else {
          console.error("Error fetching project:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRewardsData = async (projectId) => {
      try {
        setRewardsLoading(true);
        const response = await fetchRewardsByProjectId(projectId);
        if (response.data.success) {
          setRewards(response.data.data || []);
        } else {
          console.error("Error fetching rewards:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setRewardsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  if (!project) return <p>Project not found</p>;

  const daysLeft = project["end-datetime"]
    ? Math.max(
        0,
        Math.ceil(
          (new Date(project["end-datetime"]) - new Date()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <Content style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <img
                src={
                  !project.thumbnail || project.thumbnail === "Null"
                    ? placeholder
                    : project.thumbnail
                }
                alt="Project Thumbnail"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #d9d9d9",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          </motion.div>

          <Tabs defaultActiveKey="1" style={{ marginTop: 24 }} animated>
            <TabPane tab="About" key="1">
              {project.story ? (
                <TipTapViewer content={project.story} />
              ) : (
                <Paragraph type="secondary">No story available.</Paragraph>
              )}
              <Divider />
              <Title level={4}>Project Description</Title>
              <Paragraph>
                {project.description || "No description available."}
              </Paragraph>
            </TabPane>
            <TabPane tab="Updates" key="2">
              <ProjectUpdates updates={project.updates} />
            </TabPane>
            <TabPane tab="Comments" key="3">
              <ProjectComments comments={project.comments} />
            </TabPane>
          </Tabs>
        </Col>

        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              style={{
                borderRadius: "12px",
                background: "rgb(241, 223, 171)",
                color: "white",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <Text strong style={{ fontSize: "26px", display: "block" }}>
                {project["total-amount"] ? `$${project["total-amount"]}` : "$0"}
              </Text>
              <Paragraph style={{ marginBottom: 16 }}>
                pledged of ${project["minimum-amount"] || "N/A"} goal
              </Paragraph>

              <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                  <Title level={5} style={{ margin: 0 }}>
                    Backers
                  </Title>
                  <Text strong style={{ fontSize: "20px" }}>
                    {project.backers || 0}
                  </Text>
                </Col>
                <Col>
                  <Title level={5} style={{ margin: 0 }}>
                    Days to go
                  </Title>
                  <Text
                    strong
                    style={{
                      fontSize: "20px",
                      color: daysLeft <= 3 ? "red" : "#1890ff",
                    }}
                  >
                    {daysLeft}
                  </Text>
                </Col>
              </Row>
              <Divider style={{ borderColor: "rgba(255,255,255,0.5)" }} />
            </Card>

            {/* New Rewards Card */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Project Rewards
                  </Title>
                  <Tag color="gold" style={{ marginLeft: "8px" }}>
                    {rewards.length} tiers
                  </Tag>
                </div>
              }
              style={{
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {rewardsLoading ? (
                <div style={{ textAlign: "center", padding: "24px" }}>
                  <Spin size="large" />
                </div>
              ) : rewards.length > 0 ? (
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {rewards.map((reward, index) => (
                    <Card
                      key={reward["reward-id"] || index}
                      style={{
                        marginBottom: "16px",
                        borderLeft: "4px solid #1890ff",
                        borderRadius: "4px",
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong style={{ fontSize: "16px" }}>
                          Pledge ${reward.amount.toLocaleString()} or more
                        </Text>
                        <Tag color="#87d068">Tier {index + 1}</Tag>
                      </div>
                      <Paragraph
                        style={{
                          marginBottom: 0,
                          color: "#666",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {reward.details || "No reward details provided"}
                      </Paragraph>
                      <Divider
                        style={{
                          margin: "12px 0",
                          borderColor: "#f0f0f0",
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Created:{" "}
                        {new Date(
                          reward["created-datetime"]
                        ).toLocaleDateString()}
                      </Text>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card
                  style={{
                    textAlign: "center",
                    background: "#fafafa",
                  }}
                >
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    No rewards available for this project
                  </Paragraph>
                </Card>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Content>
  );
};

export default StaffProjectDetailPage;
