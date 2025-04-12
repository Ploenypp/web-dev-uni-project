import {useState, useEffect, useRef} from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";
import NewPost from '../objects/NewPost.jsx';
import Post from "../objects/Post.jsx";

import "../styles/MainPage.css";

function MainPage () {
    const [showWrite, setShowWrite] = useState(false);
    const [writeBtnText, setWriteBtnText] = useState("ouvrir une nouvelle discussion");

    const toggleShowWrite = () => {
        if (showWrite) {
            setShowWrite(false)
            setWriteBtnText("ouvrir une nouvelle discussion");
            
        } else {
            setShowWrite(true)
            setWriteBtnText("annuler");
        }
        console.log(showWrite);
    }

    const [postsContent, setPostContents] = useState([]);

    useEffect(() => {
      fetch('http://localhost:8000/api/posts/all-posts', {
        credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            setPostContents(data) 
          })
          .catch(err => console.error("Error fetching posts:",err));
    }, [postsContent]);

    return(<div className="MainPage">
        <Ribbon />
        <Searchbar />
        <NewPost />
        <div className="posts">
          {postsContent.map((post, index) => (
            <Post
                key={index}
                title={post.title}
                author={post.author}
                timestamp={post.timestamp}
                content={post.content}
            />))}
        </div>
    </div>)
    
}

export default MainPage;