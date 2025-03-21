import {useState, useEffect, useRef} from 'react';
import "./Register.css";
import logo from './assets/logo.png';

function RegisterPage() {

    return(<div className ="RegisterPage">
        <div id="logo">
            <img src={logo} 
            alt="Organiz'asso Logo"/>
        </div>

        <h>Inscrivez-vous</h>

        <form>
            < label htmlFor="fstname">Prénom</label>
            <input id="fstname" type="text" className="text-input"/>

            <label htmlFor="lstname">Nom de famille</label>
            <input id="lstname" type="text" className="text-input"/>

            <label htmlFor="username">Nom d'utilisateur</label>
            <input id="username" type="text" className="text-input"/>

            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="text" className="text-input"/>

            <label htmlFor="password2">Confirmer le mot de passe</label>
            <input id="password2" type="text" className="text-input"/>
        </form>

        <button id="register" type="button">Inscription</button>
    </div>)
}

export default RegisterPage;