import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'

import SignInPage from './SignInPage.jsx'
import RegisterPage from './RegisterPage.jsx'

createRoot(document.getElementById('root')).render(
  <SignInPage />
  //<RegisterPage />
)
