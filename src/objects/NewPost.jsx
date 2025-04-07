import {useState, useEffect, useRef} from 'react';

import "../styles/NewPost.css";

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

    return(<div className="NewPost">
        <input id="write-title" type="text" onChange={getTitle} placeholder="titre..."/>
        <textarea id="write-content" type="text" onChange={getContent} placeholder="écrivez..."></textarea>
        <button id="post_btn" type="button">publier</button>
    </div>)
    
}

export default NewPost;
