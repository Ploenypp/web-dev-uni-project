import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import SignInPage from './SignInPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import MainPage from './MainPage.jsx'

import "./Default.css";


createRoot(document.getElementById('root')).render(
  <SignInPage />
  //<RegisterPage />
  //<MainPage />
)
