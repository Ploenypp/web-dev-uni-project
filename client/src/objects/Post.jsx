import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Comment from "./Comment.jsx";
import NewReply from './NewReply.jsx';
import "../styles/Post.css";

function Post(props) {
    const postID = props.postID;
    const userID = props.userID;
    const date = new Date(props.timestamp);
    const readableDate = date.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    const formatText = (text) => {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (postID) {
        fetch(`http://localhost:8000/api/posts/comments?parentPostID=${postID.toString()}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) { setComments(data); }
                else { setComments([]); }
            })
            .catch(err => console.error("Error fetching comments", err)
        ); }
    }, []);

    useEffect(() => {
        if (comments.length > 0) { console.log(comments); }
    },[comments])

    const [showThread, setShowThread] = useState(false);

    const [threadBtnText, setThreadBtnText] = useState("afficher la discussion")

    const toggleThread = () => {
        if (showThread) {
            setShowThread(false);
            setThreadBtnText("afficher la discussion");
        } else {
            setShowThread(true);
            setThreadBtnText("masquer la discussion");
        }
        console.log(showThread);
    }

    const navigate = useNavigate();

    const handleToUser = async () => {
        console.log(userID);
        try {
            const response = await axios.post('http://localhost:8000/api/user/visit', { userID }, { withCredentials: true });
            alert(response.data.message);
            navigate('/user');
        } catch(err) {
            console.error("visit failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    }

    return(<div className="Post">
        <div id="post_head">
            <div id="post_title"><strong>{props.title}</strong></div>
            <div id="post_info">
                <button id="author_btn" type="button" onClick={handleToUser}>{props.author}</button> 
                {readableDate}
            </div>
        </div>
        <div id="post_content">
            { formatText(props.content) }
        </div>
        <div id="post-btns">
        <NewReply parentPostID={postID}/>
        { comments.length > 0 ? (<button id="show_thread" type="button" onClick={toggleThread}>{threadBtnText}</button>) : <button id="no_comment" type="button">pas de commentaire</button> }
        { showThread && (
            <div className="thread">
                { comments.map((comment,index) => (
                    <Comment 
                    key={index}
                    userID={comment.userID}
                    author={comment.author}
                    timestamp={comment.timestamp}
                    content={comment.content} />
                )) }
            </div>
        ) }
        </div>
    </div>)
}

export default Post;