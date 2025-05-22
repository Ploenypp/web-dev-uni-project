import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import "../styles/Ribbon.css";

function Ribbon(props) {
    const [userInfo, setUserInfo] = useState("");
    const [userID, setUserID] = useState("");
    const [status, setStatus] = useState("");
    const adminPage = props.pageType;

    useEffect(() => {
        fetch('http://localhost:8000/api/users/currentUser', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setUserInfo(data);
                setUserID(data._id);
                setStatus(data.status);
            })
            .catch(err => console.error("Error fetching user data:", err))
    }, []);

    const navigate = useNavigate();
    const toDashboard = () => { navigate("/dashboard"); };
    const toProfile = () => { 
        navigate(`/profile/${userInfo.fstname}_${userInfo.surname}`)
        window.location.reload();
    };
    const toChats = () => { navigate("/chats"); };
    const toAdmin = () => { navigate("/admin"); };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
            navigate('/');

        } catch (error) {
            console.error("error logging out", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="Ribbon">
        <img src={`http://localhost:8000/api/images/load_icon/${"org13"}`} id="org13_ribbon" alt="Organiz'asso Logo" onClick={toDashboard}/>
        
        <div id="nothing"></div>
        
        <button id="profile" type="button" onClick={toProfile}>
            <img src={`http://localhost:8000/api/images/load_pfp/${userID}`} id="ribbon_pic" alt="profile picture"/>
            {`${userInfo.fstname} ${userInfo.surname}`}
        </button>

        <button id="chats" type="button" onClick={toChats}>
            <img src={`http://localhost:8000/api/images/load_icon/${"gummiphone"}`} id="ribbon_msg_icon" alt="icon"/>
            Messages
        </button>
        
        {status === "admin" && (adminPage ?
            (<button id="forum_btn" type="button" onClick={toDashboard}>
                <img src={`http://localhost:8000/api/images/load_icon/${"computer"}`} id="forum_icon" alt="icon" /> 
                General
            </button>)
            :
            (<button id="forum_btn" type="button" onClick={toAdmin}>
                <img src={`http://localhost:8000/api/images/load_icon/${"computer"}`} id="forum_icon" alt="icon" /> 
                Admin
            </button>))
        }
        
        <button id="logout" type="button" onClick={handleLogout}>
            <img src={`http://localhost:8000/api/images/load_icon/${"keyblade_icon"}`} id="logout_icon" alt="icon"/>
            Deconnexion
        </button>
    </div>)
}

export default Ribbon;