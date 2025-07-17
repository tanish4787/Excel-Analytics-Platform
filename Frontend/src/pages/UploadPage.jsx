import React, { useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CloudUpload } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [summary, setSummary] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.endsWith(".xlsx")) {
      toast.error("Only .xlsx files allowed.");
      setFile(null);
      return;
    }
    setFile(selected);
    setSummary(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.name.endsWith(".xlsx")) {
      toast.error("Only .xlsx files allowed.");
      setFile(null);
      return;
    }
    setFile(dropped);
    setSummary(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await API.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <CloudUpload className="mx-auto text-blue-600 mb-2" size={40} />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Upload Excel File
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop or browse to upload .xlsx file
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="space-y-4"
        >
          <div
            className={`border-2 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-dashed border-gray-300"
            } p-8 rounded-lg text-center transition-all cursor-pointer`}
            onClick={() => inputRef.current.click()}
          >
            <p className="text-gray-600 mb-2 font-medium">
              {file ? `Selected: ${file.name}` : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-gray-400">or click to browse</p>
            <input
              type="file"
              ref={inputRef}
              accept=".xlsx"
              onChange={handleFileChange}
              hidden
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className={`w-full py-3 rounded-lg text-white font-medium transition shadow-md hover:shadow-lg ${
              uploading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </form>

        {summary && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-5 rounded-lg animate-fade-in shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              📊 Upload Summary
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex justify-between items-center">
                <span className="font-medium">✅ Rows:</span>
                <span className="font-semibold">{summary.rows}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-medium">💰 Total Sales:</span>
                <span className="font-semibold">₹{summary.totalSales}</span>
              </p>
            </div>
            <button
              onClick={() => navigate(`/view/${summary.uploadId}`)}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
            >
              View Data & Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
