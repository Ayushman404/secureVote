import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUserCircle, FaDownload } from "react-icons/fa";
import { useEffect } from "react";
import LogoutButton from "./Logout";
import { getPrivateKey } from "../utils/idb";

export default function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const { userInfo, setUserInfo, publicKey, setPublicKey } =
    useContext(UserContext);

  useEffect(() => {
    async function checkKey() {
      const getKey = await getPrivateKey();
      !getKey ? setHasKey(false) : setHasKey(true);
    }
    checkKey();
  }, []);

  const handleDownloadKey = () => {
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) return toast.error("No private key found.");
    const blob = new Blob([privateKey], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my-private-key.txt";
    link.click();
  };

  const handleToggleOpen = () => {
    // Fetch user info when dropdown is opened

    if (!open && !userInfo.name) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          email: localStorage.getItem("email"),
        })
        .then((res) => {
          const { name, email, picture, publicKey } = res.data;
          setUserInfo({ name, email, picture });
          setPublicKey(publicKey);
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          toast.error("Failed to fetch user info. Please try again.");
        });
    }
    setOpen(!open);
  };

  return (
    hasKey && (
      <div className="relative z-50">
        {/* Profile Icon Button */}
        <button
          onClick={handleToggleOpen}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white text-xl rounded-full shadow-md hover:scale-105 hover:bg-blue-700 cursor-pointer transition-all duration-200"
        >
          <img
            className="rounded-full"
            src={userInfo?.picture ? userInfo.picture : <FaUserCircle />}
            alt=""
          />
        </button>

        {/* Dropdown Panel */}
        {open && (
          <div className="absolute right-0 mt-3 w-80 bg-white backdrop-blur-lg bg-opacity-90 rounded-2xl shadow-2xl border border-blue-200 p-5 animate-slide-fade">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaUserCircle className="text-blue-600" />
              User Profile
            </h3>

            <div className="text-sm text-gray-800 mb-3">
              <span className="font-medium">👤 Name:</span>{" "}
              {userInfo?.name || "Anonymous"}
            </div>

            <div className="text-sm text-gray-800 mb-3">
              <span className="font-medium">📧 Email:</span>{" "}
              {userInfo?.email || "Unknown"}
            </div>

            <div className="text-sm text-gray-800 mb-4 break-words">
              <span className="font-medium">🔑 Public Key:</span>
              <p className="text-blue-700 mt-1 break-all text-xs">
                {publicKey || "No Key found"}
              </p>
            </div>

            <button
              onClick={handleDownloadKey}
              className="w-full flex items-center justify-center cursor-pointer gap-2 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] shadow"
            >
              <FaDownload /> Download Private Key
            </button>

            <LogoutButton />
          </div>
        )}

        {/* Animation styles */}
        <style>
          {`
          @keyframes slideFadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-fade {
            animation: slideFadeIn 0.25s ease-out forwards;
          }
        `}
        </style>
      </div>
    )
  );
}
