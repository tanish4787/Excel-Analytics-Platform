import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CloudUpload } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await API.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSummary(res.data.summary);
      toast.success("File uploaded and analyzed!");
      setFile(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-20 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg transition duration-500">
        <div className="text-center mb-6">
          <CloudUpload className="mx-auto text-blue-600" size={36} />
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Upload Excel File
          </h2>
          <p className="text-sm text-gray-500">
            Only .xlsx files are supported
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 file:bg-blue-50 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded file:text-blue-700"
          />

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 rounded-md text-white font-medium transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </form>

        {summary && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-md animate-fade-in">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              📊 Upload Summary
            </h3>
            <p className="text-gray-600">✅ Rows: {summary.rows}</p>
            <p className="text-gray-600">
              📈 Total Sales: ₹{summary.totalSales}
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
