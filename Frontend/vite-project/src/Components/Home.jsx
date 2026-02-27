import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-gray-800 mb-8">Welcome to Your Career Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">AI Consultant</h3>
          <p className="text-gray-500 text-sm mb-6">Find your domain and 6-month roadmap.</p>
          <Link to="/questions" className="text-blue-600 font-bold">Go to Quiz →</Link>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold mb-2">Scam Detector</h3>
          <p className="text-gray-500 text-sm mb-6">Identify fake job postings using AI.</p>
          <Link to="/detector" className="text-red-500 font-bold">Check Jobs →</Link>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">Job Search</h3>
          <p className="text-gray-500 text-sm mb-6">Search verified jobs for your skills.</p>
          <Link to="/jobs" className="text-emerald-600 font-bold">Search Now →</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;