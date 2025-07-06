import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { Eye, Download, BarChart2, LineChart, PieChart } from "lucide-react";
import toast from "react-hot-toast";

const getChartIcon = () => {
  const types = [
    <BarChart2 size={26} className="text-blue-600" />,
    <PieChart size={26} className="text-purple-600" />,
    <LineChart size={26} className="text-green-600" />,
  ];
  return types[Math.floor(Math.random() * types.length)];
};

const DashboardHome = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    try {
      const res = await API.get("/uploads/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUploads(res.data.uploads || []);
    } catch (err) {
      toast.error("Failed to load uploads");
      console.error("Error fetching uploads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading uploads...
      </div>
    );

  if (uploads.length === 0)
    return (
      <div className="p-6 text-center text-gray-600">
        No files uploaded yet. Go to Upload tab to get started.
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h3 className="text-base font-semibold truncate w-[75%]">
              {upload.fileName}
            </h3>
            {getChartIcon()}
          </div>

          <p className="text-sm text-gray-500 mb-2">
            Uploaded: {new Date(upload.createdAt).toLocaleString()}
          </p>

          <span
            className={`inline-block self-start px-2 py-1 text-xs rounded-full font-semibold mb-2 capitalize ${
              upload.status === "parsed"
                ? "bg-green-100 text-green-700"
                : upload.status === "error"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
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

          <div className="mt-auto flex gap-2">
            <Link
              to={`/view/${upload._id}`}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
            >
              <Eye size={16} /> View
            </Link>
            <a
              href={`http://localhost:8000/api/uploads/${upload._id}/download/excel`}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-200 text-sm rounded-md hover:bg-gray-300 transition"
              download
            >
              <Download size={16} /> Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHome;
