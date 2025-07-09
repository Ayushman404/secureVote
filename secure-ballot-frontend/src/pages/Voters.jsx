import axios from "axios";
import React, { useState, useEffect } from "react";

const Voters = () => {
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/voter/list`)
      .then((response) => {
        console.log("Voters list fetched successfully:");
        setVoters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching voters list:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-10 drop-shadow">
          📋 Registered Voters
        </h1>

        <div className="overflow-x-auto shadow-lg rounded-xl border border-blue-200 bg-white">
          <table className="min-w-full table-auto text-sm md:text-base">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="py-3 px-4 md:px-6 text-left font-semibold uppercase tracking-wider border-b border-blue-300">
                  Name
                </th>
                <th className="py-3 px-4 md:px-6 text-left font-semibold uppercase tracking-wider border-b border-blue-300">
                  Email
                </th>
                <th className="py-3 px-4 md:px-6 text-left font-semibold uppercase tracking-wider border-b border-blue-300">
                  Public Key
                </th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <td className="py-3 px-4 md:px-6 border-b border-blue-100 font-medium text-gray-800">
                    {voter.name}
                  </td>
                  <td className="py-3 px-4 md:px-6 border-b border-blue-100 text-gray-700">
                    {voter.email}
                  </td>
                  <td className="py-3 px-4 md:px-6 border-b border-blue-100">
                    <div className="w-48 md:w-auto max-w-full overflow-x-auto whitespace-nowrap font-mono text-xs text-gray-600 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                      {voter.publicKey}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Voters;
