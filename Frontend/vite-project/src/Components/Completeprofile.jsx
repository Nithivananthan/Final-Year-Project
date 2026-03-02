import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    academicStatus: '', backlogs: 'No', topSkills: '',
    projectDetails: '', workStyle: '', dreamCompany: '', priority: ''
  });

  const [suggestions, setSuggestions] = useState([]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const getCollegeConsultation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/ai/deep-consult', { profile }, 
        { headers: { Authorization: `Bearer ${token}` } });
      setSuggestions(res.data);
      setStep(6);
    } catch (err) { alert("AI Consult Failed"); } finally { setLoading(false); }
  };

  const selectPathAndGenerateRoadmap = async (domainName) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/ai/generate-roadmap', 
        { domain: domainName, currentSkills: profile.topSkills }, 
        { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('userRoadmap', JSON.stringify(res.data));
      navigate('/roadmap');
    } catch (err) { alert("Roadmap Failed"); } finally { setLoading(false); }
  };


  const headingStyle = "text-3xl font-black text-slate-900 tracking-tight leading-tight";
  const subHeadingStyle = "text-slate-500 font-medium text-sm mt-2 mb-8";
  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700";
  const btnPrimary = "w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-[0.98]";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 selection:bg-blue-100">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] max-w-2xl w-full relative border border-white overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
           <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute top-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 font-black text-slate-900 text-xl tracking-tight">AI Engine Processing...</p>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Analyzing readiness</p>
          </div>
        )}


        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Phase 01</span>
            <h2 className={headingStyle}>Academic Status</h2>
            <p className={subHeadingStyle}>Select your current standing in your degree program.</p>
            <select className={inputStyle} onChange={e => setProfile({...profile, academicStatus: e.target.value})} value={profile.academicStatus}>
              <option value="">Select Year...</option>
              <option value="3rd Year">3rd Year (Junior)</option>
              <option value="Final Year">Final Year (Senior)</option>
            </select>
            <button onClick={handleNext} disabled={!profile.academicStatus} className={`${btnPrimary} mt-8 disabled:opacity-30 disabled:hover:bg-slate-900`}>Next Step →</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Phase 02</span>
            <h2 className={headingStyle}>Tech Stack</h2>
            <p className={subHeadingStyle}>List the languages and frameworks you're comfortable with.</p>
            <textarea className={`${inputStyle} h-40 resize-none font-medium text-slate-600`} placeholder="Python, React, SQL, AWS..." onChange={e => setProfile({...profile, topSkills: e.target.value})} value={profile.topSkills} />
            <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 bg-slate-50 text-slate-500 p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">Back</button>
                <button onClick={handleNext} disabled={!profile.topSkills} className={`${btnPrimary} flex-[2]`}>Continue →</button>
            </div>
          </div>
        )}

      
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Phase 03</span>
            <h2 className={headingStyle}>Project History</h2>
            <p className={subHeadingStyle}>What is the most complex system you've built so far?</p>
            <textarea className={`${inputStyle} h-40 resize-none font-medium text-slate-600`} placeholder="Describe your best project architecture..." onChange={e => setProfile({...profile, projectDetails: e.target.value})} value={profile.projectDetails} />
            <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 bg-slate-50 text-slate-500 p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">Back</button>
                <button onClick={handleNext} className={`${btnPrimary} flex-[2]`}>Next Phase →</button>
            </div>
          </div>
        )}

        {/* STEP 4: Professional DNA */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Phase 04</span>
            <h2 className={headingStyle}>Work Style</h2>
            <p className={subHeadingStyle}>How do you approach technical challenges?</p>
            <div className="grid grid-cols-1 gap-3">
              {['Architect (Systems & Logic)', 'Fixer (Debugging & Solving)', 'Creative (Design & UI)', 'Analyst (Data & Research)'].map(id => (
                <button key={id} onClick={() => setProfile({...profile, workStyle: id})} 
                        className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 ${profile.workStyle === id ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'border-slate-50 bg-slate-50/30 hover:bg-slate-50'}`}>
                  <p className={`font-black text-sm ${profile.workStyle === id ? 'text-blue-700' : 'text-slate-700'}`}>{id}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
                <button onClick={handleBack} className="flex-1 bg-slate-50 text-slate-500 p-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">Back</button>
                <button onClick={handleNext} disabled={!profile.workStyle} className={`${btnPrimary} flex-[2]`}>Proceed →</button>
            </div>
          </div>
        )}

        {/* STEP 5: Goals */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Final Phase</span>
            <h2 className={headingStyle}>Future Target</h2>
            <p className={subHeadingStyle}>Set your destination and your primary development focus.</p>
            <input className={inputStyle} placeholder="Target Company (e.g. Google)" onChange={e => setProfile({...profile, dreamCompany: e.target.value})} value={profile.dreamCompany} />
            <div className="mt-8 space-y-3">
              <button onClick={() => {setProfile({...profile, priority: 'Placement'}); getCollegeConsultation();}} 
                      className="w-full p-5 border-2 border-slate-50 bg-slate-50/50 rounded-2xl font-black text-left hover:border-blue-600 hover:bg-blue-50 transition-all flex justify-between items-center group">
                <span className="text-slate-700 group-hover:text-blue-700">Job Placement Focus</span>
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">💼</span>
              </button>
              <button onClick={() => {setProfile({...profile, priority: 'Skills'}); getCollegeConsultation();}} 
                      className="w-full p-5 border-2 border-slate-50 bg-slate-50/50 rounded-2xl font-black text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all flex justify-between items-center group">
                <span className="text-slate-700 group-hover:text-indigo-700">Technical Mastery Focus</span>
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">🚀</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: RESULTS */}
        {step === 6 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Analysis Complete</span>
            <h2 className={headingStyle}>AI Recommendations</h2>
            <p className={subHeadingStyle}>Select a path to generate your custom 6-month roadmap.</p>
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => selectPathAndGenerateRoadmap(s.domain)} 
                     className="p-6 border border-slate-100 bg-white rounded-3xl hover:border-blue-600 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-all group">
                  <h3 className="font-black text-xl text-slate-800 group-hover:text-blue-700">{s.domain}</h3>
                  <p className="text-sm text-slate-500 mt-2 italic leading-relaxed font-medium">"{s.analysis}"</p>
                  <div className="mt-4 flex items-center text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
                    Build My Roadmap →
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