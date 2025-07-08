import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../context/userContext";
import { sign } from "../utils/signVote";
import axios from "axios";
import { toast } from "react-toastify";
import { ec as EC } from 'elliptic';
import {FaRegClock, FaUserCheck, FaVoteYea, FaClock, FaClipboardList } from "react-icons/fa";

const ec = new EC('secp256k1');

const positions = [
  {
    title: "UGR Representative",
    candidates: [
      { name: "Divyam Sharma", image: "/avatar.jpg" },
      { name: "Panav Arpit Raj", image: "/avatar.jpg" },
      { name: "Yash Raj", image: "/avatar.jpg" },
    ],
  },
  {
    title: "VP Gymkhana",
    candidates: [
      { name: "Neha Mishra", image: "/avatar.jpg" },
      { name: "Anirudh", image: "/avatar.jpg" },
    ],
  },
  {
    title: "Academic Council (ACC)",
    candidates: [
      { name: "Pradeep Kumar", image: "/avatar.jpg" },
      { name: "Ankita Kumari", image: "/avatar.jpg" },
      { name: "Nirmit Chaursia", image: "/avatar.jpg" },
    ],
  },
  {
    title: "Student Welfare",
    candidates: [
      { name: "M. Saketh", image: "/avatar.jpg" },
      { name: "Abhishek Singh", image: "/avatar.jpg" },
    ],
  },
  {
    title: "HoSCAA",
    candidates: [
      { name: "Dhairya Garg", image: "/avatar.jpg" },
      { name: "Saksham Thakur", image: "/avatar.jpg" },
    ],
  },
];

export default function VotePage() {
  const privateKeyHex = localStorage.getItem("privateKey") || null;

  // const { publicKey } = useContext(UserContext);

  const [selected, setSelected] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [feedback, setFeedback] = useState(null);
  const [votingOpen, setVotingOpen] = useState(false);

  //Checking if Admin Allowed Voting?
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/status`)
      .then((res) => {
        const { isVotingOpen } = res.data;
        setVotingOpen(isVotingOpen);
      })
      .catch((err) => {
        console.error("Phase status error", err);
      });
  }, []);

  const getRing = useCallback(async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/voter/ring`, {
        publicKey: ec.keyFromPrivate(privateKeyHex, 'hex').getPublic().encode('hex')
      });
      console.log(response.data);
      return response.data.ring;
    } catch (err) {
      console.error("Error fetching voters:", err);
      return [];
    }
  }, []);

  const handleVote = (position, candidate) => {
    setSelected((prev) => ({
      ...prev,
      [position]: candidate,
    }));
  };

  const handleSubmit = async () => {
    if (!privateKeyHex) {
      setFeedback({
        type: "error",
        text: "Private key not found. Please log in again.",
      });
      return;
    }

    if (Object.keys(selected).length !== positions.length) {
      setFeedback({
        type: "error",
        text: "Please vote for all positions before submitting.",
      });
      toast.error("Please vote for all positions before submitting.");
      return;
    }

    const message = JSON.stringify(selected);

    try {
      const ring = await getRing();
      console.log("Ring of Public Keys: ", ring);

      const signature = sign(message, ring, privateKeyHex);
      console.log("Signature:", signature);

      // Posting the signature and message to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vote/verify`,
        {
          message,
          ring,
          signature
        }
      );

      console.log("Vote submission response:", response.data);
      toast.success("Vote submitted successfully!");

      setFeedback({ type: "success", text: "Vote submitted successfully!" });
    } catch (error) {
      console.error("Signing error:", error.message);
      setFeedback({
        type: "error",
        text: error.response.data.error || "An error occurred while submitting vote.",
      });

      console.log(error);

      toast.error(error.response.data.error || "An error occurred while submitting vote.");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  if (votingOpen === false) {
    return (
       <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center border-t-4 border-red-400 animate-fade-in-up">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-red-500 text-4xl">
            <FaRegClock />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Voting is currently closed
          </h2>
          <p className="text-gray-600 text-lg">
            Please check back later once the voting phase is open.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105"
          >
            Go to Home
          </a>
        </div>
      </div>

      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s forwards;
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

  if (votingOpen === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-medium text-gray-600">
          Checking voting status...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 py-14 px-6 animate-fade-in">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-center mb-10 text-indigo-800 drop-shadow-xl tracking-tight flex items-center justify-center gap-4">
        <FaVoteYea className="text-indigo-700" /> Cast Your Vote
      </h1>

      {/* Countdown */}
      <div className="text-center text-lg font-semibold text-red-600 mb-12 flex justify-center items-center gap-2">
        <FaClock className="text-xl" /> Voting ends in: <span className="font-bold">{timeLeft}</span>
      </div>

      {/* Voting Cards */}
      {positions.map((pos) => (
        <div key={pos.title} className="mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-indigo-900 mb-8 text-center border-b-2 pb-3 border-indigo-300">
            {pos.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
            {pos.candidates.map((candidate, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-xl p-6 border-2 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl relative overflow-hidden group ${
                  selected[pos.title] === candidate.name
                    ? "border-indigo-600 ring-2 ring-indigo-300"
                    : "border-gray-100"
                }`}
              >
                <div className="h-28 w-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-center text-lg font-bold text-gray-800 mb-4">
                  {candidate.name}
                </h3>
                <button
                  onClick={() => handleVote(pos.title, candidate.name)}
                  className={`w-full py-2 rounded-xl font-semibold transition-all ${
                    selected[pos.title] === candidate.name
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {selected[pos.title] === candidate.name ? "✅ Selected" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mt-16 border border-indigo-200 max-w-2xl mx-auto">
        <h3 className="text-2xl font-extrabold mb-4 text-indigo-800 text-center flex items-center justify-center gap-2">
          <FaClipboardList className="text-indigo-700" /> Your Current Selections
        </h3>
        {Object.keys(selected).length === 0 ? (
          <p className="text-center text-gray-500 italic">
            You haven't selected any candidates yet.
          </p>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
            {Object.entries(selected).map(([position, candidate]) => (
              <li key={position}>
                <strong>{position}:</strong> {candidate}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-2xl shadow-xl transition-all duration-300 text-lg hover:scale-105"
        >
          Submit Vote <FaUserCheck className="inline ml-2 text-xl" />
        </button>
        {feedback && (
          <div
            className={`mt-4 text-lg font-medium ${
              feedback.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
