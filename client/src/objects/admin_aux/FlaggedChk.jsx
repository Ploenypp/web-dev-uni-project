import { useState } from 'react';
import axios from 'axios';

// "carte" qui contient le contenu d'une publication signalée et qui permet à un administrateur de la restauter ou de la supprimer
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

    // afficher la zone de texte pour l'avertissement
    const [show, setShow] = useState(false);
    const toggleShow = () => {
        setShow(!show);
        setWriteWarning(false);
    }

    // écrire un avertissement à l'auteur au cas où la publication est supprimé
    const [writeWarning, setWriteWarning] = useState(false);
    const toggleWriteWarning = () => { setWriteWarning(!writeWarning); }
    const [warning, setWarning] = useState("");
    const getContent = (evt) => { setWarning(evt.target.value); }

    // supprimer la publication signalée
    const handleDelete = async() => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/delete-flagged-post/${postID}/${authorID}`, { 
                params: { postTitle, warning },
                withCredentials: true 
            });
        } catch(err) {
            console.error("flagged post deletion failed", err.resopnse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        setWriteWarning(false);
        setWarning("");
        toggleShow();
    };

    // restaurer la publication signalée
    const handleRestore = async() => {
        try {
            await axios.post(`http://localhost:8000/api/admin/restore-flagged-post/${postID}/${authorID}`, { postTitle }, { withCredentials: true });
        } catch(err) {
            console.error("flagged post deletion failed", err.resopnse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleShow();
    };

    return(<div className="FlaggedChk">
        <div id="flagged_post_container">
            <button id="flagged_head" type="button" onClick={toggleShow}>
                <div id="flagged_count">{props.reports}</div>
                <div id="flagged_info">
                    <div>{postTitle}</div>
                    <div><i>{props.author}</i></div>
                </div>
            </button>

            {show && (<div id="flagged_content">{formatText(props.content)}</div>)}
        </div>

        {show && (<div id="flagged_btns">
            <button id="restore_flagged_btn" type="button" onClick={handleRestore}>↩</button>

            { authorID ? 
                (<button className={`del_flagged_btn ${writeWarning}`} type="button" onClick={toggleWriteWarning}> 
                {!writeWarning ? 
                    (<div>⌦</div>) : 
                    (<div>↪</div>)}</button>) :
            
                (<button className={`del_flagged_btn ${writeWarning}`} type="button" onClick={handleDelete}>⌦</button>) }
        </div>)}

        {writeWarning && (<div id="flagged_warning">
            <textarea id="write-warning" type="text" onChange={getContent} placeholder="écrivez un avertissement..."></textarea>

            <button id="del_alert_flagged_btn" type="button" onClick={handleDelete}>supprimer la publication + envoyer l'avertissement à {props.author}</button>
        </div>)}
        
    </div>)
}

export default FlaggedChk;