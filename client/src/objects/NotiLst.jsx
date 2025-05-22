import { useState, useEffect } from 'react';

import Notification from "./Notification.jsx";
import "../styles/Notification.css";

function NotiLst() {
    const [showNotifs, setShowNotifs] = useState(false);
    const toggleNotifs = () => { setShowNotifs(!showNotifs); }

    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8000/api/users/get-notifications/`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setNotifications(data))
            .catch(err => console.error("Error fetching notifications", err));
    }, [notifications]);

    return(<div className="NotiLst">
        <button id="noti_btn" type="button" onClick={toggleNotifs}>Notifications</button>
        { showNotifs && (<div id="noti_lst">
        {Array.isArray(notifications) && notifications.length > 0 ?
            (notifications.map((notif,index) => <Notification 
                key={index}
                notifID={notif._id}
                subject={notif.subject}
                body={notif.body} />)
            ) : (<div id="no_notifs">pas de notifications</div>)
        }
        </div>) }
    </div>)
}

export default NotiLst;