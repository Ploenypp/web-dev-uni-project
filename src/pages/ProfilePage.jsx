import {useState, useEffect, useRef} from 'react';

import tmp_pfp from "../assets/tmp_pfp.png";
import "../styles/ProfilePage.css";
import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx"

function ProfilePage() {
    return(<div className="ProfilePage">
        <Ribbon />
        <div id="pf_container">
            <div id="profile_sidebar">
                <img src={tmp_pfp} id="profile_pic" alt="profile picture"/>
                <div id="profile_text">
                    <p>Prénom : <strong>Axelle</strong> </p> 
                    <p>Nom : <strong>Delacroix</strong></p>
                    <p>Date de naissance : <strong>28 March 2002</strong> </p> 
                    <p>Rôle : <strong>KeyBlade Wielder</strong> </p> 
                    <p>Équipe(s) : <strong>Heart Collection</strong></p>
                    <p>Intérêts : <strong>Music</strong> </p>
                </div>
                <button id="edit" type="button">Modifier</button>
            </div>
            <div className="profile_search">
                <Searchbar />
            </div>
            <div className="profile_posts">
                
            </div>
        </div>
    </div>)

}

export default ProfilePage;