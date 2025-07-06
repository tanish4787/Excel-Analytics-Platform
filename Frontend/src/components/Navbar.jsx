import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/login" && localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const linkClasses = (path) =>
    `hover:text-blue-400 transition ${
      location.pathname === path ? "underline font-semibold" : ""
    }`;

  return (
    <nav
      className="bg-gradient-to-r from-blue-700
      to-indigo-700
     text-white px-6 py-3 flex items-center justify-between shadow-md animate-fade-in"
    >
      <div className="flex items-center gap-4">
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          Excel Analytics
        </Link>
      </div>
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex items-center space-x-4 text-sm animate-slide-in`}
      >
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={linkClasses("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/upload" className={linkClasses("/upload")}>
              Uploads
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClasses("/login")}>
              Login
            </Link>
            <Link to="/register" className={linkClasses("/register")}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
