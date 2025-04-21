import {useState, useEffect, useRef} from 'react';
import "../styles/ProfilePage.css";

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

function ProfileInfo(props) {
    const pfp = (name) => {
        if (name === "Xemnas") { return xemnas; }
        if (name === "Xigbar") { return xigbar; }
        if (name === "Xaldin") { return xaldin; }
        if (name === "Vexen") { return vexen; }
        if (name === "Lexaeus") { return lexaeus; }
        if (name === "Zexion") { return zexion; }
        if (name === "Saix") { return saix; }
        if (name === "Axel") { return axel; }
        if (name === "Demyx") { return demyx; }
        if (name === "Luxord") { return luxord; }
        if (name === "Marluxia") { return marluxia; }
        if (name === "Larxene") { return larxene; }
        if (name === "Roxas") { return roxas; }
        if (name === "Xion") { return xion; }
        return tmp_pfp;
    }

    const date = new Date(props.dob);
    const readableDate = date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return(<div className="ProfileInfo">
        <img src={pfp(props.fstname)} id="profile_pic" alt="profile picture"/>
                <div id="profile_text">
                    <strong>{props.fstname} {props.surname}</strong>
                    <div id="p_profile">
                        <div>Né(e) : <strong>{readableDate}</strong></div>
                        <div>Status : <strong>{props.status}</strong></div>
                        <div>Équipe(s) : <strong>{props.team}</strong></div>
                    </div>
                </div>
    </div>)
}

export default ProfileInfo;