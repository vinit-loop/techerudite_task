// src/routes/AppRoutes.js
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import AdminLogin from "../pages/Admin-login";
import Login from "../pages/Login";
import Register from "../pages/Register";
import WelcomePage from "../pages/Welcome";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../components/NotFound";
import VerifyEmail from "../pages/VerifyEmail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/login"
        element={
          <ErrorBoundary fallback={<h3>Failed to load Login Page.</h3>}>
            <Login />
          </ErrorBoundary>
        }
      />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-login"
        element={
          <ErrorBoundary fallback={<h3>Failed to load Login Page.</h3>}>
            <AdminLogin />
          </ErrorBoundary>
        }
      />

      <Route
        path="/register"
        element={
          <ErrorBoundary fallback={<h3>Failed to load Register Page.</h3>}>
            <Register />
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
