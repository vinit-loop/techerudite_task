import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        message.error("Invalid verification link.");
        return navigate("/login");
      }

      try {
        const response = await axios.get(`http://localhost:8000/auth/verify-email?token=${token}`);
        message.success(response.data.message);
        navigate("/login");
      } catch (error) {
        message.error("Verification failed or expired.");
        navigate("/register");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {loading ? <Spin size="large" /> : <p>Email verification complete. Redirecting...</p>}
    </div>
  );
};

export default VerifyEmail;
