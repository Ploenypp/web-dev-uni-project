import {useState, useEffect, useRef} from 'react';
import "./Register.css";
import logo from './assets/logo.png';

function RegisterPage() {

    return(<div className ="RegisterPage">
        <img src={logo} id="logo" alt="Organiz'asso Logo"/>
        
        <div id="register_box">
            <p>Inscrivez-vous</p>

            <form><div id="register_form">
                <label htmlFor="fstname">Prénom</label>
                <input id="fstname" type="text" className="text-input" placeholder="prénom..."/>

                <label htmlFor="lstname">Nom de famille</label>
                <input id="lstname" type="text" className="text-input" placeholder="nom de famille..."/>

                <label htmlFor="dob">Date de naissance</label>
                <input id="dob" type="date" min="1900-01-01" max="2007-12-31" required/>

                <label htmlFor="username">Nom d'utilisateur</label>
                <input id="username" type="text" className="text-input" placeholder="nom d'utilisateur..."/>

                <label htmlFor="password">Mot de passe</label>
                <input id="password" type="text" className="text-input" placeholder="mot de passe..."/>

                <label htmlFor="password2">Confirmer le mot de passe</label>
                <input id="password2" type="text" className="text-input" placeholder="retapez le mot de passe..."/>
                </div></form>
            <button id="register_btn" type="button">Inscription</button>
        </div>
    </div>)
}

export default RegisterPage;