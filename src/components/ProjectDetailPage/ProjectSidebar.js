import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Button,
  Card,
  Progress,
  Tag,
  Space,
  Modal,
  Radio,
  Input,
  Form,
  Spin,
  Divider,
} from "antd";
import { UserOutlined, DollarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const ProjectSidebar = ({ project }) => {
  const [pledgeModalVisible, setPledgeModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  if (!project) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const parseAPIDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return null;
    }
  };

  // Mapping dữ liệu từ API
  const safeProject = {
    currentAmount: project["total-amount"] ?? 0,
    goalAmount: project["minimum-amount"] ?? 0,
    backers: project.backers ?? 0,
    endDate: project["end-datetime"],
    rewards: (project.rewards?.data || []).map((reward) => ({
      id: reward["reward-id"],
      amount: reward.amount,
      title: `Pledge ${reward.amount.toLocaleString()}đ`,
      description: reward.details,
      createdDate: reward["created-datetime"],
    })),
    ...project,
  };

  const daysLeft = Math.ceil(
    (parseAPIDate(safeProject.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const progressPercentage =
    (safeProject.currentAmount / safeProject.goalAmount) * 100;
  const fundingStatus =
    progressPercentage >= 100
      ? "success"
      : daysLeft > 0
      ? "active"
      : "exception";

  const handlePledge = (values) => {
    console.log("Pledge values:", values);
    setPledgeModalVisible(false);
  };

  const displayAPIDate = (dateString) => {
    const date = parseAPIDate(dateString);
    return date ? date.toLocaleDateString() : "No date";
  };

  return (
    <div style={{ position: "sticky", top: 24 }}>
      {/* Funding status card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          bordered
          style={{
            backgroundColor: "rgb(247, 242, 205)",
            border: "1px solid #d9d9d9",
            marginBottom: 24,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 12,
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Progress
                percent={Math.min(progressPercentage, 100).toFixed(0)}
                status={fundingStatus}
                strokeWidth={10}
                strokeColor={progressPercentage >= 100 ? "#52c41a" : "#1890ff"}
                format={(percent) => `${percent}%`}
              />

              <Title level={2} style={{ margin: "16px 0 0 0" }}>
                {safeProject.currentAmount.toLocaleString()}đ
              </Title>
              <Text type="secondary">
                pledged of {safeProject.goalAmount.toLocaleString()}đ goal
              </Text>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <Text type="secondary" style={{ fontSize: 15 }}>
                    Backers
                  </Text>
                  <div
                    style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}
                  >
                    {safeProject.backers.toLocaleString()}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text type="secondary" style={{ fontSize: 15 }}>
                    Days to go
                  </Text>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: daysLeft <= 5 ? "#ff4d4f" : "#1890ff",
                      lineHeight: 1.2,
                    }}
                  >
                    {daysLeft > 0 ? daysLeft : 0}
                  </div>
                </div>
              </Col>
            </Row>

            <Button
              type="primary"
              size="large"
              block
              icon={<DollarOutlined />}
              disabled={daysLeft <= 0}
              onClick={() => setPledgeModalVisible(true)}
              style={{
                height: 50,
                fontSize: 16,
                borderRadius: 8,
                background: "#1677ff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Back this project
            </Button>
          </Space>
        </Card>
      </motion.div>

      {/* Rewards card */}
      {safeProject.rewards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Title level={4} style={{ margin: 0 }}>
                  Project Rewards
                </Title>
                <Tag color="gold" style={{ marginLeft: 8 }}>
                  {safeProject.rewards.length} tiers
                </Tag>
              </div>
            }
            style={{
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid #d9d9d9",
            }}
            headStyle={{ borderBottom: "1px solid #f0f0f0", padding: "16px" }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              {safeProject.rewards
                .sort((a, b) => a.amount - b.amount)
                .map((reward, index) => (
                  <Card
                    key={reward.id}
                    bordered={false}
                    style={{
                      marginBottom: 16,
                      borderLeft: "4px solid #1890ff",
                      borderRadius: 4,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text strong style={{ fontSize: 16 }}>
                        Pledge {reward.amount.toLocaleString()}đ or more
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
                      {reward.description || "No reward details provided"}
                    </Paragraph>
                    <Divider
                      style={{
                        margin: "12px 0",
                        borderColor: "#f0f0f0",
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Created: {displayAPIDate(reward.createdDate)}
                    </Text>
                    <Button
                      type="primary"
                      block
                      disabled={daysLeft <= 0}
                      onClick={() => {
                        setSelectedReward(reward.id);
                        setPledgeModalVisible(true);
                      }}
                      style={{
                        marginTop: 12,
                        borderRadius: 4,
                        height: 40,
                      }}
                    >
                      Select this reward
                    </Button>
                  </Card>
                ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Pledge Modal */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Back this project
          </Title>
        }
        open={pledgeModalVisible}
        onCancel={() => setPledgeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={handlePledge}>
          {safeProject.rewards.length > 0 && (
            <Form.Item
              name="rewardId"
              label={<Text strong>Select your reward</Text>}
            >
              <Radio.Group
                onChange={(e) => setSelectedReward(e.target.value)}
                value={selectedReward}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {safeProject.rewards
                    .sort((a, b) => a.amount - b.amount)
                    .map((reward, index) => (
                      <Radio.Button
                        key={reward.id}
                        value={reward.id}
                        style={{
                          width: "100%",
                          height: "auto",
                          padding: "16px",
                          display: "block",
                          whiteSpace: "normal",
                          borderRadius: 4,
                          marginBottom: 8,
                          borderLeft: "4px solid #1890ff",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}
                          >
                            <Text strong style={{ fontSize: 16 }}>
                              {reward.amount.toLocaleString()}đ
                            </Text>
                            <Tag color="#87d068">Tier {index + 1}</Tag>
                          </div>
                          <Text type="secondary">{reward.description}</Text>
                        </div>
                      </Radio.Button>
                    ))}
                </Space>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item
            name="amount"
            label={<Text strong>Pledge amount</Text>}
            rules={[
              { required: true, message: "Please enter your pledge amount" },
              {
                validator: (_, value) => {
                  if (!selectedReward) return Promise.resolve();
                  const minAmount =
                    safeProject.rewards.find((r) => r.id === selectedReward)
                      ?.amount || 0;
                  return value >= minAmount
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(`Minimum amount is ${minAmount}đ`)
                      );
                },
              },
            ]}
          >
            <Input
              prefix="đ"
              type="number"
              size="large"
              min={
                selectedReward
                  ? safeProject.rewards.find((r) => r.id === selectedReward)
                      ?.amount || 1
                  : 1
              }
              placeholder={
                selectedReward
                  ? `Minimum: ${
                      safeProject.rewards.find((r) => r.id === selectedReward)
                        ?.amount || 0
                    }đ`
                  : "Enter amount"
              }
              style={{ borderRadius: 4 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                height: 50,
                fontSize: 16,
                borderRadius: 4,
              }}
            >
              Continue to payment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectSidebar;
