import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Ribbon from "../objects/Ribbon.jsx";
import Message from "../objects/Message.jsx";

// page qui permet aux utilisateurs d'envoyer et de recevoir  des messages privées avec leurs amis
function ChatPage() {
	// vérifier si l'utilisatuer est bien connecté, sinon rediriger à la page de connexion
  	const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:8000/api/auth/check-session', { credentials: 'include' })
            .then(res => { if (res.status === 401) { navigate('/'); }})
            .catch(err => console.error("error checking session ", err));
    },[]);

	// récupérer l'userID de l'utilisateur connecté
	const [userID, setUserID] = useState("");
    useEffect(() => {
        fetch('http://localhost:8000/api/users/currentUserID', { credentials: 'include' })
			.then(res => res.json())
			.then(data => setUserID(data))
			.catch(err => console.error("error getting current user id", err));
    }, []);

	// récuperer tous les amis et leurs messages de l'utilisateursr connecté
    const [friends, setFriends] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/messages/friends', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { setFriends(data) })
        .catch(err => console.error("error fetching friends", err));
    }, []);

	// selectionner le chat
    const [chatSelected, setChatSelected] = useState("none");
    const [friendName, setFriendName] = useState("");
    const selectChat = (ID, chatname) => {
        const chatID = ID;
        if (chatSelected === chatID) {
            setChatSelected("none");
            setFriendName("");
        } else {
            setChatSelected(chatID);
            setFriendName(chatname);
        }
    };

	// récupérer les messages du chat selectionné
    const [messages, setMessages] = useState([]);
    const fetchMessages = () => {
      fetch(`http://localhost:8000/api/messages/get-messages/${chatSelected}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("error fetching messages :", err));
    };

	// envoyer un nouveau message
	const [message,setMessage] = useState("");
    const getMessage = (evt) => { setMessage(evt.target.value); }
    const handleSendMessage = async () => {
      if (!message.trim()) { return ; }
      try {
        await axios.post(`http://localhost:8000/api/messages/new-message/${chatSelected}`, { message }, { withCredentials: true });
        setMessage("");
        fetchMessages();
      } catch(err) {
        console.error("error sending message", err.response?.data?.message || err.message);
        alert(err.response?.data?.message || "Something went wrong");
      }
    };

	// mise à jour du chat 
    useEffect(() => {
      if (chatSelected != "none") {
        fetchMessages();
      }
    }, [chatSelected]);

    return(<div className="ChatPage">
        <Ribbon pageType={false}/>
        <div id="chatpage_subcontainer">
            <div id="chat_sidebar">
              <div id="chat_head">
                <img src={`http://localhost:8000/api/images/load_icon/${"heart"}?t=${Date.now()}`} id="chat_icon" alt="icon"/> Ami(e)s
              </div>
                <div id="chat_lst">
                    {friends.map((chat,index) => <button key={index} className={`chat_btn ${(chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name) === friendName}`} type="button" onClick={() => selectChat(chat._id, (chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name ))}>
                      <img id="chat_pfp" src={`http://localhost:8000/api/images/load_pfp/${chat.friend1ID != userID ? chat.friend1ID : chat.friend2ID}?t=${Date.now()}`} alt="chat_pfp"/>
                      { chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name }
                    </button>)}
                </div>
            </div>
            <div id="chat_area">
                {chatSelected === "none" ? (<div id="chat_placeholder">selectionner un chat...</div>) : 
                    (<div id="msg_lst">
                        {messages && messages.map((msg,index) => (<Message key={index} type={(msg.authorID.toString() === userID.toString() ? "self" : "other")} userID={msg.authorID} author={msg.author} timestamp={msg.timestamp} content={msg.content} />))}
                    </div>)
                }
                {chatSelected === "none" ? (<div></div>) : (<div id="new_msg">
                    <textarea id="new_msg_text" type="text" value={message} onChange={getMessage} placeholder="écrivez..."/>
                    <button id="send_msg_btn" type="button" onClick={handleSendMessage}>→</button>
                </div>) }
            </div>
        </div>
    </div>)
}

export default ChatPage;