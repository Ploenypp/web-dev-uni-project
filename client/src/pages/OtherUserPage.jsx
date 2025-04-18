import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

    return(<div className="ProfilePage">
        <Ribbon />
        <div id="pf_container">
            <div id="profile_sidebar"> 
              <ProfileInfo fstname={userInfo.fstname} surname={userInfo.surname} dob={userInfo.dob} status={userInfo.status} team={userInfo.team}/> 
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