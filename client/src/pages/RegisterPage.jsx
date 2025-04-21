import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Register.css";
import logo from '../assets/org13_ribbon.png';

import axios from 'axios';

function RegisterPage() {

    const navigate = useNavigate();
    const toSignIn = () => {
        navigate("/");
    }

    const [fstname, setFstname] = useState("");
    const [surname, setSurname] = useState("");
    const [dob, setDob] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [pwdMatch, setPwdMatch] = useState("");

    const getFstname = (evt) => { setFstname(evt.target.value); }
    const getSurname = (evt) => { setSurname(evt.target.value); }
    const getDob = (evt) => { setDob(evt.target.value); }
    const getUsername = (evt) => { setUsername(evt.target.value); }
    const getPassword = (evt) => { setPassword(evt.target.value); }
    
    const getChkPwd = (evt) => { 
        const chk = evt.target.value; 
        if (chk == password) {
            setPwdMatch("match");
        } else {
            setPwdMatch("");
        }
    }

    useEffect(() => {
        console.log(`
        fstname: ${fstname}
        surname: ${surname}
        dob: ${dob}
        username: ${username}
        password: ${password}
        chk: ${pwdMatch}
        `);
    }, [fstname,surname,dob,username,password,pwdMatch]);

    const handleRegister = async () => {
        if (pwdMatch != "match") {
            alert("Les mots de passe ne correspondent pas.");
            return ;
        }
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', {
                fstname,
                surname,
                dob,
                username,
                password
            });

            alert(response.data.message); //show success message
            navigate('/');
            
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong.");
        }
    };

    return(<div className ="RegisterPage">
        <img src={logo} id="org_signin" alt="Organiz'asso Logo" onClick={toSignIn}/>
        
        <div id="register_box">
            <p>Inscrivez-vous</p>

            <form><div id="register_form">
                <label htmlFor="fstname">Prénom</label>
                <input id="fstname" type="text" className="text-input" onChange={getFstname} placeholder="prénom..." required/>

                <label htmlFor="surname">Nom de famille</label>
                <input id="surname" type="text" className="text-input" onChange={getSurname} placeholder="nom de famille..." required/>

                <label htmlFor="dob">Date de naissance</label>
                <input id="dob" type="date" min="1900-01-01" max="2007-12-31" onChange={getDob} required/>

                <label htmlFor="username">Nom d'utilisateur</label>
                <input id="username" type="text" className="text-input" onChange={getUsername} placeholder="nom d'utilisateur..." required/>

                <label htmlFor="password">Mot de passe</label>
                <input id="password" type="text" className="text-input" onChange={getPassword} placeholder="mot de passe..." required/>

                <label htmlFor="ckkPwd">Confirmer le mot de passe</label>
                <input className={`chkPwd ${pwdMatch}`} type="text" onChange={getChkPwd} placeholder="retapez le mot de passe..." required/>
                </div></form>
            <button id="register_btn" type="button" onClick={handleRegister}>Inscription</button>
        </div>
    </div>)
}

export default RegisterPage;