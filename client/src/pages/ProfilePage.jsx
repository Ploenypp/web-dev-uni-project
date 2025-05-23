import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import "../styles/ProfilePage.css";
import "../styles/Chat.css";

import Ribbon from "../objects/Ribbon.jsx";
import Post from "../objects/Post.jsx"
import ProfileInfo from "../objects/ProfileInfo";
import RequestLst from "../objects/RequestLst.jsx";
import NotiLst from "../objects/NotiLst.jsx";

function ProfilePage() {
	const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:8000/api/auth/check-session', { credentials: 'include' })
            .then(res => { if (res.status === 401) { navigate('/'); }})
            .catch(err => console.error("error checking session :", err));
    },[]);

    const { userNames } = useParams();
    const [userInfo, setUserInfo] = useState("");
	const [currentUserID, setCurrentUserID] = useState(null);
    useEffect(() => {
      	fetch(`http://localhost:8000/api/users/byUserNames/${userNames}`, { credentials: 'include' })
        	.then(res => res.json())
          	.then(data => setUserInfo(data))
          	.catch(err => console.error("error fetching user data :", err));
		
		fetch('http://localhost:8000/api/users/currentUserID', { credentials: 'include' })
			.then(res => res.json())
			.then(data => setCurrentUserID(data))
			.catch(err => console.error("error getting current user id :", err));
    }, []);

    const [posts, setPosts] = useState([]);
    useEffect(() => {
		if (userInfo) {
			fetch(`http://localhost:8000/api/posts/${userInfo._id}`, { credentials: 'include' })
				.then(res => res.json())
				.then(data => setPosts(data))
				.catch(err=> console.error("error fetching user posts :", err));
		}
    }, [userInfo, posts]);

    const [reqslst, setReqLst] = useState([]);
    useEffect(() => {
      	fetch('http://localhost:8000/api/users/get-friend-requests', { credentials: 'include' })
          	.then(res => res.json())
          	.then(data => setReqLst(data))
          	.catch(err => console.error("error fetching friend requests :", err));
    }, 	[reqslst]);

	const [requested, setRequested] = useState(false);
	const [friend, setFriend] = useState(false);
	useEffect(() => {
		if (currentUserID && userInfo && currentUserID != userInfo._id) {
			fetch(`http://localhost:8000/api/users/check-request/${userInfo._id}`, { credentials: 'include' })
				.then(res => res.json())
				.then(data => setRequested(data))
				.catch(err => console.error("error fetching request status :", err));
			
			fetch(`http://localhost:8000/api/users/check-friendship/${userInfo._id}`, { credentials: 'include' })
				.then(res => res.json())
				.then(data => setFriend(data))
				.catch(err => console.error("error fetching friendship status :", err));
		}
	}, [currentUserID, userInfo]);

	const handleRequest = async() => {
		try {
			await axios.post(`http://localhost:8000/api/users/request-friendship/${userInfo._id}`, {}, { withCredentials: true });
		} catch(err) {
			console.error("error requesting friendship :", err.response?.data?.message || err.message);
		}
		window.location.reload();
	};

    const toChats = () => { navigate("/chats"); }

    return(<div className="ProfilePage">
        <Ribbon fstname={userInfo.fstname} surname={userInfo.surname} pageType={false}/>
        
		<div id="pf_container">
            <div id="profile_sidebar"> 
              	<ProfileInfo 
                  currentUserID={currentUserID} 
                  userID={userInfo._id} 
                  fstname={userInfo.fstname} 
                  surname={userInfo.surname} 
                  dob={userInfo.dob} 
                  status={userInfo.status} 
                  team={userInfo.team}
                /> 
              	
				{ currentUserID === userInfo._id ? 
					(<div>
						<RequestLst reqslst={reqslst}/> 
						<NotiLst />
						<button id="redirChat_btn" type="button" onClick={toChats}>
							<img src={`http://localhost:8000/api/images/load_icon/${"gummiphone"}?t=${Date.now()}`} id="profile_msg_icon" alt="icon"/>
							Messages
						</button>
					</div>) : 
					(<div>
						{ !friend ? (
							!requested ? 
								(<button id="friendreq_btn" type="button" onClick={handleRequest}>Envoyer Friend Request</button>) : 
								(<button id="friendreq_btn" type="button">Friend Request envoyé</button>)) : 
								
								(<button id="redirChat_btn" type="button" onClick={toChats}>
								<img src={`http://localhost:8000/api/images/load_icon/${"gummiphone"}?t=${Date.now()}`} id="profile_msg_icon" alt="icon"/>
								Messager
								</button>)
						}
					</div>) 
				}
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