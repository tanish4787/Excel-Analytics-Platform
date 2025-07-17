import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  UploadCloud,
  Home,
  LogIn,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    console.log(isAuthenticated);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navItemClass = (
    path
  ) => `block px-4 py-2 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors
    ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-white md:text-gray-200"
    }`;

  const mobileNavItemClass = (
    path
  ) => `block w-full text-left px-4 py-2 rounded hover:bg-blue-700 hover:text-white transition-colors
    ${
      location.pathname === path
        ? "bg-blue-700 text-white font-semibold"
        : "text-gray-200"
    }`;

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white px-4 py-3 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-white hover:text-gray-200 transition"
        >
          Excel Analytics
        </Link>

        <div className="md:hidden flex items-center">
          {isAuthenticated ? (
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar menu"
              className="p-1 rounded-md hover:bg-blue-700 transition"
            >
              <Menu size={24} className="text-white" />
            </button>
          ) : (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-1 rounded-md hover:bg-blue-700 transition"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={navItemClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/upload" className={navItemClass("/upload")}>
                Upload
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-white bg-red-600 hover:bg-red-700 transition shadow-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={navItemClass("/")}>
                Home
              </Link>
              <Link to="/login" className={navItemClass("/login")}>
                Login
              </Link>
              <Link to="/register" className={navItemClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {!isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-blue-800 border-t border-blue-700 shadow-lg py-2 px-4 space-y-1 animate-fade-down">
          <Link
            to="/"
            className={mobileNavItemClass("/")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={mobileNavItemClass("/login")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={mobileNavItemClass("/register")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;