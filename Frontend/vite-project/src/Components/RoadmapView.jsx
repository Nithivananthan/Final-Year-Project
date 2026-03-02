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
        if (!token) { navigate('/login'); return; }

        const res = await axios.get('http://localhost:3000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.roadmap?.roadmapData?.length > 0) {
          setRoadmap({
            targetDomain: res.data.roadmap.targetDomain,
            missingSkills: res.data.roadmap.missingSkills,
            roadmap: res.data.roadmap.roadmapData
          });
        } else { navigate('/questions'); }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchRoadmap();
  }, [navigate]);

  if (loading || !roadmap) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 md:p-14">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Verified Path</p>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            {roadmap.targetDomain} 
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sidebar: Missing Skills */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-28">
              <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Identified Skill Gaps
              </h3>
              <div className="space-y-3">
                {roadmap.missingSkills.map((s, i) => (
                  <div key={i} className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:bg-red-50 hover:border-red-100">
                    <p className="font-bold text-slate-600 text-xs group-hover:text-red-700 transition-colors">{s}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <p className="text-[10px] leading-relaxed text-blue-600 font-bold uppercase tracking-tight">
                  AI Assessment: These gaps are critical for high-tier {roadmap.targetDomain} roles.
                </p>
              </div>
            </div>
          </div>

          {/* Main Timeline Section */}
          <div className="lg:col-span-2 relative">
            {/* The Vertical Line Connector */}
            <div className="absolute left-[31px] top-10 bottom-10 w-[2px] bg-slate-100 hidden md:block"></div>

            <div className="space-y-10">
              {roadmap.roadmap.map((step, i) => (
                <div key={i} className="relative md:pl-16 group animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white shadow-md z-10 transition-colors duration-500 hidden md:flex items-center justify-center ${step.isCompleted ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-blue-600'}`}>
                    {step.isCompleted && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                  </div>

                  <div className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-500 ${step.isCompleted ? 'border-emerald-100 opacity-70 bg-emerald-50/20' : 'border-slate-100 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${step.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white'}`}>
                        Month 0{step.month}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Status</span>
                        <input 
                          type="checkbox" 
                          checked={step.isCompleted} 
                          className="w-5 h-5 accent-blue-600 rounded-lg cursor-not-allowed pointer-events-none" 
                          readOnly 
                        />
                      </div>
                    </div>

                    <h4 className={`text-2xl font-black tracking-tight mb-2 ${step.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {step.goal}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {step.action}
                    </p>
                    
                    {!step.isCompleted && (
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        Active Learning Phase
                      </div>
                    )}
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