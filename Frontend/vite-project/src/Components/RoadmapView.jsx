import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RoadmapView() {
  const [roadmap, setRoadmap] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('userRoadmap');
    if (saved) {
      setRoadmap(JSON.parse(saved));
    } else {
      // If no roadmap exists, send them back to the consultant
      navigate('/questions');
    }
  }, [navigate]);

  if (!roadmap) return <div className="p-20 text-center font-bold">Loading Path...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              {roadmap.domain || roadmap.targetDomain} Roadmap
            </h1>
            <p className="text-blue-600 font-bold mt-1 uppercase text-sm tracking-widest">
              Industry Readiness Plan
            </p>
          </div>
          <button 
            onClick={() => navigate('/questions')}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            ← Change Path
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
                  <div key={i} className="flex items-center gap-3 p-4 bg-red-50/50 text-red-700 rounded-2xl font-bold text-sm border border-red-100">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    {skill}
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  <strong>Note:</strong> These skills were identified by AI as missing from your current college profile.
                </p>
              </div>
            </div>
          </div>

          {/* Section: 6-Month Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 ml-2">6-Month Transformation</h3>
            <div className="relative border-l-2 border-slate-200 ml-6 space-y-8">
              {roadmap.roadmap?.map((step, i) => (
                <div key={i} className="relative pl-10">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-4 border-blue-600 rounded-full z-10 shadow-sm"></div>
                  
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-4 py-1 bg-slate-800 text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                        Month {step.month}
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Complete</span>
                        <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" />
                      </label>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {step.goal || step.task}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                      {step.action || step.details}
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