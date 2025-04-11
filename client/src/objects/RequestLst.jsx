import { useState, useEffect, useRef } from 'react';

import Request from "./Request.jsx";
import "../styles/Requests.css";

function RequestLst() {
    const dummyRequests = [
        {fst_name: "Kallistrate", surname: "Wash"},
        {fst_name: "Sun-Woo", surname: "Hjort"},
        {fst_name: "Selig", surname: "Abram"},
        {fst_name: "Adad-Nirari", surname: "Wrona"},
        {fst_name: "Phanuel", surname:"Lewin"},
        {fst_name: "Adad", surname:"Nishiyama"},
    ];

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
        
        {showRequests && <div className={`req_lst ${reqState}`}>{dummyRequests.map((req,index) => <Request 
            key={index}
            fst_name={req.fst_name}
            surname={req.surname} />) 
        }</div>}

    </div>)
}

export default RequestLst;