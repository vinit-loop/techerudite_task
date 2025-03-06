import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <Result
        icon={<FrownOutlined style={{ fontSize: "80px", color: "#d1d5db" }} />}
        title={<span className="text-gray-200 text-4xl">404 - Page Not Found</span>}
        subTitle={
          <p className="text-gray-400 text-lg">
            The page you are looking for does not exist or has been moved.
          </p>
        }
        extra={
          <Button
            type="primary"
            className="bg-gray-800 border-none hover:bg-gray-600"
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        }
        className="p-8 bg-gray-800 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default NotFound;
