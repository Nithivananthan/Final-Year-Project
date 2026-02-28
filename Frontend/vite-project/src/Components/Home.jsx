import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user for home");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // ✅ Enhanced UI Variables
  const cardStyle = "group relative overflow-hidden bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between min-h-[320px]";
  const iconBg = "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-transform duration-500 group-hover:rotate-12";
  const titleStyle = "text-2xl font-black text-slate-800 mb-3 tracking-tight";
  const descStyle = "text-slate-500 font-medium text-sm leading-relaxed mb-6";
  const linkStyle = "inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all group-hover:gap-4";

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Loading Dashboard</p>
    </div>
  );

  return (
    <div className="p-6 md:p-16 max-w-7xl mx-auto min-h-screen bg-[#f8fafc] selection:bg-blue-100">
      
      {/* --- Header Section --- */}
   <div className="relative mb-14 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {user?.name?.split(' ')[0] || 'Explorer'}
            </span>
          </h1>
        </div>

      </div>

      {/* --- Dashboard Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card 1: Roadmap */}
        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <div>
            <div className={`${iconBg} bg-blue-50 text-blue-600`}>
              {user?.roadmap?.targetDomain ? '✨' : '🗺️'}
            </div>
            <h3 className={titleStyle}>My Roadmap</h3>
            <p className={descStyle}>
              {user?.roadmap?.targetDomain 
                ? `Active Path: ${user.roadmap.targetDomain}. Follow your verified 6-month journey.` 
                : "Your AI-generated career path is waiting. Analyze your skills to begin."}
            </p>
          </div>
          <Link to={user?.roadmap?.targetDomain ? "/roadmap" : "/questions"} className={`${linkStyle} text-blue-600`}>
            {user?.roadmap?.targetDomain ? "Track Progress" : "Get Started"} <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Card 2: AI Consultant */}
        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <div>
            <div className={`${iconBg} bg-indigo-50 text-indigo-600`}>🧠</div>
            <h3 className={titleStyle}>AI Consultant</h3>
            <p className={descStyle}>Get deep analysis on current market trends and which domains fit your specific tech stack.</p>
          </div>
          <Link to="/questions" className={`${linkStyle} text-indigo-600`}>Start Session <span className="text-lg">→</span></Link>
        </div>

        {/* Card 3: Scam Detector */}
        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <div>
            <div className={`${iconBg} bg-red-50 text-red-600`}>🛡️</div>
            <h3 className={titleStyle}>Scam Detector</h3>
            <p className={descStyle}>Verify job postings and interview invites to ensure they aren't fraudulent or predatory.</p>
          </div>
          <Link to="/detector" className={`${linkStyle} text-red-600`}>Analyze Job <span className="text-lg">→</span></Link>
        </div>

        {/* Card 4: Job Search */}
        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <div>
            <div className={`${iconBg} bg-emerald-50 text-emerald-600`}>🔍</div>
            <h3 className={titleStyle}>Job Search</h3>
            <p className={descStyle}>Explore high-quality openings in India verified by our AI to match your roadmap goals.</p>
          </div>
          <Link to="/jobs" className={`${linkStyle} text-emerald-600`}>Find Openings <span className="text-lg">→</span></Link>
        </div>

      </div>
    </div>
  );
}

export default Home;