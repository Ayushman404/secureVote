import React, { useEffect, useState } from "react";
import { FaShieldAlt, FaLock, FaUsers, FaChartBar, FaKey, FaCogs } from "react-icons/fa";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import { useNavigate } from "react-router-dom";
import { getPrivateKey } from "../utils/idb";

export default function LandingPage() {

    const [hasKey, setHasKey] = useState(false);

    const navigate = useNavigate();
    useEffect(()=>{
      async function checkKey() {
        const getKey = await getPrivateKey();
        !getKey ? setHasKey(false) : setHasKey(true);
      }
      checkKey();
    },[])
    const handleGetStarted = () => {
        if (hasKey) {
            navigate('/vote');
        } else {
            navigate('/googlelogin');
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-20 py-16">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold text-blue-900 leading-tight mb-6 drop-shadow-lg animate-fade-in-up transition-transform hover:scale-[1.02] duration-300">
            Secure. Anonymous. Decentralized.
          </h1>
          <p className="text-lg text-gray-700 mb-8 animate-fade-in-up delay-100">
            Experience next-gen <span className="text-shadow-md font-semibold bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent">Linkable Ring Signature(LRS)</span>-based e-voting with complete privacy, fairness, and cryptographic linkability.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md cursor-pointer transition duration-300 transform hover:scale-105 animate-fade-in-up delay-200"
          >
            {hasKey ? "Vote Now" : "Register with Google"}
          </button>
          {hasKey && <p className="text-md text-green-500">You are already registered go to vote if not Voted Yet</p>}
        </div>

        <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in-up delay-300">
          <div className="w-full max-w-md h-64 mx-auto bg-gradient-to-br from-blue-200 via-white to-blue-200 rounded-3xl flex items-center justify-center shadow-xl">
            {/* <p className="text-2xl font-bold text-blue-800 animate-pulse">🔐 E-Voting Reimagined</p> */}
            <img src="/secure_voting.jpg" alt="" className="w-full h-full object-fit rounded-3xl p-2"/>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-14">
          What's in this Voting System?
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105">
            <FaLock className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Anonymous Voting</h3>
            <p className="text-gray-600">
              Votes are signed using Linkable Ring Signatures (LRS) ensuring identity privacy and unlinkability.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105">
            <FaShieldAlt className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">End-to-End Security</h3>
            <p className="text-gray-600">
              With Helmet, express-validator, and rate-limiting, the system is hardened against abuse and injection.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105">
            <FaChartBar className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Real-Time Results</h3>
            <p className="text-gray-600">
              Admins can view election results instantly with dynamic visualizations and tie-breaker logic.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105">
            <FaKey className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Decentralized Key Storage</h3>
            <p className="text-gray-600">
              No keys are stored on server. Voters control their private keys locally on their browser.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105">
            <FaCogs className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Admin Control</h3>
            <p className="text-gray-600">
              Admin dashboard to open/close registration & voting and fetch live results with full control.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-blue-50 border border-blue-200 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-105">
            <FaUsers className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Scalable Ring Voting</h3>
            <p className="text-gray-600">
              Randomized ring size prevents server overload, enabling fast vote generation even for 1000s of users.
            </p>
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">End-to-End Cryptographic Confidence</h2>
          <p className="text-gray-600 mb-10">
            Our voting protocol is built with complete transparency, allowing voters to verify their vote inclusion while remaining anonymous.
          </p>
          <div className="w-full relative max-w-3xl h-64 mx-auto bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-3xl flex items-center justify-center shadow-md">
            <img src="/secure_encryption.svg" alt="Secure Cryptographic Encryption" className="w-full h-full object-fit rounded-3xl "/>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 text-center mt-10">
        <p className="text-sm">© {new Date().getFullYear()} Anonymous Voting System | Built with ❤️ by Ayushman</p>
      </footer>

      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }

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
