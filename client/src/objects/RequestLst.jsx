import { useState, useEffect, useRef } from 'react';

import Request from "./Request.jsx";
import "../styles/Requests.css";

function RequestLst(props) {
    const friendReqs = props.reqslst;

    const [showRequests, setShowRequests] = useState(false);
    const [reqState, setReqLstState] = useState("hidden");
    const toggleRequests = () => {
        if (showRequests) {
            setReqLstState("furling");
            window.setTimeout(() => {
                setReqLstState("hidden");
                setShowRequests(false);
            },250);
        } else {
            setShowRequests(true);
            setReqLstState("unfurling");
            window.setTimeout(() => {
                setReqLstState("visible");
            },250);
        }
        
    }

    return(<div className={`RequestLst ${reqState}`}>
        <button id="RequestLstBtn" type="button" onClick={toggleRequests}>Friendship Requests</button>
        
        {showRequests && <div className={`req_lst ${reqState}`}>
            {Array.isArray(friendReqs) && friendReqs.length > 0 ?
                (friendReqs.map((req,index) => <Request 
                    key={index}
                    fst_name={req.sender_fstname}
                    surname={req.sender_surname} />)
                ) : (<p> pas de requêtes</p>)
            }
        
        </div>}

    </div>)
}

export default RequestLst;