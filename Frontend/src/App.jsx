import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./router/Routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
};

export default App;
