import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Authentication() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // New State for UI Feedback
  const [message, setMessage] = useState({ text: '', type: '' }); 
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/api/user";

  const handleAuth = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Reset message and start loading
    setMessage({ text: isLogin ? 'Logging in...' : 'Creating account...', type: 'info' });
    setIsLoading(true);

    const endpoint = isLogin ? '/login' : '/register';
    
    try {
      const payload = e.isGoogle 
        ? { credential: e.credential, isGoogle: true } 
        : { email, password };

      const targetRoute = e.isGoogle ? `${API_URL}/google` : `${API_URL}${endpoint}`;

      const res = await axios.post(targetRoute, payload);
      
      localStorage.setItem('token', res.data.token);
      
      // Success Message
      setMessage({ text: 'Success! Redirecting...', type: 'success' });

      // Small delay so user can see the success message
      setTimeout(() => {
        if (res.data.user.isProfileComplete) {
          navigate('/Dashboard');
        } else {
          navigate('/Completeprofile');
        }
      }, 1500);

    } catch (err) {
      setIsLoading(false);
      // Detailed error response from Backend
      const errorMsg = err.response?.data?.msg || "Something went wrong. Try again.";
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">Career Guidance AI</h2>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Welcome back!" : "Create a new account"}
        </p>

        {/* --- STATUS MESSAGE BOX --- */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${
            message.type === 'error' ? 'bg-red-100 text-red-600 border border-red-200' : 
            message.type === 'success' ? 'bg-green-100 text-green-600 border border-green-200' : 
            'bg-blue-100 text-blue-600 border border-blue-200'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <GoogleLogin 
            onSuccess={(res) => handleAuth({ isGoogle: true, credential: res.credential })} 
            onError={() => setMessage({ text: 'Google Auth Failed', type: 'error' })}
          />
        </div>

        <div className="relative flex items-center mb-6 text-gray-400 text-xs uppercase">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition duration-200 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Processing..." : (isLogin ? "Login" : "Register Now")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: '', type: '' }); // Clear message when switching
            }} 
            className="ml-2 text-blue-600 font-bold hover:underline"
          >
            {isLogin ? "Create Account" : "Login Here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Authentication;