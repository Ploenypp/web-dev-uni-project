import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import "../../styles/Comment.css"
import "../../styles/Admin.css";

function AdminComment(props) {
    const currentUserID = props.currentUserID;
    const userID = props.userID;
    const date = new Date(props.timestamp);
    const readableDate = date.toLocaleString('fr-FR', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    const formatText = (text) => {
      return text.split('\n').map((line, index) => (
          <span key={index}>
              {line}
              <br />
          </span>
      ));
    };

    const navigate = useNavigate();
    const handleToUser = async () => {
        if (userID === currentUserID) { 
            navigate('/profile');
            return ;
        }
      try {
          const response = await axios.post('http://localhost:8000/api/user/visit', { userID }, { withCredentials: true });
          //alert(response.data.message);
          navigate('/user');
      } catch(err) {
          console.error("visit failed", err.response?.data?.message || err.message);
          alert(err.response?.data?.message || "Something went wrong");
      }
    }

    return(<div className="AdminComment">
        {userID ? (<button id="admincomment_author_btn" type="button" onClick={handleToUser}><img id="comment_pfp" src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} alt="msg_pfp"/>{props.author}</button>) : (<div id="deleted_user"><img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="post_pfp" alt="profile picture" /> {props.author}</div>)}

        <div id="comment_content">
            <div id="admincomment_time">{readableDate}</div>
            {formatText(props.content)}
        </div>
    </div>)
}

export default AdminComment;