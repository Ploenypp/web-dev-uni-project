import { useState, useEffect, useRef } from 'react';
import "../styles/NewPost.css";

import axios from 'axios';

function NewPost() {
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
    };

    const [title, setTitle] = useState("");
    const getTitle = (evt) => { setTitle(evt.target.value); }
    const [content, setContent] = useState("");
    const getContent = (evt) => { setContent(evt.target.value); }

    const handlePublish = async () => {
        try {
            await axios.post('http://localhost:8000/api/posts/new-post', {
                title,
                content
            }, { withCredentials: true });
            setShowWrite(false);
            setWriteBtnText("ouvrir une nouvelle discussion");
        } catch(err) {
            console.error("error publishing :", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="NewPost">
        <button className={`togglewritebtn ${!showWrite}`}type="button" onClick = {toggleShowWrite}>{writeBtnText}</button>

        {showWrite && (<div id="write-post">
            <input id="write-title" type="text" onChange={getTitle} placeholder="titre..."/>
            <textarea id="write-content-post" type="text" onChange={getContent} placeholder="écrivez..."></textarea>
            <button id="post_btn" type="button" onClick={handlePublish}>publier</button>
        </div>)}
    </div>)
}

export default NewPost;
