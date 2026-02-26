import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google' 
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = "557474656758-dtejorbnno0h5imppdu6bfdsiqp1d4a4.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)