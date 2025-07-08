import React from "react";
import VotePage from "./pages/VotePage";
import RegisterPage from "./pages/RegisterPage";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Voters from "./pages/Voters";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Navbar from "./components/Navbar";
import ResultsPage from "./pages/admin/ResultsPage";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/voters" element={<Voters />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/results" element={<ResultsPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
