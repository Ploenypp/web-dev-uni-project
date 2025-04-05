import {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo.png';
import "../styles/Ribbon.css";

function Ribbon() {
    const navigate = useNavigate();

    const toDashboard = () => {
        navigate("/dashboard");
    }
    const toProfile = () => {
        navigate("/profile");
    }
    const toLogOut = () => {
        navigate("/");
    }

    return(<div className="Ribbon">
        <img src={logo} id="logo_ribbon" alt="Organiz'asso Logo"onClick={toDashboard}/>
        <div id="nothing"></div>
        <button id="profile" type="button" onClick={toProfile}>Mon Profil</button>
        <button id="logout" type="button" onClick={toLogOut}>Deconnexion</button>
    </div>)
}

export default Ribbon;