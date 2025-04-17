import {useState, useEffect, useRef} from 'react';

import "../styles/Comment.css"

function Comment(props) {
    const dummyComments = [
        {
          author: "noodles_over_people",
          timestamp: "5 minutes ago",
          content: "I was eating ramen while reading this. Now I'm crying into soup."
        },
        {
          author: "yeet_priest",
          timestamp: "45 seconds ago",
          content: "You’ve committed a holy act of chaos. I’m proud. Unhinged, but proud."
        },
        {
          author: "spilledmatcha",
          timestamp: "22 hours ago",
          content: "This unlocked a memory I swore I repressed. Thanks. I think?"
        },
        {
          author: "feral_mango",
          timestamp: "11 minutes ago",
          content: "I want to print this post and frame it in my bathroom."
        },
        {
          author: "hotpotenthusiast",
          timestamp: "6 hours ago",
          content: "This post made me audibly gasp. My hotpot almost boiled over from shock."
    }]
    
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

    return(<div className="Comment">
        <div>
            <div id="comment_info">
                {props.author}, {props.timestamp}
            </div>
        </div>
        <div id="comment_content">
            {props.content}
        </div>
    </div>)
}

export default Comment;