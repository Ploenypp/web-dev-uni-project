import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import gummiphone from '../assets/gummiphone.png';
import "../styles/ProfilePage.css";
import "../styles/Chat.css";

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx"
import Post from "../objects/Post.jsx"
import ProfileInfo from "../objects/ProfileInfo";
import RequestLst from "../objects/RequestLst.jsx";

function ProfilePage() {
	const [userInfo, setUserInfo] = useState("");
  	useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => console.error("Error fetching user data:", err));
  	}, []);
	const currentUserID = userInfo._id;

    const navigate = useNavigate();
    const toChats = () => {
      navigate("/chats");
    }

    const [posts, setPosts] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/posts/profile-posts', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { 
          //console.log(data)
          if (Array.isArray(data)) { setPosts(data); } 
          else { setPosts([]); }
        })

        .catch(err=> console.error("Error fetching user posts", err));
    }, [posts]);

    const [reqslst, setReqLst] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/user/get-friend-requests', { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
              //console.log("reqslst",data)
              setReqLst(data)
          })
          .catch(err => console.error("Error fetching friend requests", err));
    }, [reqslst]);

    return(<div className="ProfilePage">
        <Ribbon fstname={userInfo.fstname} surname={userInfo.surname} pageType={false}/>
        <div id="pf_container">
            <div id="profile_sidebar"> 
              <ProfileInfo userID={currentUserID} fstname={userInfo.fstname} surname={userInfo.surname} dob={userInfo.dob} status={userInfo.status} team={userInfo.team}/> 
              <RequestLst reqslst={reqslst}/> 
              <button id="redirChat_btn" type="button" onClick={toChats}><img src={gummiphone} id="profile_msg_icon" alt="icon"/>Messages</button>
            </div>
            <div id="pf_subcontainer">
              	<div id="profile_posts">
              	<div className="posts">
              	{posts && posts.length > 0 ? (posts.map((post, index) => (
                <Post
                  key={index}
                  postID={post._id}
				  userID={post.userID}
                  title={post.title}
                  author={post.author}
                  timestamp={post.timestamp}
                  content={post.content}
				  currentUserID={currentUserID}
                />))) : <div id="no_posts">Vous n'avez pas encore de publications.</div> }
              	</div>
            </div>
            </div>
        </div>
    </div>)
}

export default ProfilePage;