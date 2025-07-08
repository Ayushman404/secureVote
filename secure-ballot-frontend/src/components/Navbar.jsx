import React from "react";
import { FaVoteYea, FaClock, FaHome, FaUsers, FaUserPlus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Navbar() {
  const location = useLocation();
  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Vote", path: "/vote", icon: <FaVoteYea /> },
    { name: "Voters", path: "/voters", icon: <FaUsers /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-300 via-white to-emerald-100 backdrop-blur-md shadow-xl border-b border-indigo-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    {/* Logo */}
    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-400 bg-clip-text text-transparent tracking-tight drop-shadow-md">
      secureVote
    </h1>

    {/* Navigation Items */}
    <div className="flex items-center gap-4">
      <ul className="flex gap-2 md:gap-4 items-center">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center justify-center gap-2 px-3 md:px-5 py-2 rounded-full text-sm md:text-md font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-300 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                  : "bg-white text-blue-700 hover:bg-blue-100"
              }`}
            >
              {/* Icon always visible */}
              {item.icon}
              {/* Name only visible on medium and up */}
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Profile Dropdown */}
      <UserProfileDropdown />
    </div>
  </div>
</nav>
  );
}
