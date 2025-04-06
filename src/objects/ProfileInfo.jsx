import {useState, useEffect, useRef} from 'react';

import tmp_pfp from "../assets/tmp_pfp.png";
import "../styles/ProfilePage.css";

function ProfileInfo() {
    return(<div className="ProfileInfo">
        <img src={tmp_pfp} id="profile_pic" alt="profile picture"/>
                <div id="profile_text">
                    <p>Prénom : <strong>Axelle</strong> </p> 
                    <p>Nom : <strong>Delacroix</strong></p>
                    <p>Date de naissance : <strong>28 March 2002</strong> </p> 
                    <p>Rôle : <strong>KeyBlade Wielder</strong> </p> 
                    <p>Équipe(s) : <strong>Heart Collection</strong></p>
                    <p>Intérêts : <strong>Music</strong> </p>
                </div>
                <button id="profile_edit" type="button">modifier</button>
    </div>)
}

export default ProfileInfo;