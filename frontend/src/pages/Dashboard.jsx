import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ResultCard from '../components/ResultCard';
import { Loader2, Award, AlertCircle, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL; // ✅ ADD THIS

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API}/api/results`); // ✅ FIXED
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // rest of your code SAME...

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="font-medium animate-pulse">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={fetchResults}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-[100%] max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Performance Overview</h1>
            <p className="mt-1 text-gray-500">Your latest exam results and statistics.</p>
          </div>
          
          {data && (
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-gray-100 shadow-sm self-start sm:self-auto">
              <div className={`p-2 rounded-full ${data.pass_status === 'Pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <Award size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium leading-none">Status</span>
                <span className={`text-sm font-bold leading-none mt-1 ${data.pass_status === 'Pass' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {data.pass_status}
                </span>
              </div>
            </div>
          )}
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <ResultCard subject="Math" marks={data.math} />
              <ResultCard subject="Science" marks={data.science} />
              <ResultCard subject="English" marks={data.english} />
              <ResultCard subject="History" marks={data.history} />
              <ResultCard subject="Geography" marks={data.geography} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-indigo-600">{data.total}</span>
                  <span className="text-lg text-gray-400 font-medium">/ 500</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500 mb-1">Average Percentage</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-blue-600">{data.average.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
