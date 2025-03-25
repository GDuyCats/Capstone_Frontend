import React, { useEffect, useState } from "react";
import { fetchProjectDetails } from "../api/apiClient";
import {
  Layout,
  Typography,
  Row,
  Col,
  Tabs,
  Button,
  Card,
  Progress,
  Statistic,
  Modal,
  Radio,
  Input,
  Form,
} from "antd";
import { useParams } from "react-router-dom";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProjectDetailPage = () => {
  const [pledgeModalVisible, setPledgeModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
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

  const handlePledge = (values) => {
    console.log("Pledge values:", values);
    setPledgeModalVisible(false);
  };

  return (
    <Content style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <img
            src={project.thumbnail}
            alt={project.title}
            style={{ width: "100%", borderRadius: 8 }}
          />

          <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
            <TabPane tab="About" key="1">
              <Paragraph>{project.description}</Paragraph>
            </TabPane>
            <TabPane tab="Updates" key="2">
              Project updates will be shown here
            </TabPane>
            <TabPane tab="Comments" key="3">
              Community discussion
            </TabPane>
          </Tabs>
        </Col>

        <Col span={8}>
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

            <Button
              type="primary"
              size="large"
              block
              style={{ marginTop: 24 }}
              onClick={() => setPledgeModalVisible(true)}
            >
              Back this project
            </Button>
          </Card>

          <Title level={4} style={{ marginTop: 24 }}>
            Rewards
          </Title>
          {project.rewards.map((reward) => (
            <Card key={reward.id} style={{ marginTop: 16 }}>
              <Title level={5}>${reward.amount} or more</Title>
              <Title level={4}>{reward.title}</Title>
              <Paragraph>{reward.description}</Paragraph>
              <Text type="secondary">
                {reward.remainingQuantity} of {reward.limitedQuantity} remaining
              </Text>
            </Card>
          ))}
        </Col>
      </Row>

      <Modal
        title="Back this project"
        visible={pledgeModalVisible}
        onCancel={() => setPledgeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handlePledge}>
          <Form.Item name="rewardId" label="Select your reward">
            <Radio.Group onChange={(e) => setSelectedReward(e.target.value)}>
              {project.rewards.map((reward) => (
                <Radio.Button key={reward.id} value={reward.id}>
                  ${reward.amount} - {reward.title}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item name="amount" label="Pledge amount">
            <Input
              prefix="$"
              type="number"
              min={
                selectedReward
                  ? project.rewards.find((r) => r.id === selectedReward).amount
                  : 1
              }
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Continue to payment
          </Button>
        </Form>
      </Modal>
    </Content>
  );
};

export default ProjectDetailPage;
