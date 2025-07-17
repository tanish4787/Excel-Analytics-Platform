import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Download, X } from "lucide-react";
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
  Filler,
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
  Legend,
  Filler
);

const ViewUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/uploads/view/${id}`);
      if (!data?.success) throw new Error(data?.message || "Failed to load");

      setRecord(data.record);

      const first = data.record.data?.[0] ?? {};
      const keys = Object.keys(first);
      setXAxis(keys.find((k) => typeof first[k] === "string") || keys[0]);
      setYAxis(keys.find((k) => typeof first[k] === "number") || "");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
      if (err.response?.status === 404) navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchData();
    else navigate("/dashboard");
  }, [id, fetchData, navigate]);

  const handleDownload = async (type) => {
    try {
      toast.loading("Preparing your download...", { id: "downloadToast" });
      const res = await API.get(`/uploads/download/${type}/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `${record.fileName.replace(/\.[^/.]+$/, "")}.${
          type === "excel" ? "xlsx" : "json"
        }`,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully!", { id: "downloadToast" });
    } catch {
      toast.error("Failed to download file.", { id: "downloadToast" });
    }
  };

  const { rows, headers, numericH, textH } = useMemo(() => {
    const r = record?.data?.filter(Boolean) ?? [];
    const first = r[0] ?? {};
    const keys = Object.keys(first);
    return {
      rows: r,
      headers: keys,
      numericH: keys.filter((k) => typeof first[k] === "number"),
      textH: keys.filter((k) => typeof first[k] === "string"),
    };
  }, [record]);

  const chartConfig = useMemo(() => {
    if (!rows.length || !xAxis || (chartType !== "pie" && !yAxis)) return null;

    let filtered = rows;
    if (filterColumn && filterValue) {
      filtered = filtered.filter(
        (r) =>
          String(r[filterColumn]).toLowerCase() === filterValue.toLowerCase()
      );
    }

    const valid = filtered.filter((r) =>
      chartType === "pie"
        ? r[xAxis] != null
        : r[xAxis] != null && !isNaN(r[yAxis])
    );
    if (!valid.length) return null;

    const baseOpts = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { intersect: false },
        title: {
          display: true,
          text:
            chartType === "pie"
              ? `Distribution by ${xAxis}`
              : `${yAxis} vs ${xAxis}`,
        },
      },
    };

    if (chartType === "pie") {
      const counts = {};
      valid.forEach((r) => {
        counts[r[xAxis]] = (counts[r[xAxis]] || 0) + 1;
      });
      return {
        Chart: Pie,
        data: {
          labels: Object.keys(counts),
          datasets: [
            {
              data: Object.values(counts),
              backgroundColor: Object.keys(counts).map(
                (_, i) => `hsl(${i * 50},70%,60%)`
              ),
              hoverOffset: 8,
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        },
        options: baseOpts,
      };
    }

    const isLine = chartType === "line";
    return {
      Chart: isLine ? Line : Bar,
      data: {
        labels: valid.map((r) => String(r[xAxis])),
        datasets: [
          {
            label: yAxis,
            data: valid.map((r) => Number(r[yAxis])),
            backgroundColor: isLine ? "rgba(0,0,0,0)" : "rgba(59,130,246,0.6)",
            borderColor: "#3b82f6",
            borderWidth: isLine ? 2 : 1,
            pointRadius: isLine ? 3 : 0,
            tension: isLine ? 0.4 : 0,
            fill: !isLine,
          },
        ],
      },
      options: {
        ...baseOpts,
        scales: {
          x: {
            ticks: { autoSkip: true, maxRotation: 45 },
            title: { display: true, text: xAxis },
          },
          y: { title: { display: true, text: yAxis }, beginAtZero: true },
        },
      },
    };
  }, [rows, xAxis, yAxis, chartType, filterColumn, filterValue]);

  if (loading) return <Splash text="Loading data..." />;
  if (error) return <Splash text={error} error />;
  if (!rows.length) return <Splash text="No data found in this file." />;

  const { Chart, data: chartData, options: chartOptions } = chartConfig ?? {};

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold break-all text-gray-800">
              {record.fileName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Uploaded: {new Date(record.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleDownload("excel")}>
              <Download size={16} /> Excel
            </Button>
            <Button secondary onClick={() => handleDownload("json")}>
              <Download size={16} /> JSON
            </Button>
          </div>
        </header>

        {record.insights && (
          <section className="grid gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <h2 className="col-span-full text-lg font-semibold text-gray-800">
              Insights
            </h2>
            {Object.entries(record.insights).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="text-xs text-gray-500 capitalize">
                  {k.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-sm font-semibold text-gray-700 break-all">
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </p>
              </div>
            ))}
          </section>
        )}

        <div className="overflow-auto max-h-[60vh] bg-white rounded-2xl border border-gray-100 shadow-lg">
          <table className="min-w-full text-xs sm:text-sm table-auto">
            <thead className="sticky top-0 bg-gray-100 border-b border-gray-200">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-2 whitespace-nowrap">
                      {r[h] == null
                        ? "N/A"
                        : typeof r[h] === "object"
                        ? JSON.stringify(r[h])
                        : String(r[h])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="space-y-4 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Visualize</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Chart Type"
              value={chartType}
              onChange={setChartType}
              options={[
                { v: "bar", l: "Bar" },
                { v: "line", l: "Line" },
                { v: "pie", l: "Pie" },
              ]}
            />
            <Select
              label="X‑Axis"
              value={xAxis}
              onChange={setXAxis}
              options={[...textH, ...numericH]}
            />
            {chartType !== "pie" && (
              <Select
                label="Y‑Axis"
                value={yAxis}
                onChange={setYAxis}
                options={numericH}
              />
            )}
            <div className="flex flex-col gap-2">
              <Select
                label="Filter Column"
                allowEmpty
                value={filterColumn}
                onChange={(v) => {
                  setFilterColumn(v);
                  setFilterValue("");
                }}
                options={headers}
              />
              {filterColumn && (
                <div className="relative">
                  <input
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    placeholder="Filter value"
                  />
                  {filterValue && (
                    <button
                      onClick={() => setFilterValue("")}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {Chart ? (
            <div className="h-64 sm:h-80 md:h-96">
              <Chart data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 py-4">
              Select valid axes to render chart.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

const Splash = ({ text, error }) => (
  <div className="flex flex-1 items-center justify-center p-4">
    <p
      className={`rounded-lg p-4 shadow text-center text-sm ${
        error ? "bg-white text-red-500" : "text-gray-600 animate-pulse"
      }`}
    >
      {text}
    </p>
  </div>
);

const Button = ({ children, onClick, secondary }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition hover:shadow-lg
      ${
        secondary
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
  >
    {children}
  </button>
);

const Select = ({ label, value, onChange, options, allowEmpty }) => (
  <div>
    <label className="mb-1 block text-xs font-medium text-gray-700">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
    >
      {allowEmpty && <option value="">None</option>}
      {options.map((o) => (
        <option key={o.v || o} value={o.v || o}>
          {o.l || o}
        </option>
      ))}
    </select>
  </div>
);

export default ViewUpload;