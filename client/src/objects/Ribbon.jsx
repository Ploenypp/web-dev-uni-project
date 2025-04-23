import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import logo from '../assets/org13_ribbon.png';
import gummiphone from '../assets/gummiphone.png';
import computer from '../assets/computer.png';
import logout from '../assets/keyblade_icon.png';
import "../styles/Ribbon.css";

// profile pictures
import tmp_pfp from "../assets/tmp_pfp.png";
import xemnas from "../assets/profile_pics/xemnas.png";
import xigbar from "../assets/profile_pics/xigbar.png";
import xaldin from "../assets/profile_pics/xaldin.png";
import vexen from "../assets/profile_pics/vexen.png";
import lexaeus from "../assets/profile_pics/lexaeus.png";
import zexion from "../assets/profile_pics/zexion.png";
import saix from "../assets/profile_pics/saix.png";
import axel from "../assets/profile_pics/axel.png";
import demyx from "../assets/profile_pics/demyx.png";
import luxord from "../assets/profile_pics/luxord.png";
import marluxia from "../assets/profile_pics/marluxia.png";
import larxene from "../assets/profile_pics/larxene.png";
import roxas from "../assets/profile_pics/roxas.png";
import xion from "../assets/profile_pics/xion.png";

function Ribbon(props) {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const adminPage = props.pageType;

    useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setName(data.fstname + " " + data.surname);
                setStatus(data.status);
            })
            .catch(err => console.error("Error fetching user data:", err))
    }, []);

    const pfp = () => {
        if (name === "Xemnas Xehanort") { return xemnas; }
        if (name === "Xigbar Braig") { return xigbar; }
        if (name === "Xaldin Dilan") { return xaldin; }
        if (name === "Vexen Even") { return vexen; }
        if (name === "Lexaeus Aeleus") { return lexaeus; }
        if (name === "Zexion Ienzo") { return zexion; }
        if (name === "Saix Isa") { return saix; }
        if (name === "Axel Lea") { return axel; }
        if (name === "Demyx Medy") { return demyx; }
        if (name === "Luxord Rodul") { return luxord; }
        if (name === "Marluxia Lauriam") { return marluxia; }
        if (name === "Larxene Elrena") { return larxene; }
        if (name === "Roxas Sora") { return roxas; }
        if (name === "Xion Noi") { return xion; }
        return tmp_pfp;
    };

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
            <img src={pfp()} id="ribbon_pic" alt="profile picture"/>
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