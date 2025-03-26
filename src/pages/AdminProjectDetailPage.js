import React, { useEffect, useState } from "react";
import { fetchProjectDetails } from "../api/apiClient";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tabs,
  Card,
  Progress,
  Statistic,
  Carousel,
} from "antd";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProjectComments from "../components/ProjectDetailPage/ProjectComments";
import ProjectUpdates from "../components/ProjectDetailPage/ProjectUpdates";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  const daysLeft = Math.ceil(
    (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const progressPercentage = (project.currentAmount / project.goalAmount) * 100;

  return (
    <Content style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Carousel autoplay>
              {project?.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Project Image ${index + 1}`}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              ))}
            </Carousel>
          </motion.div>

          <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
            <TabPane tab="About" key="1">
              <Paragraph>{project.description}</Paragraph>
            </TabPane>
            <TabPane tab="Updates" key="2">
              <ProjectUpdates updates={project.updates} />{" "}
            </TabPane>
            <TabPane tab="Comments" key="3">
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
            </TabPane>
          </Tabs>
        </Col>

        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <Progress
                percent={Math.min(progressPercentage, 100)}
                status="active"
              />
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="Pledged"
                    value={project.currentAmount}
                    prefix="$"
                  />
                  <Text type="secondary">of ${project.goalAmount} goal</Text>
                </Col>
                <Col span={12}>
                  <Statistic title="Backers" value={project.backers} />
                </Col>
                <Col span={12}>
                  <Statistic title="Days to go" value={daysLeft} />
                </Col>
              </Row>
            </Card>
          </motion.div>

          <Title level={4} style={{ marginTop: 24 }}>
            Rewards
          </Title>
          {project.rewards.map((reward) => (
            <motion.div
              key={reward.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card style={{ marginTop: 16 }}>
                <Title level={5}>${reward.amount} or more</Title>
                <Title level={4}>{reward.title}</Title>
                <Paragraph>{reward.description}</Paragraph>
                <Text type="secondary">
                  {reward.remainingQuantity} of {reward.limitedQuantity}{" "}
                  remaining
                </Text>
              </Card>
            </motion.div>
          ))}
        </Col>
      </Row>
    </Content>
  );
};

export default ProjectDetailPage;
