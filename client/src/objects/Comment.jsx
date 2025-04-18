import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import "../styles/Comment.css"

function Comment(props) {
    const userID = props.userID;
    const date = new Date(props.timestamp);
    const readableDate = date.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    const navigate = useNavigate();
    const handleToUser = async () => {
      console.log(userID);
      try {
          const response = await axios.post('http://localhost:8000/api/user/visit', { userID }, { withCredentials: true });
          alert(response.data.message);
          navigate('/user');
      } catch(err) {
          console.error("visit failed", err.response?.data?.message || err.message);
          alert(err.response?.data?.message || "Something went wrong");
      }
    }

    return(<div className="Comment">
        <div>
            <div id="comment_info">
              <button id="author_btn" type="button" onClick={handleToUser}>{props.author}</button>
              {readableDate}
            </div>
        </div>
        <div id="comment_content">
            {props.content}
        </div>
    </div>)
}

export default Comment;