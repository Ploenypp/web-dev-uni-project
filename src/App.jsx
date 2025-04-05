import React from 'react';
import { Route, Routes } from 'react-router-dom';

import SignInPage from './pages/SignInPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MainPage from './pages/MainPage.jsx';

import "./Default.css";

function App() {
    return(<div>
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<MainPage />} />
        </Routes>
    </div>);
};

export default App;