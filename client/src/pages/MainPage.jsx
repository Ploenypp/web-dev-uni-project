import {useState, useEffect, useRef} from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";
import NewPost from '../objects/NewPost.jsx';
import Post from "../objects/Post.jsx";

import "../styles/MainPage.css";

function MainPage () {
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => console.error("Error fetching user data:", err));
    }, []);
	  const currentUserID = userInfo._id;

    const [postsContent, setPostContents] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/posts/all-posts', {
        credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            //console.log(data)
            setPostContents(data) 
          })
          .catch(err => console.error("Error fetching posts",err));
    }, [postsContent]);

    return(<div className="MainPage">
        <Ribbon pageType={false}/>
        <Searchbar />
        <div className="posts">
          <NewPost />
          {postsContent.map((post, index) => (
            <Post
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
    </div>)
    
}

export default MainPage;