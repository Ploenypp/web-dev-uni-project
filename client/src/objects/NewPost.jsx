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
        console.log(showWrite);
    }

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const getTitle = (evt) => { setTitle(evt.target.value); }
    const getContent = (evt) => { setContent(evt.target.value); }

    useEffect(() => {
        console.log(`
        title: ${title}
        content: ${content}
        `)
    },[title,content]);

    const handlePublish = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/posts/newpost', {
                title,
                content
            }, { withCredentials: true });

            //alert(response.data.message);
            setShowWrite(false)
            setWriteBtnText("ouvrir une nouvelle discussion");


        } catch(error) {
            console.error("Publication failed:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
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
