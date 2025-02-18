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
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";

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

  // Sample posts
  const posts = [
    { key: 1, title: "First Post", date: "2024-01-10" },
    { key: 2, title: "Second Post", date: "2024-01-20" },
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

  return (
    <Card
      style={{ maxWidth: 800, margin: "20px auto", padding: 20 }}
      actions={[
        <Button key="edit" icon={<EditOutlined />} onClick={showModal}>
          Edit Profile
        </Button>,
      ]}
    >
      <Avatar size={100} icon={<UserOutlined />} style={{ marginBottom: 20 }} />

      <Descriptions title="User Profile" bordered column={1}>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {user.createdDatetime}
        </Descriptions.Item>
      </Descriptions>

      {/* <h3 style={{ marginTop: 20 }}>Posts</h3>
      <Table
        dataSource={posts}
        columns={[
          { title: "Title", dataIndex: "title", key: "title" },
          { title: "Date", dataIndex: "date", key: "date" },
        ]}
        pagination={false}
        size="small"
      /> */}

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
