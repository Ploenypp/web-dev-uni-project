import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Ribbon from "../objects/Ribbon.jsx";
import Message from "../objects/Message.jsx";

// profile pictures 
import tmp_pfp from "../assets/tmp_pfp.png";
import xemnas from "../assets/profile_pics/xemnas.png";
import xigbar from "../assets/profile_pics/xigbar.png";
import xaldin from "../assets/profile_pics/xaldin.png";
import vexen from "../assets/profile_pics/vexen.png";
import lexaeus from "../assets/profile_pics/lexaeus.png";
import zexion from "../assets/profile_pics/zexion.png";
import saix from "../assets/profile_pics/saix.png";
import axel from "../assets/profile_pics/axel.png";
import demyx from "../assets/profile_pics/demyx.png";
import luxord from "../assets/profile_pics/luxord.png";
import marluxia from "../assets/profile_pics/marluxia.png";
import larxene from "../assets/profile_pics/larxene.png";
import roxas from "../assets/profile_pics/roxas.png";
import xion from "../assets/profile_pics/xion.png";
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

        //alert(response.data.message);
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

    const pfp = (name) => {
      if (name === "Xemnas Xehanort") { return xemnas; }
      if (name === "Xigbar Braig") { return xigbar; }
      if (name === "Xaldin Dilan") { return xaldin; }
      if (name === "Vexen Even") { return vexen; }
      if (name === "Lexaeus Aeleus") { return lexaeus; }
      if (name === "Zexion Ienzo") { return zexion; }
      if (name === "Saix Isa") { return saix; }
      if (name === "Axel Lea") { return axel; }
      if (name === "Demyx Medy") { return demyx; }
      if (name === "Luxord Rodul") { return luxord; }
      if (name === "Marluxia Lauriam") { return marluxia; }
      if (name === "Larxene Elrena") { return larxene; }
      if (name === "Roxas Sora") { return roxas; }
      if (name === "Xion Noi") { return xion; }
      return msg_pfp;
    }

    return(<div className="ChatPage">
        <Ribbon fstname={userInfo.fstname} surname={userInfo.surname}/>
        <div id="chatpage_subcontainer">
            <div id="chat_sidebar">
                Messages 
                <div id="chat_lst">
                    {friends.map((chat,index) => <button key={index} className={`chat_btn ${(chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name) === friendName}`} type="button" onClick={() => selectChat(chat._id, (chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name ))}>
                      <img id="chat_pfp" src={pfp(chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name)} alt="chat_pfp"/>
                      { chat.friend1ID.toString() != userID ? chat.friend1_name : chat.friend2_name }
                    </button>)}
                </div>
            </div>
            <div id="chat_area">
                {chatSelected === "none" ? (<div id="chat_placeholder">selectionner un chat...</div>) : 
                    (<div id="msg_lst">
                        {messages && messages.map((msg,index) => (<Message key={index} type={(msg.authorID.toString() === userID.toString() ? "self" : "other")} pfp={pfp(msg.author)} author={msg.author} timestamp={msg.timestamp} content={msg.content} />))}
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