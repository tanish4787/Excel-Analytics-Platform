import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardHome from "../pages/DashboardHome";
import UploadPage from "../pages/UploadPage";
import ViewUpload from "../pages/ViewUpload";
import AdminPanel from "../pages/AdminPanel";
import ProtectedRoute from "../components/ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
              <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
              <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view/:id"
        element={
          <ProtectedRoute>
              <ViewUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
              <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
