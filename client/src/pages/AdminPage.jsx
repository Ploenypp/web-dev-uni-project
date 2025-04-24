import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Ribbon from '../objects/Ribbon';
import FlaggedChk from '../objects/admin_aux/FlaggedChk';
import UserAdminCard from '../objects/admin_aux/UserAdminCard';

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

    const [allUsers, setAllUsers] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/api/admin/all-users', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setAllUsers(data))
            .catch(err => console.error("error fetching all users", err));
    },[]);

    return(<div className="AdminPage">
        <Ribbon pageType={true} />
        <div id="admin_container">
            <div id="admin_selectionbar">
                <button className={`admin_selection_btn ${showDuty === "registrations"}`} type="button" onClick={toggleRegistrations}>Inscriptions</button>
                
                <button className={`admin_selection_btn ${showDuty === "flagged"}`} type="button" onClick={toggleFlagged}>Publications signalées</button>
                
                <button className={`admin_selection_btn ${showDuty === "users"}`} type="button" onClick={toggleUsers}>Membres</button>
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

                {showDuty === "users" && (<div id="users_subcontainer">
                    <div id="users_lst">
                    {Array.isArray(allUsers) && allUsers.map((user,index) => (
                        <UserAdminCard key={index} userID={user._id} fstname={user.fstname} surname={user.surname} dob={user.dob} status={user.status} team={user.team} />
                    ))}
                    </div>
                </div>)}
            </div>
        </div>
    </div>)
}

export default AdminPage;