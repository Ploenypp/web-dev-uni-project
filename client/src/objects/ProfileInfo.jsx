import {useState, useEffect, useRef} from 'react';

import tmp_pfp from "../assets/tmp_pfp.png";
import "../styles/ProfilePage.css";

function ProfileInfo(props) {
    return(<div className="ProfileInfo">
        <img src={tmp_pfp} id="profile_pic" alt="profile picture"/>
                <div id="profile_text">
                    <p>Prénom : <strong>{props.fstname}</strong> </p> 
                    <p>Nom : <strong>{props.surname}</strong></p>
                    <p>Date de naissance : <strong>{props.dob}</strong> </p> 
                    <p>Status : <strong>{props.status}</strong> </p> 
                    <p>Équipe(s) : <strong>{props.team}</strong></p>
                </div>
    </div>)
}

export default ProfileInfo;