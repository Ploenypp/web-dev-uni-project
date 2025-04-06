import {useState, useEffect, useRef} from 'react';

import "../styles/NewPost.css";

function NewPost() {
    return(<div className="NewPost">
        <input id="write-title" type="text" placeholder="titre..."/>
        <textarea id="write-content" type="text" placeholder="écrivez..."></textarea>
        <button id="writebtn" type="button">publier</button>
    </div>)
    
}

export default NewPost;
