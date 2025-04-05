import {useState, useEffect, useRef} from 'react';

import tmp_pfp from "../assets/tmp_pfp.png";
import "../styles/ProfilePage.css";
import Ribbon from "../objects/Ribbon.jsx";

function ProfilePage() {
    return(<div className="ProfilePage">
        <Ribbon />
        <div id="profile_sidebar">
            <img src={tmp_pfp} id="profile_pic" alt="profile picture"/>
            <div id="profile_text">
                <p>Prénom : <strong>Axelle</strong> </p> 
                <p>Nom : <strong>Delacroix</strong></p>
                <p>Date de naissance : <strong>28 March 2002</strong> </p> 
            </div>
            <div id="profile_text">
                <p>Rôle : <strong>KeyBlade Wielder</strong> </p> 
                <p>Équipe(s) : <strong>Heart Collection</strong></p>
            </div>
            <div id="profile_text">
                <p>Intérêts : <strong>KeyBlade Wielder</strong> </p> 
                <p>Équipe(s) : <strong>Heart Collection</strong></p>
            </div>
        </div>
    </div>)

}

export default ProfilePage;