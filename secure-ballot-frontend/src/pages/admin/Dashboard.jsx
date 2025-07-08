import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCogs, FaClipboardList, FaVoteYea } from "react-icons/fa";

export default function AdminDashboard() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const token = localStorage.getItem("adminToken");
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600">
          You must be logged in as an admin to access this page.
        </h2>
      </div>
    );
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setRegistrationOpen(res.data.isRegistrationOpen);
        setVotingOpen(res.data.isVotingOpen);
      })
      .catch((err) => {
        console.error("Error fetching status:", err);
        setStatusMsg("Failed to load status");
      });
  }, []);

  const handleToggle = async (type) => {
    try {
      await axios.post(
        `http://localhost:3000/api/admin/toggle-${type}`,
        { status: type === "voting" ? votingOpen : registrationOpen },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (type === "registration") {
        const newStatus = !registrationOpen;
        setRegistrationOpen(newStatus);
        setStatusMsg(`Registration ${newStatus ? "opened" : "closed"}`);
      } else {
        const newStatus = !votingOpen;
        setVotingOpen(newStatus);
        setStatusMsg(`Voting ${newStatus ? "opened" : "closed"}`);
      }

      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error("Error toggling:", err);
      setStatusMsg("Failed to toggle " + type);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 py-12 px-4 relative overflow-hidden flex flex-col items-center animate-fade-in">
      {/* Glowing background shapes */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-indigo-300 opacity-20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-emerald-300 opacity-20 rounded-full blur-3xl -z-10" />

      <h1 className="text-4xl font-extrabold text-center text-indigo-800 drop-shadow mb-2 tracking-tight flex items-center gap-2">
        <FaCogs className="text-indigo-700" /> Admin Dashboard
      </h1>
      <p className="text-center text-sm sm:text-base text-gray-600 mb-8 italic">
        Effortlessly manage your election phases with full control
      </p>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md border border-indigo-100 shadow-2xl rounded-3xl p-8 space-y-10">
        {/* Registration Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-indigo-600" /> Registration
            </h2>
            <p className="text-sm text-gray-500">
              {registrationOpen ? "Currently Open" : "Currently Closed"}
            </p>
          </div>
          <button
            onClick={() => handleToggle("registration")}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              registrationOpen
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                : "bg-green-500 hover:bg-green-600 focus:ring-green-400"
            }`}
          >
            {registrationOpen ? "Close" : "Open"}
          </button>
        </div>

        {/* Voting Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaVoteYea className="text-indigo-600" /> Voting
            </h2>
            <p className="text-sm text-gray-500">
              {votingOpen ? "Currently Open" : "Currently Closed"}
            </p>
          </div>
          <button
            onClick={() => handleToggle("voting")}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              votingOpen
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                : "bg-green-500 hover:bg-green-600 focus:ring-green-400"
            }`}
          >
            {votingOpen ? "Close" : "Open"}
          </button>
        </div>
      </div>

      {/* View Results Button */}
      <div className="mt-10">
        <button
          onClick={() => (window.location.href = "/admin/results")}
          disabled={!(!votingOpen && !registrationOpen)}
          className={`px-7 py-3 rounded-full font-bold transition-all duration-300 ease-in-out transform shadow-lg ${
            !votingOpen && !registrationOpen
              ? "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {!votingOpen && !registrationOpen ? "View Results" : "View Results (Locked)"}
        </button>
      </div>

      {statusMsg && (
        <div className="mt-6 text-indigo-700 font-medium animate-pulse">
          {statusMsg}
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
