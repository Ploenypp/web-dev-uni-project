import {useState, useEffect, useRef} from 'react';

import Comment from "./Comment.jsx";
import NewReply from './NewReply.jsx';
import "../styles/Post.css";

function Post(props) {
    const dummyComments = [
        {
          author: "chaosGoblin23",
          timestamp: "2 minutes ago",
          content: "I laughed so hard I dropped my phone on my face. 10/10, would suffer again."
        },
        {
          author: "eggstentialist",
          timestamp: "just now",
          content: "Is this post a cry for help or performance art? Either way, I relate."
        },
        {
          author: "toebeans4life",
          timestamp: "13 minutes ago",
          content: "I read this to my cat. He blinked twice. That's basically a standing ovation."
        },
        {
          author: "404braincells",
          timestamp: "1 hour ago",
          content: "I understood none of this and still feel spiritually nourished."
        },
        {
          author: "baguetteKnight",
          timestamp: "3 days ago",
          content: "This post has the same energy as shouting into a baguette during a thunderstorm. Beautiful."
        }
      ]

    const [showThread, setShowThread] = useState(false);

    const [threadBtnText, setThreadBtnText] = useState("afficher la discussion")

    const toggleThread = () => {
        if (showThread) {
            setShowThread(false);
            setThreadBtnText("afficher la discussion");
        } else {
            setShowThread(true);
            setThreadBtnText("masquer la discussion");
        }
        console.log(showThread);
    }

    const [showReplyDraft, setShowReplyDraft] = useState(false);

    const [replyBtnText, setReplyBtnText] = useState("répondre");

    const toggleReplyDraft = () => {
        if (showReplyDraft) {
            setShowReplyDraft(false);
            setReplyBtnText("répondre");
        } else {
            setShowReplyDraft(true);
            setReplyBtnText("annuler");
        }
    }

    return(<div className="Post">
        <div>
            <div id="post_title"><strong>{props.title}</strong></div>
            <div id="post_info">
                {props.author}, {props.timestamp}
            </div>
        </div>
        <div id="post_content">
            {props.content}
        </div>
        <div id="post_buttons">
            <button id="reply_post" type="button" onClick={toggleReplyDraft}>{replyBtnText}</button>
            <button id="show_thread" type="button" onClick={toggleThread}>{threadBtnText}</button>
        </div>
        {showReplyDraft && (
            <NewReply />
        )}
        {showThread && (
                <div className="thread">
                    {dummyComments.map((comment,index) => (
                        <Comment 
                        key={index}
                        author={comment.author}
                        timestamp={comment.timestamp}
                        content={comment.content} />
                    ))}
                </div>
            )}
    </div>)
}

export default Post;