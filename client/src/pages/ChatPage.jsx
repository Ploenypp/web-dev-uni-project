import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Ribbon from "../objects/Ribbon.jsx";
import Message from "../objects/Message.jsx";
import msg_pfp from "../assets/msg_pfp.png";

function ChatPage() {
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        fetch('http://localhost:8000/api/user/profile', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserInfo(data))
            .catch(err => console.error("Error fetching user data:", err));
    }, []);

    const userID = userInfo._id;

    const [friends, setFriends] = useState([]);
    useEffect(() => {
      fetch('http://localhost:8000/api/user/friends', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { setFriends(data) })
        .catch(err => console.error("Error fetching friends :( ", err));
    }, []);

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
    }

    const [message,setMessage] = useState("");
    const getMessage = (evt) => { setMessage(evt.target.value); }

    const [messages, setMessages] = useState([]);
    const fetchMessages = () => {
      fetch(`http://localhost:8000/api/messages/get-messages?chatID=${chatSelected.toString()}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) { 
            setMessages(data); 
            console.log(data);
          } 
          else { setMessages([]); }
        })
        .catch(err => console.error("Error fetching comments", err));
    };

    const handleSendMessage = async () => {
      if (!message.trim()) { return ; }
      try {
        const response = await axios.post('http://localhost:8000/api/messages/new-message', { 
          "chatID": chatSelected, 
          "content": message
        }, { withCredentials: true });

        alert(response.data.message);
        setMessage("");
        fetchMessages();
      } catch(err) {
        console.error("message not sent", err.response?.data?.message || err.message);
        alert(err.response?.data?.message || "Something went wrong");
      }
    };

    useEffect(() => {
      if (chatSelected != "none") {
        fetchMessages();
      }
    }, [chatSelected]);

    return(<div className="ChatPage">
        <Ribbon />
        <div id="chatpage_subcontainer">
            <div id="chat_sidebar">
                Messages 
                <div id="chat_lst">
                    {friends.map((chat,index) => <button key={index} className={`chat_btn ${(chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name) === friendName}`} type="button" onClick={() => selectChat(chat._id, (chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name ))}>
                      { chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name }
                    </button>)}
                </div>
            </div>
            <div id="chat_area">
                {chatSelected === "none" ? (<div id="chat_placeholder">selectionner un chat...</div>) : 
                    (<div id="msg_lst">
                        {messages && messages.map((msg,index) => (<Message key={index} type={(msg.authorID.toString() === userID.toString() ? "self" : "other")} pfp={msg_pfp} author={msg.author} content={msg.content} />))}
                    </div>)
                }
                {chatSelected === "none" ? (<div></div>) : (<div id="new_msg">
                    <input id="new_msg_text" type="text" value={message} onChange={getMessage} placeholder="écrivez..."/>
                    <button id="send_msg_btn" type="button" onClick={handleSendMessage}>→</button>
                </div>) }
            </div>
        </div>
    </div>)
}

export default ChatPage;