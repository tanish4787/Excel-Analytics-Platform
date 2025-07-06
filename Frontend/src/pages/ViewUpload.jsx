import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { Download, BarChart3 } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ViewUpload = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/uploads/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setRecord(res.data.record);
        }
      } catch (error) {
        toast.error("Failed to load upload");
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDownload = async (type) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/uploads/download/${type}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data.${type === "excel" ? "xlsx" : "json"}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading...
      </div>
    );

  if (!record)
    return <div className="p-6 text-center text-red-500">No record found</div>;

  const { fileName, createdAt, data, insights } = record;
  const headers = Object.keys(data[0] || {});
  const numeric = headers.filter((h) => typeof data[0][h] === "number");
  const text = headers.filter((h) => typeof data[0][h] === "string");

  const chartData = {
    labels: data.map((row) => row[xAxis]),
    datasets: [
      {
        label: `${yAxis} vs ${xAxis}`,
        data: data.map((row) => row[yAxis]),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  const ChartComponent =
    chartType === "line" ? Line : chartType === "pie" ? Pie : Bar;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{fileName}</h1>
          <p className="text-sm text-gray-500">
            Uploaded: {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload("excel")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Download size={16} /> Excel
          </button>
          <button
            onClick={() => handleDownload("json")}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            <Download size={16} /> JSON
          </button>
        </div>
      </div>

      {insights && (
        <div className="bg-white border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 shadow">
          {Object.entries(insights).map(([key, value]) => (
            <div key={key}>
              <p className="text-sm text-gray-500 capitalize">{key}</p>
              <p className="text-md font-semibold text-gray-700 break-all">
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.length > 0 && (
        <div className="max-h-[70vh] overflow-auto border rounded-lg bg-white shadow">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {headers.map((key) => (
                  <th key={key} className="px-4 py-2 text-left font-semibold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {headers.map((key) => (
                    <td key={key} className="px-4 py-2 whitespace-nowrap">
                      {typeof row[key] === "object"
                        ? JSON.stringify(row[key])
                        : String(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Visualize Your Data
        </h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Select X Axis</option>
            {text.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Select Y Axis</option>
            {numeric.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        {xAxis && yAxis ? (
          <div className="bg-slate-50 p-4 rounded-md">
            <ChartComponent data={chartData} options={{ responsive: true }} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Select both axes to display chart
          </p>
        )}
      </div>

      <div className="text-center text-gray-400 mt-10">
        <BarChart3 className="mx-auto mb-2" size={40} />
        <p>More visualizations coming soon...</p>
      </div>
    </div>
  );
};

export default ViewUpload;
