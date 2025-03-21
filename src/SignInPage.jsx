import {useState, useEffect, useRef} from 'react';
import "./SignIn.css";
import logo from './assets/logo.png';

function SignInPage() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [isLoading,setLoading] = useState(false);
    const [error,setError] = useState("");

    function onSignIn(username,password) {
    }

    return(<div className ="SignInPage">
        <div id="logo">
            <img src={logo} 
            alt="Organiz'asso Logo"/>
        </div>

        <form>
            <label htmlFor="username">Nom d'utilisateur</label>
            <input id="username" type="text" class="text-input"/>
            <br></br>

            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="text" class="text-input"/>
        </form> 
        <button id="login" type="button" onClick={onSignIn(username,password)}>Connexion</button>

        <button id="register" type="button">Inscription</button>
    </div>)
}

export default SignInPage;