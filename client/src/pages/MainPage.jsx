import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";
import NewPost from '../objects/NewPost.jsx';
import Post from "../objects/Post.jsx";

import "../styles/MainPage.css";

// page principale où s'affiche toutes les publications dans le forum général
function MainPage () {
    // vérifier si l'utilisatuer est bien connecté, sinon rediriger à la page de connexion
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:8000/api/auth/check-session', { credentials: 'include' })
          .then(res => { if (res.status === 401) { navigate('/'); }})
          .catch(err => console.error("error checking session :", err));
    },[]);

    // récupérer l'userID de l'utilisateur connecté
    const [currentUserID, setCurrentUserID] = useState("");
    useEffect(() => {
      fetch('http://localhost:8000/api/users/currentUserID', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setCurrentUserID(data))
        .catch(err => console.error("error fetching current user's ID :",err))
    },[]);

    // récupérer toutes les publications du forum général
    const [postsContent, setPostContents] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/posts/all-posts', {
        credentials: 'include' })
          .then(res => res.json())
          .then(data => setPostContents(data))
          .catch(err => console.error("error fetching posts :",err));
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
                edited={post.edited}
                editDate={post.editDate}
                content={post.content}
				currentUserID={currentUserID}
            />))}
        </div>
    </div>) 
}

export default MainPage;