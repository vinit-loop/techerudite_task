import React, { useState } from "react";
import { Form, Input, Select, Button, Typography, Card, message, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        values
      );
      if (response.status === 201) {
        message.success("Registration successful! Please verify your email.");
        setEmail(values.email);
        setVerificationModalVisible(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.message);
      } else {
        console.error("Error registering user:", error);
        message.error("Error registering user.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      message.error("Please enter the verification code");
      return;
    }

    setVerifying(true);
    try {
      const response = await axios.post("http://localhost:8000/auth/verify-email", {
        email,
        otp: verificationCode,
      });

      if (response.status === 200) {
        message.success("Email verified successfully!");
        setVerificationModalVisible(false);
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Verification failed");
      } else {
        message.error("Error verifying email");
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setResendingOtp(true);
    try {
      const response = await axios.post("http://localhost:8000/auth/resend-verification", {
        email,
      });

      if (response.status === 200) {
        message.success("Verification code resent successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Failed to resend verification code");
      } else {
        message.error("Error resending verification code");
      }
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <Card
        className="w-11/12 max-w-lg shadow-2xl border-0 bg-white"
        bodyStyle={{ padding: "32px" }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
            <UserOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>
        </div>

        <div className="text-center mb-6">
          <Title level={3} className="text-gray-800 m-0">
            Create Account
          </Title>
          <Text type="secondary" className="text-gray-500">
            Fill in your details to register
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="middle"
          initialValues={{
            role: "user",
          }}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              name="firstname"
              rules={[
                { required: true, message: "Please enter your first name" },
                { min: 2, message: "First name must be at least 2 characters" },
              ]}
              className="mb-3"
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder="First Name"
                className="rounded-md bg-gray-50 border-gray-200"
              />
            </Form.Item>

            <Form.Item
              name="lastname"
              rules={[
                { required: true, message: "Please enter your last name" },
                { min: 2, message: "Last name must be at least 2 characters" },
              ]}
              className="mb-3"
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder="Last Name"
                className="rounded-md bg-gray-50 border-gray-200"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            className="mb-3"
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email Address"
              className="rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            className="mb-3"
            extra={
              <Text type="secondary" className="text-xs text-gray-500">
                Password must be at least 6 characters
              </Text>
            }
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item name="role" className="mb-4" label="Account Type">
            <Select
              className="rounded-md bg-gray-50 border-gray-200"
              suffixIcon={<UserOutlined className="text-gray-400" />}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-3">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-gradient-to-r from-gray-700 to-gray-900 border-0 rounded-md hover:from-gray-800 hover:to-black"
              loading={loading}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary" className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-gray-700 hover:text-black">
              Sign in
            </a>
          </Text>
        </div>
      </Card>

      {/* Email Verification Modal */}
      <Modal
        title={
          <div className="text-center">
            <CheckCircleOutlined className="text-green-500 text-2xl mb-2" />
            <Title level={4}>Verify Your Email</Title>
          </div>
        }
        open={verificationModalVisible}
        onCancel={() => setVerificationModalVisible(false)}
        footer={null}
        centered
      >
        <div className="py-4">
          <Text className="block text-center mb-6">
            We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your email address.
          </Text>
          
          <div className="mb-6">
            <Input
              size="large"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="text-center text-lg"
              maxLength={6}
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <Button
              type="primary"
              onClick={handleVerifyEmail}
              loading={verifying}
              className="bg-gradient-to-r from-gray-700 to-gray-900 border-0 hover:from-gray-800 hover:to-black h-10"
              block
            >
              Verify Email
            </Button>
            
            <Button
              type="link"
              onClick={handleResendOTP}
              loading={resendingOtp}
              className="text-gray-600"
            >
              Didn't receive the code? Resend
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Register;