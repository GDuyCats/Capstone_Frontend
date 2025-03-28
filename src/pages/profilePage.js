import React, { useState, useEffect } from "react";
import useAuth from "../components/Hooks/useAuth"; // 👉 Lấy token từ AuthContext
import axios from "axios";
import {
  Card,
  Avatar,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  TrophyOutlined,
  UploadOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const ProfilePage = () => {
  const { auth, setAuth } = useAuth(); // ✅ Thêm `setAuth` để cập nhật avatar vào auth
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.token) {
        return;
      }

      try {
        const res = await axios.get(
          "https://marvelous-gentleness-production.up.railway.app/api/User/GetUserById",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setUser(res.data?.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error);
      }
    };

    fetchUserData();
  }, [auth]);

  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue(user);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axios.post(
        "https://marvelous-gentleness-production.up.railway.app/api/User/UpdateUser",
        {
          email: values.email,
          phone: values.phone,
          fullname: values["full-name"],
          bio: values.bio,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setLoading(false);
      setUser({ ...user, ...values });
      message.success("Cập nhật thông tin thành công!");
      setIsModalOpen(false);
    } catch (error) {
      setLoading(false);
      message.error("Lỗi khi cập nhật thông tin.");
    }
  };

  // ✅ Cập nhật avatar & lưu vào auth
  const handleUploadAvatar = async (file) => {
    if (!file) {
      message.error("Vui lòng chọn một file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setAvatarLoading(true);

      const res = await axios.put(
        "https://marvelous-gentleness-production.up.railway.app/api/User/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAvatarLoading(false);
      console.log("Response từ API:", res.data);

      if (res.data?.["image-url"]) {
        const newAvatarUrl = `${res.data["image-url"]}?t=${Date.now()}`;

        // ✅ Cập nhật avatar trong user state
        setUser((prevUser) => ({
          ...prevUser,
          avatar: newAvatarUrl,
        }));

        // ✅ Cập nhật avatar trong auth
        const updatedAuth = {
          ...auth,
          user: { ...auth.user, avatar: newAvatarUrl },
        };
        setAuth(updatedAuth);
        localStorage.setItem("auth", JSON.stringify(updatedAuth));

        message.success("Cập nhật ảnh đại diện thành công!");
      } else {
        message.error("Lỗi khi cập nhật ảnh đại diện!");
      }
    } catch (error) {
      setAvatarLoading(false);
      console.error("Lỗi khi tải lên ảnh:", error);
      message.error("Lỗi khi tải lên ảnh! Thử lại sau.");
    }
  };

  return (
    <Card style={{ maxWidth: 1000, margin: "20px auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={100}
          src={user?.avatar ? user.avatar : undefined}
          icon={!user?.avatar && <UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Title level={4}>My Profile</Title>

        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleUploadAvatar(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} loading={avatarLoading}>
            Update Avatar
          </Button>
        </Upload>
      </div>

      {user ? (
        <Tabs defaultActiveKey="1">
          <TabPane
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
                {user["created-datetime"]}
              </Descriptions.Item>
              <Descriptions.Item label="Full name">
                {user["full-name"]}
              </Descriptions.Item>
              <Descriptions.Item label="Bio">{user.bio}</Descriptions.Item>
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
              columns={[
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
                    <Tag color={status === "Delivered" ? "green" : "orange"}>
                      {status}
                    </Tag>
                  ),
                },
              ]}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      ) : (
        <p>Đang tải dữ liệu người dùng...</p>
      )}
    </Card>
  );
};

export default ProfilePage;
