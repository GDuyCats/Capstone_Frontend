import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { login } from "../../api/apiClient";

function Loginform() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await login(values);
      if (response.data.success) {
        const { token, role, hint } = response.data;

        setAuth({ token, role, userId: hint });
        message.success("Đăng nhập thành công!");

        navigate("/");
      } else {
        message.error("Đăng nhập thất bại!");
      }
    } catch (error) {
      message.error("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="relative flex flex-col w-full max-w-2xl md:bg-white mt-52 mb-52">
        <h2 className="text-3xl font-bold text-center mb-4">Đăng Nhập</h2>

        <Form name="login" onFinish={onFinish} className="p-6 space-y-4">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Checkbox>Ghi nhớ tôi</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link to="/register" className="text-blue-500">
            Tạo tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Loginform;
