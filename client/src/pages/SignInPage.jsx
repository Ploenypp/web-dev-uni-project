import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/SignIn.css";

import axios from 'axios';

function SignInPage() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const getUsername = (evt) => {
        setUsername(evt.target.value);
    }
    const getPassword = (evt) => {
        setPassword(evt.target.value);
    }

    const handleLogin = async () => {
        try {
            await axios.post('http://localhost:8000/api/auth/login', { username, password }, { withCredentials: true });
            navigate('/dashboard');
        } catch(error) {
            console.error("error logging in", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    const navigate = useNavigate();

    const toRegister = () => {
        navigate('/register');
    }

    return(<div className="SignInPage">
        <img src={`http://localhost:8000/api/images/load_icon/${"org13"}`} id="org_signin" alt="Organiz'asso Logo"/>

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
            <button id="login_btn" type="button" onClick={handleLogin}>Connexion</button>
        </div>
        
        <div id="register_form_login">
            <p>Pas encore inscrit(e)?</p>
            <button id="register_btn" type="button" onClick={toRegister}>Inscription</button>
        </div>
    </div>)
}

export default SignInPage;