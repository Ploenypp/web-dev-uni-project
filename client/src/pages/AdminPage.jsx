import { useState, useEffect, useRef } from 'react';

import '../styles/Admin.css';

import Ribbon from '../objects/Ribbon';
function AdminPage() {
    const [showDuty, setShowDuty] = useState("none");

    const toggleRegistrations = () => {
        if (showDuty === "registrations") { setShowDuty("none"); }
        else { setShowDuty("registrations"); }
    }
    const toggleFlagged = () => {
        if (showDuty === "flagged") { setShowDuty("none"); }
        else { setShowDuty("flagged"); }
    }
    const toggleUsers = () => {
        if (showDuty === "users") { setShowDuty("none"); }
        else { setShowDuty("users"); }
    }

    

    return(<div className="AdminPage">
        <Ribbon pageType={true} />
        <div id="admin_container">
            <div id="admin_selectionbar">
                <button id="reg_req_btn" type="button" onClick={toggleRegistrations}>Inscriptions</button>
                
                <button id="flagged_btn" type="button" onClick={toggleFlagged}>Publications signalées</button>
                
                <button id="members_btn" type="button" onClick={toggleUsers}>Membres</button>
            </div>
            <div id="admin_subcontainer">
                <div id="flagged_posts">
                </div>
            </div>
        </div>
    </div>)
}

export default AdminPage;