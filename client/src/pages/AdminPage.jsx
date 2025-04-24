import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Ribbon from '../objects/Ribbon';
import FlaggedChk from '../objects/admin_aux/FlaggedChk';

import '../styles/Admin.css';

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

    const [flaggedPosts, setFlaggedPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/api/admin/flagged-posts', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setFlaggedPosts(data))
            .catch(err => console.error("error fetching flagged posts", err));
    },[]);

    return(<div className="AdminPage">
        <Ribbon pageType={true} />
        <div id="admin_container">
            <div id="admin_selectionbar">
                <button id="reg_req_btn" type="button" onClick={toggleRegistrations}>Inscriptions</button>
                
                <button id="flagged_btn" type="button" onClick={toggleFlagged}>Publications signalées</button>
                
                <button id="members_btn" type="button" onClick={toggleUsers}>Membres</button>
            </div>
            <div id="admin_workspace">
                {showDuty === "flagged" && (<div id="admin_subcontainer">
                    <div id="flagged_posts">
                    {Array.isArray(flaggedPosts) && flaggedPosts.map((post,index) => (
                            <FlaggedChk 
                                key={index}
                                postID={post._id}
                                authorID={post.authorID}
                                author={post.author}
                                title={post.title}
                                content={post.content}
                                reports={post.reports}
                            />
                        ))}
                    </div>
                </div>)}
            </div>
        </div>
    </div>)
}

export default AdminPage;