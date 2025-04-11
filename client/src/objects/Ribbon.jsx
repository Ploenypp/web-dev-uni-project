import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo.png';
import "../styles/Ribbon.css";

import axios from 'axios';

function Ribbon() {
    const navigate = useNavigate();

    const toDashboard = () => {
        navigate("/dashboard");
    }
    const toProfile = () => {
        navigate("/profile");
    }

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
            alert(response.data.message);
            navigate('/');

        } catch (error) {
            console.error("Logout failed", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="Ribbon">
        <img src={logo} id="logo_ribbon" alt="Organiz'asso Logo" onClick={toDashboard}/>
        <div id="nothing"></div>
        <button id="profile" type="button" onClick={toProfile}>Mon Profil</button>
        <button id="logout" type="button" onClick={handleLogout}>Deconnexion</button>
    </div>)
}

export default Ribbon;