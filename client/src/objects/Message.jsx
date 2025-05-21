import { useState, useEffect, useRef } from 'react';

import "../styles/Message.css";

function Message(props) {

    const msg_type = props.type;

    return(<div className={`Message ${props.type}`}>
        {msg_type === "other" && (<div className="msg_header"><img id="msg_pfp" src={`http://localhost:8000/api/images/load_pfp/${props.userID}?t=${Date.now()}`} alt="msg_pfp"/></div>)}
        
        <div className={`msg_content ${props.type}`}>{props.content}</div>
    </div>)
}

export default Message;