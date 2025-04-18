import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../styles/ProfilePage.css";
import "../styles/Chat.css";

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx"
import Post from "../objects/Post.jsx"
import ProfileInfo from "../objects/ProfileInfo";

function OtherUserPage() {
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        fetch('http://localhost:8000/api/user/visit-user', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => console.error("Error fetching user data:", err));
    }, []);

    const visitID = userInfo._id;

    const [posts, setPosts] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/posts/visit-user-posts', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { 
          console.log(data)
          if (Array.isArray(data)) { setPosts(data); } 
          else { setPosts([]); }
        })

        .catch(err=> console.error("Error fetching user posts", err));
    }, []);

    const [showBtn, setShowBtn] = useState("Envoyer Friend Request");

    const [friendships, setFriendships] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/user/friends', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setFriendships(data))
        .catch(err => console.error("Error fetching friends",err));
    }, []);
    const isFriend = Array.isArray(friendships) && friendships.some(friendship => friendship.friend1ID.toString() === visitID ||
    friendship.friend2ID.toString() === visitID);

    const [friendReqs, setFriendReqs] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/user/check-friend-requests', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setFriendReqs(data))
        .catch(err => console.error("Error fetching friend requests", err));
    }, []);
    const reqSent = Array.isArray(friendReqs) && friendReqs.some(friendship => friendship.recipientID.toString() === visitID)

    useEffect(() => {
      if (reqSent) { setShowBtn("Friend Request envoyé"); }
      if (isFriend) { setShowBtn("Messager"); }
      console.log(showBtn);
    })

    const handleFriendReq = async () => {
      if (isFriend) { return ;}
      try {
        const response = await axios.post('http://localhost:8000/api/user/request-friendship', { recipientID: visitID }, { withCredentials: true });

        alert(response.data.message);
        setShowBtn("Friend Request envoyé");

      } catch(err) {
        console.error("Request failed", err.response?.data?.message || err.message);
        alert(err.response?.data?.message || "Something went wrong");
      }
    };

    const navigate = useNavigate();
    const toChat = () => {
      navigate('/chats');
    }

    return(<div className="ProfilePage">
        <Ribbon />
        <div id="pf_container">
            <div id="profile_sidebar"> 
              <ProfileInfo fstname={userInfo.fstname} surname={userInfo.surname} dob={userInfo.dob} status={userInfo.status} team={userInfo.team}/> 
              
              { showBtn === "Envoyer Friend Request" && (<button id="friendreq_btn" type="button" onClick={handleFriendReq}>{showBtn}</button>) }

              { showBtn === "Friend Request envoyé" && (<button id="friendreq_btn_sent" type="button">{showBtn}</button>)}

              { showBtn === "Messager" && (<button id="redirChat_btn" type="button" onClick={toChat}>{showBtn}</button>) }


            </div>
            <div id="pf_subcontainer">
              <Searchbar />
              <div id="profile_posts">
              <div className="posts">
              {posts.map((post, index) => (
                <Post
                  key={index}
                  postID={post._id}
                  title={post.title}
                  author={post.author}
                  timestamp={post.timestamp}
                  content={post.content}
                />
              ))}
              </div>
            </div>
            </div>
        </div>
    </div>)
}

export default OtherUserPage;