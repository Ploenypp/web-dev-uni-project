import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Comment from "./Comment.jsx";
import NewReply from './NewReply.jsx';
import "../styles/Post.css";

// publication dans le forum général
function Post(props) {
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

    // récupérer les commentaires de la publication
    const [comments, setComments] = useState([]);
    useEffect(() => {
        if (postID) {
        fetch(`http://localhost:8000/api/posts/comments/${postID}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error("error fetching comments :", err)); 
        }
    }, [comments]);

    // basculer l'affichage des commentaires 
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

    // naviguer à la page de profile de l'auteur
    const navigate = useNavigate();
    const handleToUser = async () => {
        const names = author.split(" ");
        navigate(`/profile/${names[0]}_${names[1]}`);
        window.location.reload();
    };

    // basculer l'affichage des boutons de fonctionnalités supplementaires
    const [showExtra, setShowExtra] = useState(false);
    const toggleExtra = () => {
        setShowExtra(!showExtra);
        if (showConfirmDel) { setShowConfirmDel(false); }
        if(showEdit) { setShowEdit(false); }
    };

    // basculer l'affichage du bouton de modfication de la publication
    const allowModif = currentUserID === userID;
    const [showEdit, setShowEdit] = useState(false);
    const toggleEdit = () => { setShowEdit(!showEdit); }

    // modifier la publication
    const [edit, getEdit] = useState(props.content);
    const handleConfirmEdit = async() => {
        try {
            await axios.patch(`http://localhost:8000/api/posts/edit-post/${postID}`, { edit }, { withCredentials: true });
            toggleEdit();
        } catch(err) {
            console.error("error editing post :", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleExtra();
        window.location.reload();
    };

    // basculer l'affichage du bouton de suppresion de la publication 
    const [showConfirmDel, setShowConfirmDel] = useState(false);
    const toggleConfirmDel = () => { setShowConfirmDel(!showConfirmDel); };

    // supprimer la publication
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/posts/delete-post/${postID}`, { withCredentials: true });
        } catch(err) {
            console.error("error deleting post :", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleExtra();
    };

    // mettre à jour le statut de signalisation par l'utilisateur
    const [alreadyFlagged, setAlreadyFlagged] = useState(false);
    const updateFlaggedState = async () => {
        await fetch(`http://localhost:8000/api/posts/check-flagged/${postID}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setAlreadyFlagged(data))
            .catch(err => console.error("error updating flagged status :", err));
    };
    useEffect(() => { updateFlaggedState(); },[alreadyFlagged]);
    
    const handleFlag = async () => {
        if (alreadyFlagged) { // retirer la signalisation
            try {
                await axios.post(`http://localhost:8000/api/posts/unflag-post/${postID}`, {}, { withCredentials: true });
            } catch(err) {
                console.error("error flagging post :", err.response?.data?.message || err.message);
                alert(err.response?.data?.message || "Something went wrong");
            }
        } else { // signaler la publication
            try {
                await axios.post(`http://localhost:8000/api/posts/flag-post/${postID}`, {}, { withCredentials: true });
            } catch(err) {
                console.error("error reporting post :", err.response?.data?.message || err.message);
                alert(err.response?.data?.message || "Something went wrong");
            }
        }
        updateFlaggedState(); // mettre à jour le statut
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
                {userID ? (<button id="author_btn" type="button" onClick={handleToUser}><img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="post_pfp" alt="profile picture" /> {author}</button> ) : (<div id="deleted_user"><img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="post_pfp" alt="profile picture" /> {author}</div>)}
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