import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const UserLogin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "user") {
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

      if (role !== "user") {
        message.error(
          "This login page is for users only. Please use the admin login page."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("name", user?.firstname || "User");

      message.success("Logged in successfully!");
      navigate("/welcome");
    } catch (error) {
      console.error("Error logging in:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          message.error(
            data.message || "Invalid email or password. Please try again."
          );
        } else if (status === 403) {
          message.error(
            data.message ||
              "Your account is deactivated or email is not verified."
          );
        } else if (status === 404) {
          message.error("User not found. Please register first.");
        } else {
          message.error("Something went wrong. Please try again later.");
        }
      } else if (error.request) {
        message.error("No response from server. Please check your network.");
      } else {
        message.error("Login failed. Please try again.");
      }
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
            <UserOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>
        </div>

        <div className="text-center mb-6">
          <Title level={3} className="text-gray-800 m-0">
            User Login
          </Title>
          <Text type="secondary" className="text-gray-500">
            Sign in to your user account
          </Text>
        </div>

        <Form
          form={form}
          name="user_login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="middle"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            className="mb-4"
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email Address"
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
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-5">
          <Text type="secondary" className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-gray-700 hover:text-black">
              Register
            </a>
          </Text>
        </div>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-gray-700 hover:text-black text-sm"
          >
            Forgot your password?
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Text type="secondary" className="text-xs text-gray-500">
            Are you an administrator?{" "}
            <a href="/admin-login" className="text-gray-700 hover:text-black">
              Go to Admin Login
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default UserLogin;
