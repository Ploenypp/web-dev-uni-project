import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function FlaggedChk(props) {
    const postID = props.postID;
    const authorID = props.authorID;
    const postTitle = props.title;

    const formatText = (text) => {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    const [show, setShow] = useState(false);
    const toggleShow = () => {
        setShow(!show);
        setWriteWarning(false);
    }

    const [writeWarning, setWriteWarning] = useState(false);
    const toggleWriteWarning = () => { setWriteWarning(!writeWarning); }
    const [warning, setWarning] = useState("");
    const getContent = (evt) => { setWarning(evt.target.value); }

    const handleDelete = async() => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/admin/delete-flagged-post/${postID}/${authorID}`, { 
                params: { postTitle, warning },
                withCredentials: true 
            });
            alert(response.data.message);
        } catch(err) {
            console.error("flagged post deletion failed", err.resopnse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        setWriteWarning(false);
        setWarning("");
        toggleShow();
    }

    return(<div className="FlaggedChk">
        <div id="flagged_post_container">
            <button id="flagged_head" type="button" onClick={toggleShow}>
                <div id="flagged_count">
                    {props.reports}</div>
                <div id="flagged_info">
                    <div>{postTitle}</div>
                    <div><i>{props.author}</i></div>
                </div>
            </button>
            {show && (<div id="flagged_content">{formatText(props.content)}</div>)}
        </div>

        {show && (<div id="flagged_btns">
            <button id="restore_flagged_btn" type="button">↩</button>
            <button className={`del_flagged_btn ${writeWarning}`} type="button" onClick={toggleWriteWarning}>{!writeWarning ? (<div>⌦</div>) : (<div>↪</div>)}</button>
        </div>)}

        {writeWarning && (<div id="flagged_warning">
            <textarea id="write-warning" type="text" onChange={getContent} placeholder="écrivez un avertissement..."></textarea>

            <button id="del_alert_flagged_btn" type="button" onClick={handleDelete}>supprimer la publication + envoyer l'avertissement à {props.author}</button>
        </div>)}
        
    </div>)
}

export default FlaggedChk;