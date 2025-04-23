import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import "../styles/Comment.css"

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

function Comment(props) {
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

    return(<div className="Comment">
        <button id="comment_author_btn" type="button" onClick={handleToUser}><img id="comment_pfp" src={pfp(props.author)} alt="msg_pfp"/>{props.author}</button>

        <div id="comment_content">
            <div id="comment_time">{readableDate}</div>
            {formatText(props.content)}
        </div>
    </div>)
}

export default Comment;