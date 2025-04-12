import React, { useState, useEffect } from "react";
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
  Alert,
  List,
  Empty,
} from "antd";
import { UserOutlined, DollarOutlined, GiftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { message } from "antd";
import { createPaypalPayment } from "../../api/apiClient";
import useAuth from "../Hooks/useAuth";

const { Title, Text, Paragraph } = Typography;

const ProjectSidebar = ({ project, rewards = [] }) => {
  const { auth } = useAuth();
  const [pledgeModalVisible, setPledgeModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedReward) {
      const reward = formattedRewards.find((r) => r.id === selectedReward);
      if (reward) {
        setPledgeAmount(reward.amount);
        form.setFieldsValue({ amount: reward.amount });
      }
    }
  }, [selectedReward]);

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

  const safeProject = {
    currentAmount: project["total-amount"] ?? 0,
    goalAmount: project["minimum-amount"] ?? 0,
    backers: project.backers ?? 0,
    endDate: project["end-datetime"],
    ...project,
  };

  const formattedRewards =
    rewards?.map((reward) => ({
      id: reward["reward-id"],
      amount: reward.amount,
      title: `Pledge ${reward.amount.toLocaleString()}$`,
      description: reward.details,
      createdDate: reward["created-datetime"],
      remaining: reward.remaining,
    })) || [];

  const endDate = parseAPIDate(safeProject.endDate);
  const daysLeft = endDate
    ? Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const progressPercentage =
    (safeProject.currentAmount / safeProject.goalAmount) * 100;
  const fundingStatus =
    progressPercentage >= 100
      ? "success"
      : daysLeft > 0
      ? "active"
      : "exception";

  const handlePledge = async (values) => {
    try {
      const hide = message.loading("Processing payment...", 0);
      const response = await createPaypalPayment(
        project["project-id"],
        values.amount
      );
      hide();

      console.log("Full PayPal response:", response); // Debug

      if (response.data?.data) {
        window.location.href = response.data.data;
      } else {
        message.error("Invalid PayPal URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setPledgeModalVisible(false);
    }
  };

  const displayAPIDate = (dateString) => {
    const date = parseAPIDate(dateString);
    return date ? date.toLocaleDateString() : "No date";
  };

  const getEligibleRewards = (amount) => {
    if (!amount) return [];
    return formattedRewards
      .filter((reward) => reward.amount <= amount)
      .sort((a, b) => b.amount - a.amount);
  };

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPledgeAmount(value);
  };

  return (
    <div style={{ position: "sticky", top: 24 }}>
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
                {safeProject.currentAmount.toLocaleString()}$
              </Title>
              <Text type="secondary">
                pledged of {safeProject.goalAmount.toLocaleString()}$ goal
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
              disabled={
                daysLeft <= 0 || auth?.id === project["creator-id"] || !auth
              }
              onClick={() => {
                setSelectedReward(null);
                setPledgeAmount(0);
                form.resetFields();
                setPledgeModalVisible(true);
              }}
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
                {formattedRewards.length}{" "}
                {formattedRewards.length === 1 ? "tier" : "tiers"}
              </Tag>
            </div>
          }
          style={{
            backgroundColor: "rgb(247, 242, 205)",
            padding: "5px",
            borderRadius: 12,
            marginBottom: 24,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid #d9d9d9",
          }}
          headStyle={{ borderBottom: "1px solid #f0f0f0", padding: "16px" }}
          bodyStyle={{ padding: 0 }}
        >
          {formattedRewards.length > 0 ? (
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              {formattedRewards
                .sort((a, b) => a.amount - b.amount)
                .map((reward, index) => (
                  <Card
                    key={reward.id}
                    bordered={false}
                    style={{
                      marginBottom: 16,
                      borderLeft: "4px solid rgb(142, 205, 205)",
                      borderRadius: 4,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      backgroundColor:
                        selectedReward === reward.id
                          ? "rgb(239 180 180)"
                          : "inherit",
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
                        Pledge {reward.amount.toLocaleString()}$ or more
                      </Text>
                      <Space>
                        {reward.remaining !== undefined && (
                          <Tag color={reward.remaining > 0 ? "blue" : "red"}>
                            {reward.remaining > 0
                              ? `${reward.remaining} left`
                              : "Sold out"}
                          </Tag>
                        )}
                        <Tag color="#87d068">Tier {index + 1}</Tag>
                      </Space>
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
                      type={
                        selectedReward === reward.id ? "primary" : "default"
                      }
                      block
                      disabled={
                        daysLeft <= 0 ||
                        auth?.id === project["creator-id"] ||
                        !auth
                      }
                      onClick={() => {
                        setSelectedReward(reward.id);
                        setPledgeAmount(reward.amount);
                        setPledgeModalVisible(true);
                      }}
                      style={{
                        marginTop: 12,
                        borderRadius: 4,
                        height: 40,
                      }}
                    >
                      {selectedReward === reward.id
                        ? "Selected"
                        : "Select this reward"}
                    </Button>
                  </Card>
                ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: "center" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary">
                    This project doesn't have any rewards yet
                  </Text>
                }
              />
              <Text>
                You can still support this project without receiving rewards
              </Text>
            </div>
          )}
        </Card>
      </motion.div>

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
        <Form form={form} layout="vertical" onFinish={handlePledge}>
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
                <Radio.Button
                  value={null}
                  style={{
                    width: "100%",
                    height: "auto",
                    padding: "16px",
                    display: "block",
                    whiteSpace: "normal",
                    borderRadius: 4,
                    marginBottom: 8,
                    borderLeft: "4px solid #d9d9d9",
                    backgroundColor: !selectedReward ? "#f0f9ff" : "inherit",
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
                        No reward, just support the project
                      </Text>
                    </div>
                    <Text type="secondary">
                      Support without expecting rewards
                    </Text>
                  </div>
                </Radio.Button>

                {formattedRewards.length > 0 &&
                  formattedRewards
                    .sort((a, b) => a.amount - b.amount)
                    .map((reward, index) => (
                      <Radio.Button
                        key={reward.id}
                        value={reward.id}
                        disabled={
                          reward.remaining !== undefined &&
                          reward.remaining <= 0
                        }
                        style={{
                          width: "100%",
                          height: "auto",
                          padding: "16px",
                          display: "block",
                          whiteSpace: "normal",
                          borderRadius: 4,
                          marginBottom: 8,
                          borderLeft: "4px solid #1890ff",
                          backgroundColor:
                            selectedReward === reward.id
                              ? "#f0f9ff"
                              : "inherit",
                          opacity:
                            reward.remaining !== undefined &&
                            reward.remaining <= 0
                              ? 0.6
                              : 1,
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
                              ${reward.amount.toLocaleString()} or more
                            </Text>
                            <Space>
                              {reward.remaining !== undefined && (
                                <Tag
                                  color={reward.remaining > 0 ? "blue" : "red"}
                                >
                                  {reward.remaining > 0
                                    ? `${reward.remaining} left`
                                    : "Sold out"}
                                </Tag>
                              )}
                              <Tag color="#87d068">Tier {index + 1}</Tag>
                            </Space>
                          </div>
                          <Text type="secondary">{reward.description}</Text>
                        </div>
                      </Radio.Button>
                    ))}
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="amount"
            label={<Text strong>Pledge amount</Text>}
            rules={[
              { required: true, message: "Please enter your pledge amount" },
              {
                validator: (_, value) => {
                  if (!selectedReward) return Promise.resolve();
                  const minAmount =
                    formattedRewards.find((r) => r.id === selectedReward)
                      ?.amount || 0;
                  return value >= minAmount
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          `Minimum amount is $${minAmount.toLocaleString()}`
                        )
                      );
                },
              },
            ]}
          >
            <Input
              prefix="$"
              type="number"
              size="large"
              min={
                selectedReward
                  ? formattedRewards.find((r) => r.id === selectedReward)
                      ?.amount || 1
                  : 1
              }
              value={pledgeAmount}
              onChange={handleAmountChange}
              placeholder={
                selectedReward
                  ? `Minimum: ${
                      formattedRewards.find((r) => r.id === selectedReward)
                        ?.amount || 0
                    }$`
                  : "Enter amount"
              }
              style={{ borderRadius: 4 }}
            />
          </Form.Item>

          {pledgeAmount > 0 && (
            <Alert
              message={
                <div>
                  <Text>
                    <GiftOutlined /> You'll receive these rewards:
                  </Text>
                  <List
                    size="small"
                    dataSource={getEligibleRewards(pledgeAmount)}
                    renderItem={(reward) => (
                      <List.Item>
                        <Text strong>{reward.amount.toLocaleString()}$:</Text>{" "}
                        {reward.description}
                      </List.Item>
                    )}
                  />
                  {getEligibleRewards(pledgeAmount).length === 0 && (
                    <Text>No rewards eligible for this amount</Text>
                  )}
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

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
