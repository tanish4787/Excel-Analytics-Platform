import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FiBarChart, FiFilePlus, FiZap, FiMenu, FiX
} from 'react-icons/fi';

const navLinks = [
  { to: '/dashboard', icon: <FiBarChart size={18} />, label: 'Dashboard' },
  { to: '/dashboard/uploads', icon: <FiFilePlus size={18} />, label: 'Uploads' },
  { to: '/dashboard/insights', icon: <FiZap size={18} />, label: 'Insights' },
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <nav className="space-y-2 p-4">
      {navLinks.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition-all 
            ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white' 
                       : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`
          }
          onClick={() => setMobileOpen(false)}
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="h-16 flex items-center px-4 text-xl font-bold text-blue-600 dark:text-white">
          ExcelAnalytics
        </div>
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-64 bg-white dark:bg-gray-800 shadow-md h-full">
          <div className="h-16 flex items-center justify-between px-4">
            <span className="text-xl font-bold text-blue-600 dark:text-white">ExcelAnalytics</span>
            <button onClick={() => setMobileOpen(false)}>
              <FiX className="text-gray-600 dark:text-white" />
            </button>
          </div>
          {SidebarContent}
        </div>
        <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)}></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden md:block">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search analytics..."
              className="px-3 py-1.5 rounded-md border dark:border-gray-600 text-sm w-64 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
