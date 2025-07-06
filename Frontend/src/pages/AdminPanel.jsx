import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2, ShieldCheck } from "lucide-react";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, uploadsRes] = await Promise.all([
        API.get("/admin/users", config),
        API.get("/admin/uploads", config),
      ]);

      setUsers(usersRes.data.users || []);
      setUploads(uploadsRes.data.uploads || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
      console.log(err);
      
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      await API.delete(`/admin/uploads/${uploadId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUploads((prev) => prev.filter((f) => f._id !== uploadId));
    } catch (err) {
      alert("Failed to delete file.");
      console.log(err);
      
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
        <ShieldCheck size={28} /> Admin Panel
      </h1>

      {/* USERS TABLE */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">👥 Manage Users</h2>
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* FILES TABLE */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          📁 Uploaded Files
        </h2>
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-indigo-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Filename</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{u.fileName}</td>
                  <td className="px-4 py-2">{u.user?.email || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUpload(u._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Upload"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {uploads.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No uploads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
