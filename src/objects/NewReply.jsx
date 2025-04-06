import {useState, useEffect, useRef} from 'react';

import "../styles/NewReply.css";

function NewReply() {
    return(<div className="NewReply">
        <textarea id="write-content" type="text" placeholder="répondre..."></textarea>
        <button id="writebtn" type="button">publier</button>
    </div>)
    
}
export default NewReply;
