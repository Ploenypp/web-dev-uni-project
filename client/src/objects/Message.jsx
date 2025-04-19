import { useState, useEffect, useRef } from 'react';

import "../styles/Message.css";

function Message(props) {

    const msg_type = props.type;

    return(<div className={`Message ${props.type}`}>
        {msg_type === "other" && (<div className="msg_header"><img id="msg_pfp" src={props.pfp} alt="msg_pfp"/></div>)}
        
        <div className={`msg_content ${props.type}`}>{props.content}</div>
    </div>)
}

export default Message;