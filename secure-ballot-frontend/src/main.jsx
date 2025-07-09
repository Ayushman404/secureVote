import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import UserContextProvider from './context/userContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <UserContextProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
        </GoogleOAuthProvider>
      </UserContextProvider>
    </BrowserRouter>
)
