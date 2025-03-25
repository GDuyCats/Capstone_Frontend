import React, { useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  TrophyOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Sample user data
  const [user, setUser] = useState({
    userId: 1,
    email: "user@example.com",
    phone: "123-456-7890",
    createdDatetime: "2024-02-07",
  });

  // Sample rewards data
  const rewards = [
    {
      key: 1,
      projectName: "Cozy Game Studio",
      projectId: "p1",
      rewardTitle: "Early Bird Package",
      rewardDescription: "Digital copy of the game + exclusive wallpaper",
      amount: 25,
      dateReceived: "2024-01-15",
      status: "Delivered", // or "Pending"
    },
    {
      key: 2,
      projectName: "Adventure Quest RPG",
      projectId: "p2",
      rewardTitle: "Collector's Edition",
      rewardDescription: "Physical copy + Digital bonuses + Art book",
      amount: 75,
      dateReceived: "2024-02-01",
      status: "Pending",
    },
  ];

  // Handle edit modal
  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue(user);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setUser({ ...user, ...values });
      setIsModalOpen(false);
    });
  };

  // Columns for rewards table
  const rewardsColumns = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      render: (text, record) => (
        <a href={`/project/${record.projectId}`}>{text}</a>
      ),
    },
    {
      title: "Reward",
      dataIndex: "rewardTitle",
      key: "rewardTitle",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.rewardDescription}
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Date",
      dataIndex: "dateReceived",
      key: "dateReceived",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Delivered" ? "green" : "orange"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Card style={{ maxWidth: 1000, margin: "20px auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={100}
          icon={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Title level={4}>My Profile</Title>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane
          actions
          tab={
            <span>
              <UserOutlined />
              Profile Info
            </span>
          }
          key="1"
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Created Date">
              {user.createdDatetime}
            </Descriptions.Item>
          </Descriptions>
          <Button
            style={{ marginTop: "20px" }}
            key="edit"
            icon={<EditOutlined />}
            onClick={showModal}
          >
            Edit Profile
          </Button>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TrophyOutlined />
              My Rewards
            </span>
          }
          key="2"
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>
              <GiftOutlined /> Rewards from Backed Projects
            </Title>
          </div>
          <Table
            dataSource={rewards}
            columns={rewardsColumns}
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{ margin: 0, padding: 16, backgroundColor: "#f5f5f5" }}
                >
                  {record.rewardDescription}
                </p>
              ),
            }}
          />
        </TabPane>
      </Tabs>

      {/* Edit Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Enter a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProfilePage;
