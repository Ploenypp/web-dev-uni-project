import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Comment from "./Comment.jsx";
import NewReply from './NewReply.jsx';
import "../styles/Post.css";

// profile pictures 
import tmp_pfp from "../assets/tmp_pfp.png";
import xemnas from "../assets/profile_pics/xemnas.png";
import xigbar from "../assets/profile_pics/xigbar.png";
import xaldin from "../assets/profile_pics/xaldin.png";
import vexen from "../assets/profile_pics/vexen.png";
import lexaeus from "../assets/profile_pics/lexaeus.png";
import zexion from "../assets/profile_pics/zexion.png";
import saix from "../assets/profile_pics/saix.png";
import axel from "../assets/profile_pics/axel.png";
import demyx from "../assets/profile_pics/demyx.png";
import luxord from "../assets/profile_pics/luxord.png";
import marluxia from "../assets/profile_pics/marluxia.png";
import larxene from "../assets/profile_pics/larxene.png";
import roxas from "../assets/profile_pics/roxas.png";
import xion from "../assets/profile_pics/xion.png";
import msg_pfp from "../assets/msg_pfp.png";

function Post(props) {
    const currentUserID = props.currentUserID;
    const postID = props.postID;
    const userID = props.userID;
    const OGdate = new Date(props.timestamp).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
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
            .catch(err => console.error("Error fetching comments", err)); 
        }
    }, [comments]);

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
    };

    const navigate = useNavigate();
    const handleToUser = async () => {
        if (!userID) { return; }
        if (userID === currentUserID) { 
            navigate('/profile');
            return ;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/user/visit', { userID }, { withCredentials: true });
            //alert(response.data.message);
            navigate('/user');
        } catch(err) {
            console.error("visit failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const pfp = (name) => {
        if (name === "Xemnas Xehanort") { return xemnas; }
        if (name === "Xigbar Braig") { return xigbar; }
        if (name === "Xaldin Dilan") { return xaldin; }
        if (name === "Vexen Even") { return vexen; }
        if (name === "Lexaeus Aeleus") { return lexaeus; }
        if (name === "Zexion Ienzo") { return zexion; }
        if (name === "Saix Isa") { return saix; }
        if (name === "Axel Lea") { return axel; }
        if (name === "Demyx Medy") { return demyx; }
        if (name === "Luxord Rodul") { return luxord; }
        if (name === "Marluxia Lauriam") { return marluxia; }
        if (name === "Larxene Elrena") { return larxene; }
        if (name === "Roxas Sora") { return roxas; }
        if (name === "Xion Noi") { return xion; }
        return msg_pfp;
    };

    const [showExtra, setShowExtra] = useState(false);
    const toggleExtra = () => {
        setShowExtra(!showExtra);
        if (showConfirmDel) { setShowConfirmDel(false); }
        if(showEdit) { setShowEdit(false); }
    };

    const allowModif = currentUserID === userID;
    const [showEdit, setShowEdit] = useState(false);
    const toggleEdit = () => { setShowEdit(!showEdit); }
    const [edit, getEdit] = useState(props.content);
    const handleConfirmEdit = async() => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/posts/edit-post/${postID}`, { edit }, { withCredentials: true });
            //alert(response.data.message);
            toggleEdit();
        } catch(err) {
            console.error("edit failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleExtra();
    }

    const [showConfirmDel, setShowConfirmDel] = useState(false);
    const toggleConfirmDel = () => {
        setShowConfirmDel(!showConfirmDel);
    };
    const handleDelete = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/posts/delete-post', { postID }, { withCredentials: true });
            //alert(response.data.message);
        } catch(err) {
            console.error("visit failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleExtra();
    };

    const [alreadyFlagged, setAlreadyFlagged] = useState(false);
    const updateFlaggedState = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/posts/get-flagged/${currentUserID}/${postID}`, { credentials: 'include' });
            const data = await response.json();
            setAlreadyFlagged(data);
        } catch(err) {
            console.error("Error updating flag info", err);
        }
    };
    useEffect(() => {
        updateFlaggedState();
    },[alreadyFlagged]);

    const handleFlag = async () => {
        if (alreadyFlagged) {
            try {
                const response = await axios.post('http://localhost:8000/api/posts/unflag-post', { postID }, { withCredentials: true });
                //alert(response.data.message);
            } catch(err) {
                console.error("unfailed failed", err.response?.data?.message || err.message);
                alert(err.response?.data?.message || "Something went wrong");
            }
        } else {
            try {
                const response = await axios.post('http://localhost:8000/api/posts/flag-post', { postID }, { withCredentials: true });
                //alert(response.data.message);
            } catch(err) {
                console.error("flagging failed", err.response?.data?.message || err.message);
                alert(err.response?.data?.message || "Something went wrong");
            }
        }
        updateFlaggedState();
        toggleExtra();
    };

    return(<div className="Post">
        <div id="post_head">
            <div id="post_top">
                <div id="post_title">{props.title}</div>
                <div id="post_extra">
                    {showExtra && (<div>
                        {allowModif && (<div id="user_extra_btns">
                            {!showConfirmDel && (<button id="del_post" type="button" onClick={toggleConfirmDel}>⌦</button>)}
                            
                            {showConfirmDel &&(<button id="confirm_del_post" type="button" onClick={handleDelete}>⌦</button>)}
                            
                            {showConfirmDel && (<button id="rev_del_post" type="button" onClick={toggleConfirmDel}>↩︎</button>)}
                            
                            <button id="edit_post" type="button" onClick={toggleEdit}>✎</button>
                        </div>)}

                        {!allowModif && (<button className={`flag_post_btn ${alreadyFlagged}`} type="button" onClick={handleFlag}>{!alreadyFlagged ? ("⚐") : ("⚑")}</button>)}
                    </div>)}
    
                    <button className={`extra_post_btn ${showExtra}`}type="button" onClick={toggleExtra}>⋯</button>
                </div>
            </div>
            <div id="post_info">
                <button id="author_btn" type="button" onClick={handleToUser}><img id="post_pfp" src={pfp(props.author)} alt="msg_pfp"/> {props.author}</button> 
                {!props.edited ? (`${OGdate}`) : (<div>
                    modifié : {new Date(props.editDate).toLocaleString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric',minute: 'numeric', hour12: false})} |
                    publié : {new Date(props.timestamp).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric',
                    })}
                </div>)}
            </div>
        </div>
        <div id="post_content">{ formatText(props.content) }</div>
        { showEdit && (<div id="write-edit">
            modifier votre publication
            <textarea id="write-edit-content" type="text" onChange={(evt) => getEdit(evt.target.value)} value={edit}></textarea>
            <button id="confirm-edit-btn" type="button" onClick={handleConfirmEdit}>confirmer la modification</button>
        </div>)}
        <div id="post_btns">
            <NewReply parentPostID={postID} />
            
            { comments.length > 0 ? (<button id="show_thread" type="button" onClick={toggleThread}>{threadBtnText}</button>) : <button id="no_comment" type="button">pas de commentaire</button> }
        </div>
        { showThread && (
            <div className="thread">
                { comments.map((comment,index) => (
                    <Comment 
                    key={index}
                    currentUserID={currentUserID}
                    userID={comment.userID}
                    author={comment.author}
                    timestamp={comment.timestamp}
                    content={comment.content} />
                )) }
            </div>
        )}
    </div>)
}

export default Post;