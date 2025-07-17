import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Eye,
  Download,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart,
  LogOut,
  UploadCloud,
} from "lucide-react";

const getChartIcon = () => {
  const types = [
    <BarChart2 size={26} className="text-blue-600" />,
    <PieChart size={26} className="text-purple-600" />,
    <LineChartIcon size={26} className="text-green-600" />,
  ];
  return types[Math.floor(Math.random() * types.length)];
};

const DashboardHome = () => {
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get("/auth/validate-token");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth");
    }
  }, [navigate]);

  const fetchUploads = useCallback(async () => {
    try {
      const res = await API.get("/uploads/view");
      setUploads(res.data.uploads || []);
    } catch (err) {
      toast.error("Failed to load uploads");
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await fetchUser();
      await fetchUploads();
      setLoading(false);
    };

    initializeDashboard();
  }, [fetchUser, fetchUploads]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
      navigate("/auth");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome, {user?.firstName || "User"} 👋
            </h2>
            <p className="text-sm text-gray-500 mt-1">Here's your recent uploads</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-600 animate-pulse py-10">
            Loading uploads...
          </div>
        )}

        {!loading && uploads.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <p className="mb-4">No files uploaded yet.</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition shadow-md"
            >
              <UploadCloud size={20} /> Upload your first file
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((upload, index) => (
            <div
              key={upload._id}
              className="bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between border border-gray-100 transform transition duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold truncate w-[75%]">
                  {upload.fileName}
                </h3>
                {getChartIcon()}
              </div>

              <p className="text-sm text-gray-500 mb-2">
                Uploaded: {new Date(upload.createdAt).toLocaleString()}
              </p>

              <span
                className={`inline-block self-start px-3 py-1 text-xs rounded-full font-semibold mb-3 capitalize ${
                  upload.status === "parsed"
                    ? "bg-green-100 text-green-700"
                    : upload.status === "error"
                    ? "bg-red-100 text-red-700"
                    : upload.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {upload.status || "parsed"}
              </span>

              {upload.insights && (
                <div className="text-sm text-gray-800 space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-medium">
                      📊 Total Columns:
                    </span>
                    <span className="font-semibold">
                      {upload.insights.totalColumns?.toLocaleString() ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">🧾 Rows:</span>
                    <span className="font-semibold">
                      {upload.insights.totalRows ?? "N/A"}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-auto flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/view/${upload._id}`}
                  className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white text-base rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  <Eye size={18} /> View
                </Link>
                <a
                  href={`${API.defaults.baseURL}/uploads/download/excel/${upload._id}`}
                  className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 text-base rounded-lg hover:bg-gray-300 transition shadow-md"
                  download
                >
                  <Download size={18} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;