import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../styles/Requests.css";

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

function Request(props) {
    const friendID = props.senderID;

    const handleAccept = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/user/accept-friend-request', { friendID: friendID }, { withCredentials: true });
            //alert(response.data.message);
        } catch(err) {
            console.error("acceptance failed", err.reponse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleReject = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/user/reject-friend-request', { friendID: friendID }, { withCredentials: true });
            alert(response.data.message);
        } catch(err) {
            console.error("rejection failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    }

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

    return(<div className="Request">
        <img src={pfp(props.fst_name)} id="req_pfp" alt="profile picture"/>
        <p> {props.fst_name} {props.surname}</p>
        <div id="req_btns">
            <button id="accept" type="button" onClick={handleAccept}>✓</button>
            <button id="reject" type="button" onClick={handleReject}>X</button>
        </div>
    </div>)
}

export default Request;