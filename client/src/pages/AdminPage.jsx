import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Ribbon from '../objects/Ribbon';
import Registration from '../objects/admin_aux/Registration';
import FlaggedChk from '../objects/admin_aux/FlaggedChk';
import UserAdminCard from '../objects/admin_aux/UserAdminCard';
import NewAdminPost from '../objects/admin_aux/NewAdminPost';
import AdminPost from '../objects/admin_aux/AdminPost';

import '../styles/Admin.css';

function AdminPage() {
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => console.error("Error fetching user data:", err));
    }, []);
	const currentUserID = userInfo._id;
    
    const [showDuty, setShowDuty] = useState("none");
    const toggleForum = () => {
        if (showDuty === "forum") { setShowDuty("none"); }
        else { setShowDuty("forum"); }
    }
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

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/api/admin/posts', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("error fetching admin posts"));
    }, [posts])

    const [registrations, setRegistrations] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/api/admin/registrations', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setRegistrations(data))
            .catch(err => console.error("error fetching registrations", err));
    },[registrations]);

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
    },[allUsers]);

    return(<div className="AdminPage">
        <Ribbon pageType={true} />
        <div id="admin_container">
            <div id="admin_selectionbar">
                <button className={`admin_selection_btn ${showDuty === "forum"}` }type="button" onClick={toggleForum}>Forum</button>

                <button className={`admin_selection_btn ${showDuty === "registrations"}`} type="button" onClick={toggleRegistrations}>Inscriptions</button>
                
                <button className={`admin_selection_btn ${showDuty === "flagged"}`} type="button" onClick={toggleFlagged}>Publications signalées</button>
                
                <button className={`admin_selection_btn ${showDuty === "users"}`} type="button" onClick={toggleUsers}>Membres</button>
            </div>
            <div id="admin_workspace">
                {showDuty === "none" && (<p>selectionner une responsabilité</p>)}

                {showDuty === "forum" && (<div id="forum_subcontainer">
                    <NewAdminPost />
                    <div id="admin_post_lst">
                    {posts.map((post, index) => (
                        <AdminPost
                        key={index}
                        postID={post._id}
                        userID={post.userID}
                        title={post.title}
                        author={post.author}
                        timestamp={post.timestamp}
                        content={post.content}
				        currentUserID={currentUserID}
                     />))}
                     </div>
                </div>)}

                {showDuty === "registrations" && (<div id="registrations_subcontainer">
                    <div id="registrations_lst">
                        {registrations == 0 && ("pas d'inscription en attente")}
                        {registrations.map((reg,index) => (
                            <Registration 
                                key={index} 
                                regID={reg._id}
                                username={reg.username} 
                                password={reg.password} 
                                fstname={reg.fstname} 
                                surname={reg.surname} 
                                dob={reg.dob} 
                            />
                        ))}
                    </div>
                </div>)}

                {showDuty === "flagged" && (<div id="flagged_subcontainer">
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
                        <UserAdminCard 
                            key={index} 
                            userID={user._id} 
                            fstname={user.fstname} 
                            surname={user.surname} 
                            dob={user.dob} 
                            status={user.status} 
                            team={user.team} 
                        />
                    ))}
                    </div>
                </div>)}
            </div>
        </div>
    </div>)
}

export default AdminPage;