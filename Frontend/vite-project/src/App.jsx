import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './Components/Authentication';
import Home from './Components/Home'
import CompleteProfile from './Components/Completeprofile'
import Navbar from './Components/Navbar'
import RoadmapView from './Components/RoadmapView';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Page */}
        <Route path="/login" element={<Authentication />} />

        {/* All Logged-in Pages */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-slate-50">
              <Navbar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/questions" element={<CompleteProfile />} />
                <Route path="/roadmap" element={<RoadmapView />} />
                <Route path="/detector" element={<div className="p-10 text-2xl font-bold">Fake Job Identifier Module</div>} />
                <Route path="/jobs" element={<div className="p-10 text-2xl font-bold">Smart Job Search Module</div>} />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;