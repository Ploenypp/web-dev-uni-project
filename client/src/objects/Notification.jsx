import { useState, useEffect } from 'react';

import axios from 'axios';

function Notification(props) {
    const notifID = props.notifID;
    
    const handleBtn = async() => {
        try {
            await axios.delete(`http://localhost:8000/api/users/delete-notification/${notifID}`, { withCredentials: true });
        } catch(err) {
            console.error("error deleting notification", err.response?.data?.message || err.message);
            (err.response?.data?.message || "Something went wrong");
        }
    };

    const [showBody, setShowBody] = useState(false)
    const toggleBody = () => { setShowBody(!showBody); }

    const formatText = (text) => {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };
    
    return(<div className="Notification">
        <div id="notif_head">
            <button className={`notif_subject ${showBody}`} type="button" onClick={toggleBody}>{props.subject}</button>

            { showBody && (<button id="del_notif_btn" type="button" onClick={handleBtn}>✕</button>)}
        </div>
        { (showBody && props.body ) && (<div id="notif_body">{ formatText(props.body) }</div>) }
    </div>)
}

export default Notification;