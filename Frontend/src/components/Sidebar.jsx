import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; 
import {
  LayoutDashboard,
  UploadCloud,
  LogOut,
  Home,
  LogIn,
  UserPlus,
  X,
  Menu, 
} from "lucide-react";
import { toast } from "react-hot-toast";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const authenticatedNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Upload Data", icon: UploadCloud, path: "/upload" },
  ];


  const currentNavItems = authenticatedNavItems;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? "opacity-100 block" : "opacity-0 hidden"
        } lg:hidden`} 
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } 
        w-64 bg-gray-800 text-white p-5 flex flex-col transition-transform duration-300 ease-in-out
        z-40 shadow-lg lg:hidden`} 
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-blue-400">Excel Analytics</h2>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none p-1 rounded-md hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {isAuthenticated && currentNavItems.map((item) => ( 
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }
                group`
              }
              onClick={toggleSidebar} 
            >
              <item.icon
                size={20}
                className="mr-3 text-blue-300 group-hover:text-white"
              />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                toggleSidebar(); 
              }}
              className="flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 hover:bg-red-600 text-gray-300 group"
            >
              <LogOut
                size={20}
                className="mr-3 text-red-300 group-hover:text-white"
              />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;