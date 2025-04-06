import {useState, useEffect, useRef} from 'react';

import "../styles/Post.css";

function Post(props) {

    return(<div className="Post">
        <div>
            <div id="post_title"><strong>{props.title}</strong></div>
            <div id="post_info">
                {props.author}, {props.timestamp}
            </div>
        </div>
        <div id="post_content">
            {props.content}
        </div>
        <div id="post_buttons">
            <button id="reply_post" type="button">répondre</button>
            <button id="show_thread" type="button">afficher le fil de discussion</button>
        </div>
    </div>)
}

export default Post;