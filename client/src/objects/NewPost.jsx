import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/NewPost.css";

import axios from 'axios';

function NewPost() {
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

    const navigate = useNavigate();

    const handlePublish = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/posts/newpost', {
                title,
                content
            }, { withCredentials: true });

            alert(response.data.message);
            navigate('/dashboard');
        } catch (error) {
            console.error("Publication failed:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="NewPost">
        <input id="write-title" type="text" onChange={getTitle} placeholder="titre..."/>
        <textarea id="write-content" type="text" onChange={getContent} placeholder="écrivez..."></textarea>
        <button id="post_btn" type="button" onClick={handlePublish}>publier</button>
    </div>)
    
}

export default NewPost;
