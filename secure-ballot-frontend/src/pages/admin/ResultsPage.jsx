import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  // const [isGenerating, setIsGenerating] = useState(false);

  const resultsRef = useRef();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/results`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => setResults(res.data.results))
      .catch((err) => console.error("Error loading results", err));
  }, []);



  if (!results) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">
        Loading results...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.6s ease-in forwards;
            opacity: 0;
            transform: translateY(20px);
          }

          .fade-delay-1 { animation-delay: 0.1s; }
          .fade-delay-2 { animation-delay: 0.2s; }
          .fade-delay-3 { animation-delay: 0.3s; }
          .fade-delay-4 { animation-delay: 0.4s; }

          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow">
          🗳️ Election Results
        </h1>
      </div>

      <div
        ref={resultsRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto" 
        id="results-section"
      >
        {Object.entries(results).map(([position, candidates], posIdx) => {
          const sorted = Object.entries(candidates).sort((a, b) => b[1] - a[1]);
          const topVotes = sorted[0][1];
          const totalVotes = sorted.reduce((acc, [_, val]) => acc + val, 0);
          const winners = sorted
            .filter(([_, count]) => count === topVotes)
            .map(([name]) => name);

          return (
            <div
              key={position}
              className={`bg-white shadow-xl rounded-2xl p-6 border-l-4 border-blue-400 fade-in fade-delay-${
                (posIdx % 4) + 1
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
                {position}
              </h2>
              <ul className="space-y-4">
                {sorted.map(([name, count], idx) => {
                  const percent = totalVotes
                    ? ((count / totalVotes) * 100).toFixed(1)
                    : 0;
                  const isWinner = winners.includes(name);
                  return (
                    <li key={name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-800 font-medium">
                          {name}
                        </span>
                        <div className="flex items-center gap-2">
                          {isWinner && (
                            <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
                              🏆 Winner
                            </span>
                          )}
                          <span className="text-sm text-blue-700 font-bold">
                            {count} vote{count !== 1 && "s"} ({percent}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 h-3 rounded-full">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full transition-all ${
                            isWinner ? "bg-yellow-400" : "bg-blue-400"
                          }`}
                        ></div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {winners.length > 1 && (
                <p className="text-sm mt-4 text-yellow-700 font-medium">
                  ⚠️ It's a tie between {winners.length} candidates.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
