import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

const ProtectedRoute = ({ children, adminOnly }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get("/user/history");

        if (response.data?.success) {
          setIsAuthenticated(true);
          const user = JSON.parse(localStorage.getItem("user"));
          if (user?.role === "admin") setIsAdminUser(true);
        } else {
          throw new Error("Unauthorized");
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdminUser) return <Navigate to="/" replace />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
