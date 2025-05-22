import {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import "../../styles/NewReply.css";
import "../../styles/Admin.css";

function NewAdminComment(props) {
    const parentPostID = props.parentPostID;

    const [content, setContent] = useState("");
    const getContent = (evt) => { setContent(evt.target.value); }

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

    return(<div className="NewAdminComment">
        <button id="admincomment_btn" type="button" onClick={toggleReplyDraft}>{replyBtnText}</button>

        { showReplyDraft && (<div id="new-admincomment-draft">
            <textarea id="write-admin-comment" type="text" placeholder="répondre..." onChange={getContent}></textarea>
            <div id="admincomment-btns">
                <button id="admincomment_btn" type="button" onClick={handleComment}>publier</button>
            </div>
        </div>)}
    </div>)
    
}
export default NewAdminComment;
