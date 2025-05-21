import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../styles/Requests.css";

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

    return(<div className="Request">
        <img src={`http://localhost:8000/api/images/load_pfp/${friendID}?t=${Date.now()}`} id="req_pfp" alt="profile picture"/>
        <p> {props.fst_name} {props.surname}</p>
        <div id="req_btns">
            <button id="accept" type="button" onClick={handleAccept}>✓</button>
            <button id="reject" type="button" onClick={handleReject}>X</button>
        </div>
    </div>)
}

export default Request;