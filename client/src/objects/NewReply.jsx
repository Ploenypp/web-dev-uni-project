import {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import "../styles/NewReply.css";

function NewReply(props) {
    const parentPostID = props.parentPostID;

    const [content, setContent] = useState("");
    const getContent = (evt) => { setContent(evt.target.value); }


    useEffect(() => {
        console.log(content);
        console.log(parentPostID);
    }, [content, parentPostID]);

    const handleComment = async () => {
        if (!content.trim()) {
            alert("Pas possible de publier un commentaire vide");
            return ;
        }
        
        try {
            const response = await axios.post('http://localhost:8000/api/posts/newcomment', {
                parentPostID, 
                content 
            }, { withCredentials: true });

            alert(response.data.message);
            setShowReplyDraft(false);
            setReplyBtnText("répondre");

        } catch(error) {
            console.error("Publication failed:", error.response?.data?.message || error.message);
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

    return(<div className="NewReply">
        {! showReplyDraft && (<button id="reply_post" type="button" onClick={toggleReplyDraft}>{replyBtnText}</button>)}

        { showReplyDraft && (<div id="newreply-draft">
            <textarea id="write-content-reply" type="text" placeholder="répondre..." onChange={getContent}></textarea>
            <div id="reply-btns">
                <button id="reply_btn" type="button" onClick={handleComment}>publier</button>
                <button id="cancel-reply-btn" type="button" onClick={toggleReplyDraft}>annuler</button>
            </div>
        </div>)}
    </div>)
    
}
export default NewReply;
