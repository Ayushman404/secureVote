import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { generateKeyPair } from "../utils/genKeyPair"; // Assuming you have a utility to generate key pairs
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { AiOutlineHome } from "react-icons/ai";
import { FaUserTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { savePrivateKey } from "../utils/idb";

const GoogleLoginBtn = () => {
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

  const { setPublicKey, setUserInfo } = useContext(UserContext);

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        token,
      });

      const user = res.data.user;

      if (!user.publicKey) {
        // ✨ KeyPair should be generated RIGHT HERE
        const { publicKey, privateKey } = generateKeyPair();

        // 🔐 Store privateKey safely in browser
        await savePrivateKey(privateKey);
        localStorage.setItem("email", user.email);
        localStorage.setItem('keyCreatedAt', Date.now());

        // 📡 Send publicKey to backend
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/setPublicKey`, {
          email: user.email,
          publicKey,
        });

        setPublicKey(publicKey);
        setUserInfo({
          name: user.name,
          email: user.email,
          picture: user.picture || "/avatar.jpg",
        });

        console.log("✅ Key pair generated and synced.");
        toast.success("User Registered For Voting");
      }

      // ✅ Either way, navigate to vote
      window.location.href = '/vote';
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      toast.error("Login Failed. Please try again.");
    }
  };

  //if registration is closed, show a message
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-emerald-100 p-6">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl border border-indigo-200 rounded-3xl px-10 py-14 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-3 drop-shadow-lg">
          Welcome to SecureVote
        </h1>
        <p className="text-gray-700 text-sm mb-8 tracking-wide">
          Login securely with your Google account to get started
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
            size="large"
            theme="outline"
          />
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Your identity is protected — we never store passwords or personal
          info.
        </p>
      </div>
    </div>
  );
};

export default GoogleLoginBtn;
