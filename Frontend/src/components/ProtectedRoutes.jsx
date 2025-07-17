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
      let authStatus = false;
      let adminStatus = false;

      try {
        const response = await API.get("/api/user/history");

        if (response.data && response.data.success) {
          authStatus = true;
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            adminStatus = user.role === "admin";
          } else {
            
            toast.error("User data missing. Please log in again.");
            localStorage.removeItem("user");
            localStorage.removeItem("token"); 
          }
        } else {
          toast.error(
            response.data?.message || "Session invalid. Please log in again."
          );
          localStorage.removeItem("user");
          localStorage.removeItem("token"); 
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Session expired or invalid. Please log in again."
        );
        localStorage.removeItem("user");
        localStorage.removeItem("token"); 
      } finally {
        setIsAuthenticated(authStatus);
        setIsAdminUser(adminStatus);
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

  if (!isAuthenticated) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdminUser) {
    toast.error("You do not have administrative access to this page.");
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
