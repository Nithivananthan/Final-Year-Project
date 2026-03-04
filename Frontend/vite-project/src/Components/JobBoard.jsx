import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/jobs/match', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data.sort((a, b) => b.matchScore - a.matchScore));
      } catch (err) {
        console.error("Fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 font-black text-slate-400 uppercase tracking-[0.3em] text-xs">Scanning Indian Market...</p>
    </div>
  );

  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Recommended Roles</h1>
        <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Real-time Match Analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div key={job.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <img src={job.logo} alt="company" className="w-14 h-14 rounded-2xl object-contain bg-slate-50 p-2" />
                <div className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase ${job.matchScore > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {job.matchScore}% Match
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase mb-6 tracking-widest">{job.company} • {job.location}</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-500 text-xs font-medium leading-relaxed italic">"{job.analysis}"</p>
              </div>
            </div>

            <a href={job.applyLink} target="_blank" rel="noreferrer" 
               className="mt-8 block w-full text-center bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
              Apply to Source →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobBoard;