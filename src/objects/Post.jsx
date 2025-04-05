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
    </div>)
}

export default Post;