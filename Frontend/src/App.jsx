import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar"; 
import Sidebar from "./components/Sidebar"; 

import Home from "./pages/Home";
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import UploadPage from "./pages/UploadPage";
import ViewUpload from "./pages/ViewUpload";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar toggleSidebar={toggleSidebar} isAuthenticated={isAuthenticated} /> 
        
        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <main className="flex-1 overflow-auto"> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/view/:id" element={<ViewUpload />} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;