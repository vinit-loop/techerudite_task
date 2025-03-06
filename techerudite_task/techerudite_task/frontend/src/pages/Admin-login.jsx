import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      navigate("/welcome");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        values
      );

      const { token, user } = response.data;
      const decodedToken = jwtDecode(token);
      const { role, id: userId } = decodedToken;

      if (role !== "admin") {
        message.error(
          "This login page is for administrators only. Please use the user login page."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("name", user?.firstname || "Admin");

      message.success("Admin logged in successfully!");

      navigate("/welcome");
    } catch (error) {
      console.error("Error logging in:", error);
      message.error("Invalid admin credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <Card
        className="w-11/12 max-w-md shadow-2xl border-0 bg-white"
        bodyStyle={{ padding: "32px" }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
            <SafetyOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>
        </div>

        <div className="text-center mb-6">
          <Title level={3} className="text-gray-800 m-0">
            Admin Login
          </Title>
          <Text type="secondary" className="text-gray-500">
            Sign in to your administrator account
          </Text>
        </div>

        <Form
          form={form}
          name="admin_login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="middle"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your admin email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            className="mb-4"
          >
            <Input
              prefix={<SafetyOutlined className="text-gray-400" />}
              placeholder="Admin Email"
              className="rounded-md py-2 bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            className="mb-6"
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-md py-2 bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item className="mb-3">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-11 bg-gradient-to-r from-gray-700 to-gray-900 border-0 rounded-md hover:from-gray-800 hover:to-black text-base"
            >
              Admin Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center">
          <Text type="secondary" className="text-sm text-gray-500">
            Forgot your admin credentials?{" "}
            <a href="/admin-reset" className="text-gray-700 hover:text-black">
              Contact Support
            </a>
          </Text>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Text type="secondary" className="text-xs text-gray-500">
            Are you a regular user?{" "}
            <a href="/login" className="text-gray-700 hover:text-black">
              Go to User Login
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
