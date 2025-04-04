import {useState, useEffect, useRef} from 'react';
import logo from '../assets/logo.png';
import "../styles/Ribbon.css";

function Ribbon() {
    return(<div className="Ribbon">
        <img src={logo} id="logo_ribbon" alt="Organiz'asso Logo"/>
        <div id="nothing"></div>
        <button id="profile" type="button">Mon Profil</button>
        <button id="logout" type="button">Deconnexion</button>
    </div>)
}

export default Ribbon;