import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RoadmapView() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // 1. Try local storage for instant load
        const saved = localStorage.getItem('userRoadmap');
        if (saved) {
          setRoadmap(JSON.parse(saved));
          setLoading(false);
        }

        // 2. Always fetch fresh data from MongoDB to ensure sync
        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.roadmap && res.data.roadmap.roadmapData.length > 0) {
          const dbRoadmap = {
            targetDomain: res.data.roadmap.targetDomain,
            missingSkills: res.data.roadmap.missingSkills,
            roadmap: res.data.roadmap.roadmapData // Mapping backend naming to frontend naming
          };
          setRoadmap(dbRoadmap);
          localStorage.setItem('userRoadmap', JSON.stringify(dbRoadmap));
        } else if (!saved) {
          // If no roadmap in DB AND no roadmap in LocalStorage, go to consultant
          navigate('/questions');
        }
      } catch (err) {
        console.error("Error fetching roadmap from DB", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-600">Retrieving your career path...</p>
      </div>
    </div>
  );

  if (!roadmap) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              {roadmap.targetDomain} Roadmap
            </h1>
            <p className="text-blue-600 font-bold mt-1 uppercase text-sm tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              Industry Readiness Plan
            </p>
          </div>
          <button 
            onClick={() => navigate('/questions')}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            ← Generate New Path
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section: Missing Skill Gaps */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="text-red-500">🚨</span> Skill Gaps to Bridge
              </h3>
              <div className="space-y-3">
                {roadmap.missingSkills?.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-red-50/50 text-red-700 rounded-2xl font-bold text-sm border border-red-100 animate-in fade-in slide-in-from-right" style={{animationDelay: `${i * 100}ms`}}>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: 6-Month Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 ml-2">6-Month Transformation</h3>
            <div className="relative border-l-2 border-slate-200 ml-6 space-y-8">
              {roadmap.roadmap?.map((step, i) => (
                <div key={i} className="relative pl-10 animate-in fade-in slide-in-from-bottom duration-700" style={{animationDelay: `${i * 150}ms`}}>
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-4 border-blue-600 rounded-full z-10"></div>
                  
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-4 py-1 bg-slate-800 text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                        Month {step.month}
                      </span>
                      <input type="checkbox" checked={step.isCompleted} className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" readOnly />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">
                      {step.goal}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                      {step.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapView;