import { useState, useEffect, useRef } from 'react';

import "../styles/Message.css";

function Message(props) {
    return(<div className="Message">
        <div id="msg_header">
            <img id="msg_pfp" src={props.pfp} alt="msg_pfp"/>
            {props.author}
        </div>
        <div id="msg_content">{props.content}</div>
    </div>)
}

export default Message;