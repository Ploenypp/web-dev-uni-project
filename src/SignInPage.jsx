import {useState, useEffect, useRef} from 'react';

import "./SignIn.css";
import logo from './assets/logo.png';

function SignInPage() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [isLoading,setLoading] = useState(false);
    const [error,setError] = useState("");

    const getUsername = (evt) => {
        setUsername(evt.target.value);
        console.log({username});
    }
    const getPassword = (evt) => {
        setPassword(evt.target.value);
        console.log({password});
    }

    function onSignIn() {}

    return(<div className="SignInPage">
        <img src={logo} id="logo" alt="Organiz'asso Logo"/>

        <div id="login_box">
            <p>Bienvenue, connectez-vous!</p>
            <form><div id="login_form">
                <div className="field">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input id="username" type="text" className="text-input" placeholder="nom d'utilisateur..." onChange={getUsername}/>
                </div>

                <div className="field">
                    <label htmlFor="password">Mot de passe</label>
                    <input id="password" type="text" className="text-input" placeholder="mot de passe..." onChange={getPassword}/>
                </div>
            </div></form>
            <button id="login_btn" type="button" onClick={onSignIn()}>Connexion</button>
        </div>
        
        <div id="register_form">
            <p>Pas encore inscrit(e)?</p>
            <button id="register_btn" type="button">Inscription</button>
        </div>
    </div>)
}

export default SignInPage;