import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Authentication from './Components/Authentication'
import Dashboard from './Components/Dashboard'
import Completeprofile from './Components/Completeprofile'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/completeprofile" element={<Completeprofile/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App