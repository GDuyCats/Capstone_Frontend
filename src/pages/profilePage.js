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
  Tabs,
  Typography,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const ProfilePage = () => {
  const { auth, setAuth } = useAuth(); // ✅ Dùng setAuth để cập nhật dữ liệu user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          "https://marvelous-gentleness-production.up.railway.app/api/User/GetUserById",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        const userData = res.data?.data;
        setAuth((prev) => ({
          ...prev,
          fullname: userData?.["full-name"],
          avatar: userData?.avatar,
          bio: userData?.bio,
          phone: userData?.phone,
          createdDate: userData?.["created-datetime"],
          email: userData?.email,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error);
      }
    };
    fetchUserData();
  }, [auth?.token]);

  const showModal = () => {
    form.setFieldsValue({
      email: auth?.email || "",
      phone: auth?.phone || "",
      fullname: auth?.fullname || "",
      bio: auth?.bio || "",
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      // 🟢 Lấy toàn bộ giá trị từ form
      const values = await form.validateFields();
  
      // 🟢 Cập nhật lại form để xóa giá trị password nếu nó rỗng
      if (!values.password || values.password.trim() === "") {
        form.setFieldsValue({ password: undefined }); // Xóa password khỏi form trước khi gửi
        delete values.password; // Xóa khỏi object trước khi gửi API
      }
  
      console.log("Payload gửi lên API:", values); // 🛠 Debug để kiểm tra payload có password hay không
  
      setLoading(true);
  
      const res = await axios.post(
        "https://marvelous-gentleness-production.up.railway.app/api/User/UpdateUser",
        values, // Gửi dữ liệu lên API
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
  
      setLoading(false);
      message.success("Cập nhật thông tin thành công!");
  
      // 🟢 Cập nhật auth nhưng không lưu password
      setAuth((prev) => ({
        ...prev,
        ...values,
      }));
  
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          ...values,
          password: undefined, // Không lưu password
        })
      );
  
      setIsModalOpen(false);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error("Lỗi khi cập nhật thông tin.");
    }
  };
  
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
      if (res.data?.["image-url"]) {
        const newAvatarUrl = `${res.data["image-url"]}?t=${Date.now()}`;
        setAuth((prev) => ({
          ...prev,
          avatar: newAvatarUrl,
        }));
        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...auth,
            avatar: newAvatarUrl,
          })
        );
        message.success("Cập nhật ảnh đại diện thành công!");
      } else {
        message.error("Lỗi khi cập nhật ảnh đại diện!");
      }
    } catch (error) {
      setAvatarLoading(false);
      message.error("Không đúng định dạng ảnh");
    }
  };

  return (
    <Card style={{ maxWidth: 1000, margin: "20px auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={100}
          src={auth?.avatar ? `${auth.avatar}?t=${Date.now()}` : undefined}
          icon={!auth?.avatar && <UserOutlined />}
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
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><UserOutlined /> Profile Info</span>} key="1">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{auth?.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{auth?.phone}</Descriptions.Item>
            <Descriptions.Item label="Created Date">{auth?.createdDate}</Descriptions.Item>
            <Descriptions.Item label="Full name">{auth?.fullname}</Descriptions.Item>
            <Descriptions.Item label="Bio">{auth?.bio}</Descriptions.Item>
          </Descriptions>
          <Button style={{ marginTop: "20px" }} icon={<EditOutlined />} onClick={showModal}>
            Edit Profile
          </Button>
        </TabPane>
      </Tabs>
      <Modal title="Edit Profile" open={isModalOpen} onOk={handleOk} confirmLoading={loading} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="Email" name="email"><Input /></Form.Item>
          <Form.Item label="Phone" name="phone"><Input /></Form.Item>
          <Form.Item label="Full Name" name="fullname"><Input /></Form.Item>
          <Form.Item label="Bio" name="bio"><Input.TextArea /></Form.Item>
          <Form.Item label="New Password" name="password">
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default ProfilePage;
