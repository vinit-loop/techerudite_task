import {
  ArrowRightOutlined,
  LogoutOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const titleTimer = setTimeout(() => setTitleVisible(true), 400);
    const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 800);
    const cardsTimer = setTimeout(() => setCardsVisible(true), 1200);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(cardsTimer);
    };
  }, []);
  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "You will need to log in again to access your account.",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      onOk: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("user_id");
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-full h-full overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white opacity-5 animate-pulse`}
            style={{
              width: `${Math.floor(Math.random() * 400) + 100}px`,
              height: `${Math.floor(Math.random() * 400) + 100}px`,
              top: `${Math.floor(Math.random() * 100)}%`,
              left: `${Math.floor(Math.random() * 100)}%`,
              animationDuration: `${Math.floor(Math.random() * 8) + 4}s`,
              animationDelay: `${Math.floor(Math.random() * 5)}s`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-6xl px-4">
        <div className="flex justify-center mb-6">
          <div
            className={`w-96 h-24 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-between shadow-2xl transition-all duration-700 ease-out px-6 ${
              loaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="text-white text-2xl font-bold">
              {localStorage.getItem("role")} -{" "}
              {localStorage.getItem("name") || "TM"}
            </div>
            <Button
              shape="circle"
              icon={<LogoutOutlined />}
              size="large"
              danger
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* Title with fade and slide animation */}
        <div className="text-center mb-8">
          <div className="overflow-hidden mb-2">
            <Title
              level={1}
              className={`text-white text-5xl font-bold m-0 transition-all duration-700 ease-out ${
                titleVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              Welcome to AuthManager
            </Title>
          </div>

          <div className="overflow-hidden">
            <Text
              className={`text-gray-400 text-xl transition-all duration-700 ease-out ${
                subtitleVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              Manage your tasks efficiently and stay organized
            </Text>
          </div>
        </div>

        {/* Access cards with stagger animation */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 transition-all duration-1000 ease-out ${
            cardsVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
        >
          {/* User Card */}
          <Card
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-0 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:bg-opacity-15 transition-all duration-300"
            bodyStyle={{ padding: "28px" }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg mr-4">
                <UserOutlined style={{ fontSize: "20px", color: "white" }} />
              </div>
              <Title level={3} className="text-white m-0">
                User Access
              </Title>
            </div>
            <Text className="text-gray-400 mb-6 block h-20">
              Access your personal dashboard to manage tasks, track progress,
              and stay organized. Perfect for individual users.
            </Text>
            <div className="flex justify-between">
              <Button
                onClick={() => navigate("/login")}
                type="primary"
                ghost
                className="border border-gray-400 text-gray-200 hover:text-white hover:border-white rounded-lg px-6 transition-all duration-300"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/register")}
                type="primary"
                className="bg-gradient-to-r from-gray-700 to-gray-800 border-0 rounded-lg px-6 hover:from-gray-800 hover:to-black transition-all duration-300"
              >
                Register <ArrowRightOutlined className="ml-1" />
              </Button>
            </div>
          </Card>

          {/* Admin Card */}
          <Card
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-0 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:bg-opacity-15 transition-all duration-300"
            bodyStyle={{ padding: "28px" }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg mr-4">
                <SafetyOutlined style={{ fontSize: "20px", color: "white" }} />
              </div>
              <Title level={3} className="text-white m-0">
                Admin Panel
              </Title>
            </div>
            <Text className="text-gray-400 mb-6 block h-20">
              Access the administrator dashboard to manage users, monitor system
              performance, and configure application settings.
            </Text>
            <div className="flex justify-end">
              <Button
                onClick={() => navigate("/admin-login")}
                type="primary"
                className="bg-gradient-to-r from-gray-700 to-gray-800 border-0 rounded-lg px-6 hover:from-gray-800 hover:to-black transition-all duration-300"
              >
                Admin Login <ArrowRightOutlined className="ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
