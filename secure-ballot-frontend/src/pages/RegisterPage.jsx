import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateKeyPair } from "../utils/genKeyPair";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUserTimes } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";

const Register = () => {
  const navigate = useNavigate();
  const { setPublicKey, setPrivateKey, setUserInfo } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [registrationOpen, setRegistrationOpen] = useState(false);

  // Check if registration is open
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/status`)
      .then((res) => {
        const { isRegistrationOpen } = res.data;
        setRegistrationOpen(isRegistrationOpen);
      })
      .catch((err) => {
        console.error("Phase status error", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const navigateToVotePage = () => {
    console.log(formData);
    navigate("/vote");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Checking if the user already exists
    const existing = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check`, {
      email: formData.email,
    });

    if (existing.data.alreadyRegistered) {
      toast.warning("Already registered. Using existing key.");
      return navigateToVotePage();
    }

    const { privateKey, publicKey } = generateKeyPair();
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    setFormData((prev) => ({ ...prev }));
    setUserInfo({ name: formData.name, email: formData.email });

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        publicKey: publicKey,
      })
      .then((response) => {
        toast.success(response.data.message || "Registration successful:");
        localStorage.setItem("voterToken", response.data.token);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        toast.error("Registration Error ", error);
      });

    console.log("privateKey:", privateKey);
    console.log("publicKey:", publicKey);
    navigateToVotePage();
  };

  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 flex items-center justify-center px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center border-l-4 border-yellow-400 animate-fade-in-up">
          <div className="flex flex-col items-center space-y-5">
            <div className="text-yellow-500 text-5xl animate-pulse">
              <FaUserTimes />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 drop-shadow-sm">
              Registration Closed
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Voter registration is not available at the moment. Please check
              back once the registration window opens again.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <AiOutlineHome className="text-xl" /> Back to Home
            </a>
          </div>
        </div>

        <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 animate-fade-in-up">
        <div className="flex justify-center text-indigo-500 text-4xl mb-4">
          <FaUserPlus />
        </div>
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-2 drop-shadow">
          Create Your Voting Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Register once and cast your vote securely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition duration-300 transform hover:scale-[1.02]"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/vote")}
          >
            Go to Vote Page
          </span>
        </p>
      </div>

      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
