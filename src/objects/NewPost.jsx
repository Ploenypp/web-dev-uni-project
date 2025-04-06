import {useState, useEffect, useRef} from 'react';

import "../styles/NewPost.css";

function NewPost() {
    const [write, setWrite] = useState(false);

    const toggleWrite = () => {
        if (write) {
            setWrite(false)
        } else {
            setWrite(true)
        }
        console.log(write);
    }

    return(<div className="NewPost">
        <input id="write-title" type="text" placeholder="titre..."/>
        <textarea id="write-content" type="text" placeholder="écrivez..."></textarea>
        <button id="post_btn" type="button">publier</button>
    </div>)
    
}

export default NewPost;
