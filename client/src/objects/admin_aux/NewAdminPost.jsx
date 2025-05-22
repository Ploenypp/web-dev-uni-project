import { useState, useEffect, useRef } from 'react';
import "../../styles/Admin.css";

import axios from 'axios';

function NewAdminPost() {
    const [showWrite, setShowWrite] = useState(false);
    const [writeBtnText, setWriteBtnText] = useState("ouvrir une nouvelle discussion");
    const toggleShowWrite = () => {
        if (showWrite) {
            setShowWrite(false)
            setWriteBtnText("ouvrir une nouvelle discussion");
            
        } else {
            setShowWrite(true)
            setWriteBtnText("annuler");
        }
        console.log(showWrite);
    }

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const getTitle = (evt) => { setTitle(evt.target.value); }
    const getContent = (evt) => { setContent(evt.target.value); }

    const handlePublish = async () => {
        try {
            await axios.post('http://localhost:8000/api/admin/new-post', { title, content }, { withCredentials: true });
            setShowWrite(false);
            setWriteBtnText("ouvrir une nouvelle discussion");
        } catch(err) {
            console.error("error publishing post", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        window.location.reload();
    };

    return(<div className="NewAdminPost">
        <button className={`toggle-writeadmin-btn ${!showWrite}`}type="button" onClick = {toggleShowWrite}>{writeBtnText}</button>

        {showWrite && (<div id="write-admin-post">
            <input id="write-admin-title" type="text" onChange={getTitle} placeholder="titre..."/>
            <textarea id="write-admin-content-post" type="text" onChange={getContent} placeholder="écrivez..."></textarea>
            <button id="adminpost_btn" type="button" onClick={handlePublish}>publier</button>
        </div>)}
    </div>)
    
}

export default NewAdminPost;
