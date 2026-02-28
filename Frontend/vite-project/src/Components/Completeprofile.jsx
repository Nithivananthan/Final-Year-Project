import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [profile, setProfile] = useState({
    academicStatus: '', 
    backlogs: 'No',     
    topSkills: '',      
    projectType: '',    
    dreamCompany: '',   
    priority: ''        
  });

  const [suggestions, setSuggestions] = useState([]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);


  const getCollegeConsultation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/ai/deep-consult', 
        { profile }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(res.data);
      setStep(4); 
    } catch (err) {
      alert("Consultation failed. Check your Backend.");
    } finally {
      setLoading(false);
    }
  };

  const selectPathAndGenerateRoadmap = async (domainName) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/ai/generate-roadmap', 
        { 
          domain: domainName, 
          currentSkills: profile.topSkills 
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      
      localStorage.setItem('userRoadmap', JSON.stringify(res.data));
      
     
      navigate('/roadmap');
    } catch (err) {
      alert("Failed to generate your roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-2xl w-full relative border border-slate-100 overflow-hidden">
        
       
        <div 
          className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>

        {loading && (
          <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 font-black text-slate-800 text-lg animate-pulse">Consulting AI Mentor...</p>
            <p className="text-slate-400 text-sm mt-2 font-medium">Analyzing your industry readiness</p>
          </div>
        )}

        {/* STEP 1: ACADEMIC STATUS */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
            <div className="mb-8">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Step 01/03</span>
                <h2 className="text-3xl font-black text-slate-800 mt-4">College Background</h2>
                <p className="text-slate-500 font-medium mt-2">Where are you currently in your academic journey?</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Academic Year</label>
                <select className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-400 font-bold text-slate-700 transition-all appearance-none" 
                  onChange={e => setProfile({...profile, academicStatus: e.target.value})} value={profile.academicStatus}>
                  <option value="">Choose Year...</option>
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="Final Year">Final Year (Senior)</option>
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Do you have active backlogs?</label>
                <div className="flex gap-4 mt-2">
                    <button 
                        onClick={() => setProfile({...profile, backlogs: 'No'})}
                        className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${profile.backlogs === 'No' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400'}`}
                    >Clean Slate</button>
                    <button 
                        onClick={() => setProfile({...profile, backlogs: 'Yes'})}
                        className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${profile.backlogs === 'Yes' ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-100 text-slate-400'}`}
                    >Active Backlogs</button>
                </div>
              </div>
              
              <button onClick={handleNext} disabled={!profile.academicStatus} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-600 transition-all duration-300 disabled:bg-slate-200 mt-4 uppercase tracking-widest text-sm">
                Analyze Skillset →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TECH STACK & INTERESTS */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500 space-y-6">
            <div>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Step 02/03</span>
                <h2 className="text-2xl font-black text-slate-800 mt-4">Technical Profile</h2>
            </div>

            <textarea placeholder="e.g. I know C++, Python basics, I built a basic calculator, and I understand SQL queries..." 
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-400 h-36 resize-none font-medium text-slate-600 leading-relaxed"
              onChange={e => setProfile({...profile, topSkills: e.target.value})} value={profile.topSkills} />
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Favorite Project Domain</p>
            <div className="grid grid-cols-2 gap-3">
              {['Websites', 'Mobile Apps', 'AI/ML', 'Security'].map(type => (
                <button key={type} type="button" 
                  onClick={() => setProfile({...profile, projectType: type})}
                  className={`p-3 rounded-xl border-2 text-sm font-black transition-all ${profile.projectType === type ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
               <button onClick={handleBack} className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all">Back</button>
               <button onClick={handleNext} className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-600 transition-all">Set Career Goal</button>
            </div>
          </div>
        )}

        {/* STEP 3: GOALS & PLACEMENT PRESSURE */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right duration-500 space-y-6">
            <h2 className="text-2xl font-black text-slate-800">The Final Stretch</h2>
            <div className="relative">
              <input type="text" placeholder="Target Dream Company..." 
                className="w-full p-5 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                onChange={e => setProfile({...profile, dreamCompany: e.target.value})} value={profile.dreamCompany} />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🏢</span>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase text-center tracking-widest mb-4">Choose Your Primary Focus</p>
              <button onClick={() => {setProfile({...profile, priority: 'Placement'}); getCollegeConsultation();}} className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] hover:border-emerald-500 hover:bg-emerald-50 font-black text-left group transition-all flex items-center justify-between">
                <div>
                    <p className="text-slate-800">Job Placement</p>
                    <p className="text-[10px] text-slate-400 font-medium">Focus on interview prep & high-salary roles</p>
                </div>
                <span className="text-xl group-hover:translate-x-1 transition-transform">💼</span>
              </button>
              
              <button onClick={() => {setProfile({...profile, priority: 'Skills'}); getCollegeConsultation();}} className="w-full p-5 border-2 border-slate-100 rounded-[1.5rem] hover:border-blue-500 hover:bg-blue-50 font-black text-left group transition-all flex items-center justify-between">
                <div>
                    <p className="text-slate-800">Technical Mastery</p>
                    <p className="text-[10px] text-slate-400 font-medium">Focus on depth, architecture, and quality</p>
                </div>
                <span className="text-xl group-hover:translate-x-1 transition-transform">🚀</span>
              </button>
            </div>
            <button onClick={handleBack} className="w-full text-slate-300 font-bold py-2 text-xs hover:text-slate-500 transition-colors uppercase">Edit Profile Data</button>
          </div>
        )}

        {/* STEP 4: DOMAIN SUGGESTIONS (RESULTS) */}
        {step === 4 && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-blue-600">The Path Ahead</h2>
                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-wider">AI Reality Check</p>
            </div>
            
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {suggestions.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => selectPathAndGenerateRoadmap(s.domain)} 
                  className="p-6 border-2 border-slate-50 rounded-[2rem] hover:border-blue-600 hover:bg-blue-50 transition-all group cursor-pointer relative"
                >
                  <h3 className="font-black text-xl text-slate-800 group-hover:text-blue-700">{s.domain}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium italic">"{s.analysis}"</p>
                  <div className="mt-4 flex items-center text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    Build Level-Up Plan →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CompleteProfile;