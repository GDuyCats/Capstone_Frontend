import React, { useState, useEffect } from "react";
import useAuth from "../components/Hooks/useAuth";
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
  CheckOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const ProfilePage = () => {
  const { auth, setAuth } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
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
          paymentAccount: userData?.["payment-account"],
          createdDate: userData?.["created-datetime"],
          email: userData?.email,
        }));
      } catch (error) {
        console.error("Error when fetching user:", error);
      }
    };
    fetchUserData();
  }, [auth?.token]);

  const showModal = () => {
    form.setFieldsValue({
      email: auth?.email || "",
      fullname: auth?.fullname || "",
      bio: auth?.bio || "",
    });
    setIsModalOpen(true);
  };

  const showVerifyModal = () => {
    verifyForm.setFieldsValue({
      phone: auth?.phone || "",
      paymentAccount: auth?.paymentAccount || "",
    });
    setIsVerifyModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("fullname", values.fullname);
      formData.append("email", values.email);
      formData.append("bio", values.bio);

      if (values.password && values.password.trim() !== "") {
        formData.append("password", values.password);
      }

      const res = await axios.post(
        "https://marvelous-gentleness-production.up.railway.app/api/User/UpdateUser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      message.success("Update information successfully!");

      setAuth((prev) => ({
        ...prev,
        fullname: values.fullname,
        email: values.email,
        bio: values.bio,
      }));

      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          fullname: values.fullname,
          email: values.email,
          bio: values.bio,
        })
      );

      setIsModalOpen(false);
    } catch (error) {
      setLoading(false);
      console.error("❌ Error when updating your information:", error);
      message.error("Error when updating your information.");
    }
  };

  const handleVerifyOk = async () => {
    try {
      const values = await verifyForm.validateFields();
      setVerifyLoading(true);

      const formData = new FormData();
      formData.append("phone", values.phone);
      formData.append("paymentAccount", values.paymentAccount);

      const res = await axios.post(
        "https://marvelous-gentleness-production.up.railway.app/api/User/UpdateUser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setVerifyLoading(false);
      message.success("Verify your account successfully!!");

      setAuth((prev) => ({
        ...prev,
        phone: values.phone,
        paymentAccount: values.paymentAccount,
      }));

      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          phone: values.phone,
          paymentAccount: values.paymentAccount,
        })
      );

      setIsVerifyModalOpen(false);
    } catch (error) {
      setVerifyLoading(false);
      console.error("❌ Error when verify your account:", error);
      message.error("Error when verify your account.");
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
        message.success("Update your profile successfully!");
      } else {
        message.error("Error when update your profile!");
      }
    } catch (error) {
      setAvatarLoading(false);
      message.error("Wrong image format");
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
        <TabPane
          tab={
            <span>
              <UserOutlined /> Profile Info
            </span>
          }
          key="1"
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{auth?.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{auth?.phone}</Descriptions.Item>
            <Descriptions.Item label="Payment Account">
              {auth?.paymentAccount || "Chưa xác nhận"}
            </Descriptions.Item>
            <Descriptions.Item label="Created Date">
              {auth?.createdDate}
            </Descriptions.Item>
            <Descriptions.Item label="Full name">
              {auth?.fullname}
            </Descriptions.Item>
            <Descriptions.Item label="Bio">{auth?.bio}</Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <Button icon={<EditOutlined />} onClick={showModal}>
              Edit Profile
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={showVerifyModal}
            >
              Verify Account
            </Button>
          </div>
        </TabPane>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Full Name" name="fullname">
            <Input />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="New Password" name="password">
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Verify Account Modal */}
      <Modal
        title="Verify Account"
        open={isVerifyModalOpen}
        onOk={handleVerifyOk}
        confirmLoading={verifyLoading}
        onCancel={() => setIsVerifyModalOpen(false)}
      >
        <Form form={verifyForm} layout="vertical">
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Payment Account"
            name="paymentAccount"
            rules={[
              { required: true, message: "Please input your payment account!" },
            ]}
          >
            <Input placeholder="Bank account number or e-wallet info" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProfilePage;
