import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login"; 
import Register from "../pages/Register"; 

import DashboardHome from "../pages/DashboardHome";
import UploadPage from "../pages/UploadPage";
import ViewUpload from "../pages/ViewUpload";
import AdminPanel from "../pages/AdminPanel";

import ProtectedRoutes from "../components/ProtectedRoutes";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} /> 

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/view/:id" element={<ViewUpload />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoutes adminOnly>
              <AdminPanel />
            </ProtectedRoutes>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;