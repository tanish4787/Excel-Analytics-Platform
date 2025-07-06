import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, UploadCloud, ViewIcon , LogOut, BarChart3 } from "lucide-react";

const Sidebar = () => {
  const navLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/upload",
      label: "Upload File",
      icon: <UploadCloud size={20} />,
    },
    {
      path: "/view",
      label: "View Files",
      icon: <ViewIcon size={20} />,
    },
  ];

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="h-screen w-64 bg-white border-r shadow-lg hidden md:flex flex-col px-6 py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-xl font-bold text-blue-700">
        <BarChart3 size={24} />
        <span>Excel Analytics</span>
      </div>

      <nav className="flex flex-col gap-2">
        {navLinks.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t pt-6">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
