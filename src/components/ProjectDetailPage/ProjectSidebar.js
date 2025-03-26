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
} from "antd";
import { UserOutlined, DollarOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ProjectSidebar = ({ project }) => {
  const [pledgeModalVisible, setPledgeModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  // Kiểm tra nếu project chưa được load
  if (!project) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Thiết lập giá trị mặc định
  const safeProject = {
    currentAmount: 0,
    goalAmount: 0,
    backers: 0,
    endDate: new Date(),
    rewards: [],
    ...project,
  };

  const daysLeft = Math.ceil(
    (new Date(safeProject.endDate) - new Date()) / (1000 * 60 * 60 * 24)
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

  return (
    <div style={{ position: "sticky", top: 24 }}>
      {/* Funding status card */}
      <Card
        bordered
        style={{
          backgroundColor: "rgb(247, 242, 205)",
          border: "black solid 0.5px",
          marginBottom: 24,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          borderRadius: 8,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Progress
              percent={Math.min(progressPercentage, 100).toFixed(0)}
              status={fundingStatus}
              strokeWidth={10}
              format={(percent) => `${percent}%`}
            />

            <Title level={2} style={{ margin: "16px 0 0 0" }}>
              ${safeProject.currentAmount?.toLocaleString() ?? "0"}
            </Title>
            <Text type="secondary">
              pledged of ${safeProject.goalAmount?.toLocaleString() ?? "0"} goal
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  Backers
                </Text>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {safeProject.backers?.toLocaleString() ?? "0"}
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
              border: "black solid 0.5px",
              fontSize: 16,
              borderRadius: 4,
              background: "#1677ff",
            }}
          >
            Back this project
          </Button>
        </Space>
      </Card>

      {/* Rewards card - Chỉ hiển thị nếu có rewards */}
      {safeProject.rewards?.length > 0 && (
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Rewards
            </Title>
          }
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            borderRadius: 8,
            backgroundColor: "#f7f2cd",
            border: "black solid 0.3px",
          }}
          headStyle={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {safeProject.rewards.map((reward) => {
              const safeReward = {
                id: "",
                amount: 0,
                title: "",
                description: "",
                remainingQuantity: 0,
                limitedQuantity: false,
                deliveryDate: null,
                featured: false,
                ...reward,
              };

              return (
                <Card
                  key={safeReward.id}
                  bordered
                  hoverable
                  style={{
                    borderRadius: 8,
                    border: "black solid 0.3px",
                    backgroundColor:
                      safeReward.remainingQuantity === 0 ? "#f5f5f5" : "white",
                  }}
                >
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Tag
                      color="success"
                      style={{
                        borderRadius: 4,
                        fontSize: 14,
                        padding: "2px 8px",
                      }}
                    >
                      ${safeReward.amount} or more
                    </Tag>

                    {safeReward.featured && <Tag color="blue">Popular</Tag>}

                    <Title level={4} style={{ marginTop: 8, marginBottom: 4 }}>
                      {safeReward.title}
                    </Title>

                    <Paragraph>{safeReward.description}</Paragraph>

                    {safeReward.deliveryDate && (
                      <Text type="secondary">
                        Estimated delivery:{" "}
                        {new Date(safeReward.deliveryDate).toLocaleDateString()}
                      </Text>
                    )}

                    <div style={{ marginTop: 8 }}>
                      {safeReward.limitedQuantity ? (
                        <div
                          style={{
                            border: "1px solid #e8e8e8",
                            borderRadius: 4,
                            padding: "4px 10px",
                            display: "inline-block",
                            fontSize: 14,
                            color:
                              safeReward.remainingQuantity < 10
                                ? "#fa8c16"
                                : "#1890ff",
                          }}
                        >
                          {safeReward.remainingQuantity} of{" "}
                          {safeReward.limitedQuantity} remaining
                        </div>
                      ) : (
                        <Tag color="blue">Unlimited</Tag>
                      )}
                    </div>

                    <Button
                      type="primary"
                      block
                      disabled={
                        safeReward.remainingQuantity === 0 || daysLeft <= 0
                      }
                      onClick={() => {
                        setSelectedReward(safeReward.id);
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
                  </Space>
                </Card>
              );
            })}
          </Space>
        </Card>
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
          <Form.Item
            name="rewardId"
            label={<Text strong>Select your reward</Text>}
            rules={[{ required: true, message: "Please select a reward" }]}
          >
            <Radio.Group
              onChange={(e) => setSelectedReward(e.target.value)}
              value={selectedReward}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {safeProject.rewards?.map((reward) => {
                  const safeReward = {
                    id: "",
                    amount: 0,
                    title: "",
                    description: "",
                    remainingQuantity: 0,
                    ...reward,
                  };

                  return (
                    <Radio.Button
                      key={safeReward.id}
                      value={safeReward.id}
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "12px",
                        display: "block",
                        whiteSpace: "normal",
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                      disabled={safeReward.remainingQuantity === 0}
                    >
                      <div>
                        <Title level={5} style={{ marginBottom: 4 }}>
                          ${safeReward.amount} - {safeReward.title}
                          {safeReward.remainingQuantity === 0 && (
                            <Tag color="red" style={{ marginLeft: 8 }}>
                              Sold out
                            </Tag>
                          )}
                        </Title>
                        <Text type="secondary">{safeReward.description}</Text>
                      </div>
                    </Radio.Button>
                  );
                })}
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
                    safeProject.rewards?.find((r) => r.id === selectedReward)
                      ?.amount || 0;
                  return value >= minAmount
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(`Minimum amount is $${minAmount}`)
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
                  ? safeProject.rewards?.find((r) => r.id === selectedReward)
                      ?.amount || 1
                  : 1
              }
              placeholder={
                selectedReward
                  ? `Minimum: $${
                      safeProject.rewards?.find((r) => r.id === selectedReward)
                        ?.amount || 0
                    }`
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
