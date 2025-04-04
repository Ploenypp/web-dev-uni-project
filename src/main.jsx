import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import SignInPage from './pages/SignInPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MainPage from './pages/MainPage.jsx'

import "./styles/Default.css";


createRoot(document.getElementById('root')).render(
  <SignInPage />
  //<RegisterPage />
  //<MainPage />
)
