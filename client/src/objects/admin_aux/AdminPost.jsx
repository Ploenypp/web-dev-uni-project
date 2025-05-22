import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import AdminComment from "./AdminComment.jsx";
import NewAdminComment from "./NewAdminComment.jsx";
import "../../styles/Post.css";
import "../../styles/Admin.css";

function AdminPost(props) {
    const currentUserID = props.currentUserID;
    const postID = props.postID;
    const userID = props.userID;
    const author = props.author;
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
        fetch(`http://localhost:8000/api/posts/comments/${postID}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error("error fetching comments :", err)); 
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
        const names = author.split(" ");
        navigate(`/profile/${names[0]}_${names[1]}`);
        window.location.reload();
    };

    const [showExtra, setShowExtra] = useState(false);
    const toggleExtra = () => {
        setShowExtra(!showExtra);
        if (showConfirmDel) { setShowConfirmDel(false); }
    };

    const allowModif = currentUserID === userID;
    const [showEdit, setShowEdit] = useState(false);
    const toggleEdit = () => { setShowEdit(!showEdit); }
    const [edit, getEdit] = useState(props.content);
    const handleConfirmEdit = async() => {
        try {
            await axios.patch(`http://localhost:8000/api/admin/edit-post/${postID}`, { edit }, { withCredentials: true });
            toggleEdit();
        } catch(err) {
            console.error("error editing post :", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleEdit();
        toggleExtra();
    }

    const [showConfirmDel, setShowConfirmDel] = useState(false);
    const toggleConfirmDel = () => { setShowConfirmDel(!showConfirmDel); };
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/delete-post/${postID}`, { withCredentials: true });
        } catch(err) {
            console.error("error deleting post :", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleExtra();
    };

    const [alreadyFlagged, setAlreadyFlagged] = useState(false);
    const updateFlaggedState = async () => {
        await fetch(`http://localhost:8000/api/posts/check-flagged/${postID}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setAlreadyFlagged(data))
            .catch(err => console.error("error updating flagged status :", err));
    };
    useEffect(() => { updateFlaggedState(); },[alreadyFlagged]);

    const handleFlag = async () => {
        if (alreadyFlagged) {
            try {
                await axios.post(`http://localhost:8000/api/posts/unflag-post/${postID}`, { withCredentials: true });
            } catch(err) {
                console.error("error flagging post :", err.response?.data?.message || err.message);
                alert(err.response?.data?.message || "Something went wrong");
            }
        } else {
            try {
                await axios.post(`http://localhost:8000/api/admin/flag-post/${postID}`, { withCredentials: true });
            } catch(err) {
                console.error("error reporting post :", err.response?.data?.message || err.message);
                alert(err.response?.data?.message || "Something went wrong");
            }
        }
        updateFlaggedState();
        toggleExtra();
    };

    return(<div className="AdminPost">
        <div id="adminpost_head">
            <div id="post_top">
                <div id="post_title">{props.title}</div>
                <div id="post_extra">
                    {showExtra && (<div>
                        {allowModif && (<div id="user_extra_btns">
                            {!showConfirmDel && (<button id="del_adminpost" type="button" onClick={toggleConfirmDel}>⌦</button>)}
                            
                            {showConfirmDel &&(<button id="confirm_del_post" type="button" onClick={handleDelete}>⌦</button>)}
                            
                            {showConfirmDel && (<button id="rev_del_adminpost" type="button" onClick={toggleConfirmDel}>↩︎</button>)}
                            
                            <button id="edit_adminpost" type="button" onClick={toggleEdit}>✎</button>
                        </div>)}

                        {!allowModif && (<button className={`flag_adminpost_btn ${alreadyFlagged}`} type="button" onClick={handleFlag}>{!alreadyFlagged ? ("⚐") : ("⚑")}</button>)}
                    </div>)}
    
                    <button className={`extra_adminpost_btn ${showExtra}`}type="button" onClick={toggleExtra}>⋯</button>
                </div>
            </div>
            <div id="admin_post_info">
                {props.userID ? (<button id="admin_author_btn" type="button" onClick={handleToUser}><img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="post_pfp" alt="profile picture" /> {author}</button> ) : (<div id="deleted_user"><img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="post_pfp" alt="profile picture" /> {author}</div>)}
                {!props.edited ? (`${OGdate}`) : (<div>
                    modifié : {new Date(props.editDate).toLocaleString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric',minute: 'numeric', hour12: false})} |
                    publié : {new Date(props.timestamp).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric',
                    })}
                </div>)}
            </div>
        </div>
        <div id="post_content">{ formatText(props.content) }</div>
        { showEdit && (<div id="write-admin-edit">
            modifier votre publication
            <textarea id="write-admin-edit-content" type="text" onChange={(evt) => getEdit(evt.target.value)} value={edit}></textarea>
            <button id="confirm-admin-edit-btn" type="button" onClick={handleConfirmEdit}>confirmer la modification</button>
        </div>)}
        <div id="adminpost_btns">
            <NewAdminComment parentPostID={postID} />
            
            { comments.length > 0 ? (<button id="show_adminthread" type="button" onClick={toggleThread}>{threadBtnText}</button>) : <button id="no_comment" type="button">pas de commentaire</button> }
        </div>
        { showThread && (
            <div className="adminthread">
                { comments.map((comment,index) => (
                    <AdminComment 
                    key={index}
                    userID={comment.userID}
                    author={comment.author}
                    timestamp={comment.timestamp}
                    content={comment.content} />
                )) }
            </div>
        )}
    </div>)
}

export default AdminPost;