/*
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;

 */
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/validate-token");
        console.log("✅ Auth response:", res.data);

        if (adminOnly && res.data.user.role !== "admin") {
          console.log("⛔ Not an admin");
          setAllowed(false);
        } else {
          setAllowed(true);
        }
      } catch (err) {
        console.log(
          "❌ Auth validation error:",
          err.response?.data || err.message
        );
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [adminOnly]);

  if (loading) return <div className="text-center py-20">Checking auth...</div>;
  return allowed ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
