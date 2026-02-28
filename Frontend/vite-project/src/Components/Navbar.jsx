import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [user, setUser] = useState({ name: "User", email: "" });
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
        console.error("Failed to fetch user in Navbar");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoadmap');
    navigate('/login');
  };

  const activeClass = (path) => 
    location.pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-blue-600";

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/home" className="ml-2 md:ml-0 text-2xl font-black text-blue-600 italic tracking-tighter">
              CareerAI
            </Link>
          </div>

       
          <div className="hidden md:flex items-center space-x-8 font-bold text-slate-500">
            <Link to="/home" className={`h-full flex items-center transition-colors ${activeClass('/home')}`}>Home</Link>
            <Link to="/questions" className={`h-full flex items-center transition-colors ${activeClass('/questions')}`}>Consultant</Link>
         
            <Link to="/roadmap" className={`h-full flex items-center gap-1.5 transition-colors ${activeClass('/roadmap')}`}>
              <span className="text-sm">✨</span> Roadmap
            </Link>

            <Link to="/detector" className={`h-full flex items-center transition-colors ${activeClass('/detector')}`}>Detector</Link>
            <Link to="/jobs" className={`h-full flex items-center transition-colors ${activeClass('/jobs')}`}>Jobs</Link>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200 hover:bg-slate-100 transition active:scale-95"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-bold text-slate-700">
                  {loading ? "..." : user.name.split(' ')[0]} 
                </span>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="pb-3 border-b mb-3">
                      <p className="font-black text-slate-800 text-base">{user.name}</p>
                      <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
                    </div>
                    
                    <Link to="/roadmap" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 p-2.5 rounded-xl mb-1">
                       My Career Roadmap
                    </Link>

                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout Session
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        
        <div className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b flex items-center justify-between">
            <span className="text-2xl font-black text-blue-600 italic">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="flex-grow p-6 space-y-6">
            <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-slate-600">🏠 Home</Link>
            <Link to="/questions" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-slate-600">🧠 AI Consultant</Link>
            
       
            <Link to="/roadmap" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-blue-600">
              ✨ My Roadmap
            </Link>

            <Link to="/detector" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-slate-600">🛡️ Scam Detector</Link>
            <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-slate-600">🔍 Job Search</Link>
          </div>

          <div className="p-6 border-t bg-slate-50">
            <p className="font-black text-slate-800">{user.name}</p>
            <button onClick={handleLogout} className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-black mt-4 shadow-lg shadow-red-100 transition-all">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;