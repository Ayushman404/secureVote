import React from "react";
import VotePage from "./pages/VotePage";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Voters from "./pages/Voters";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Navbar from "./components/Navbar";
import ResultsPage from "./pages/admin/ResultsPage";
import Home from "./pages/Home";
import GoogleLoginBtn from "./components/GoogleLoginBtn";
import ProtectedRoute from "./utils/ProtectedRoute";


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<ProtectedRoute><VotePage /></ProtectedRoute>} />
        <Route path="/voters" element={<Voters />} />
        <Route path="/admin/login" element={<Login />} />

        <Route path="/googlelogin" element={<GoogleLoginBtn />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/results" element={<ResultsPage />} />
        <Route path="*" element={<div className="flex justify-center items-center min-h-screen text-2xl text-gray-600">404 - Page Not Found</div>} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        draggable
      />
    </div>
  );
};

export default App;
