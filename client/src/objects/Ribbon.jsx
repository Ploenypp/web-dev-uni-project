import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import logo from '../assets/org13_ribbon.png';
import gummiphone from '../assets/gummiphone.png';
import computer from '../assets/computer.png';
import logout from '../assets/keyblade_icon.png';
import "../styles/Ribbon.css";

function Ribbon(props) {
    const [userID, setUserID] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const adminPage = props.pageType;

    useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setUserID(data._id);
                setName(data.fstname + " " + data.surname);
                setStatus(data.status);
            })
            .catch(err => console.error("Error fetching user data:", err))
    }, []);

    const navigate = useNavigate();
    const toDashboard = () => { navigate("/dashboard"); };
    const toProfile = () => { navigate("/profile"); };
    const toChats = () => { navigate("/chats"); };
    const toAdmin = () => { navigate("/admin"); };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
            //alert(response.data.message);
            navigate('/');

        } catch (error) {
            console.error("Logout failed", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="Ribbon">
        <img src={logo} id="org13_ribbon" alt="Organiz'asso Logo" onClick={toDashboard}/>
        <div id="nothing"></div>
        <button id="profile" type="button" onClick={toProfile}>
            <img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="ribbon_pic" alt="profile picture"/>
            {name}
        </button>
        <button id="chats" type="button" onClick={toChats}><img src={gummiphone} id="ribbon_msg_icon" alt="icon"/>Messages</button>
        
        {status === "admin" && (adminPage ?
            (<button id="forum_btn" type="button" onClick={toDashboard}>
                <img src={computer} id="forum_icon" alt="icon" /> 
                General
            </button>)
            :
            (<button id="forum_btn" type="button" onClick={toAdmin}>
                <img src={computer} id="forum_icon" alt="icon" /> 
                Admin
            </button>))
        }
        
        <button id="logout" type="button" onClick={handleLogout}><img src={logout} id="logout_icon" alt="icon"/>Deconnexion</button>
    </div>)
}

export default Ribbon;