import {useState, useEffect, useRef} from 'react';

import "../styles/NewReply.css";

function NewReply() {
    return(<div className="NewReply">
        <input id="write-title" type="text" placeholder="titre..."/>
        <input id="write-content" type="text" placeholder="écrivez..."/>
        <button id="writebtn" type="button">publier</button>
    </div>)
    
}

export default NewReply;
