import { useState } from 'react';
import axios from 'axios';

import "../styles/NewReply.css";

// composant qui permet de publier une nouvelle commentaire à une publication dans le forum général
function NewReply(props) {
    const parentPostID = props.parentPostID;

    // récupérer le brouillon de la commentaire
    const [content, setContent] = useState("");
    const getContent = (evt) => { setContent(evt.target.value); }

    // publier la commentaire
    const handleComment = async () => {
        if (!content.trim()) {
            alert("Pas possible de publier un commentaire vide");
            return ;
        }
        try {
            await axios.post(`http://localhost:8000/api/posts/new-comment/${parentPostID}`, { content }, { withCredentials: true });
            setShowReplyDraft(false);
            setReplyBtnText("répondre");
        } catch(error) {
            console.error("error publishing comment :", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    // basculer la zone d'écriture
    const [showReplyDraft, setShowReplyDraft] = useState(false);
    const [replyBtnText, setReplyBtnText] = useState("répondre");
    const toggleReplyDraft = () => {
        if (showReplyDraft) {
            setShowReplyDraft(false);
            setReplyBtnText("répondre");
        } else {
            setShowReplyDraft(true);
            setReplyBtnText("annuler");
        }
    }

    return(<div className="NewReply">
        <button id="reply_post" type="button" onClick={toggleReplyDraft}>{replyBtnText}</button>

        { showReplyDraft && (<div id="newreply-draft">
            <textarea id="write-content-reply" type="text" placeholder="répondre..." onChange={getContent}></textarea>
            <div id="reply-btns">
                <button id="reply_btn" type="button" onClick={handleComment}>publier</button>
            </div>
        </div>)}
    </div>)
    
}
export default NewReply;
