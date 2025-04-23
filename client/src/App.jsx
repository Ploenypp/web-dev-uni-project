import React from 'react';
import { Route, Routes } from 'react-router-dom';

import SignInPage from './pages/SignInPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MainPage from './pages/MainPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OtherUserPage from './pages/OtherUserPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

import "./Default.css";

function App() {
    return(<div>
        <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<MainPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/user" element={<OtherUserPage />} /> 
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    </div>);
};

export default App;