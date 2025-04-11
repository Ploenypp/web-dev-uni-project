import {useState, useEffect, useRef} from 'react';

import tmp_pfp from "../assets/tmp_pfp.png";
import "../styles/ProfilePage.css";

function ProfileInfo() {
    const [userInfo, setUserInfo] = useState("");

    useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => console.error("Error fetching user data:", err));
    }, []);

    return(<div className="ProfileInfo">
        <img src={tmp_pfp} id="profile_pic" alt="profile picture"/>
                <div id="profile_text">
                    <p>Prénom : <strong>{userInfo.fstname}</strong> </p> 
                    <p>Nom : <strong>{userInfo.surname}</strong></p>
                    <p>Date de naissance : <strong>{userInfo.dob}</strong> </p> 
                    <p>Status : <strong>{userInfo.status}</strong> </p> 
                    <p>Équipe(s) : <strong>{userInfo.team}</strong></p>
                </div>
    </div>)
}

export default ProfileInfo;