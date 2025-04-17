import {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import "../styles/NewReply.css";

function NewReply(props) {
    const parentPostID = props.parentPostID;

    const [content, setContent] = useState("");
    const getContent = (evt) => { setContent(evt.target.value); }


    useEffect(() => {
        console.log(content);
        console.log(parentPostID);
    }, [content, parentPostID]);

    const handleComment = async () => {
        if (!content.trim()) {
            alert("Pas possible de publier un commentaire vide");
            return ;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/posts/newcomment', {
                parentPostID, 
                content 
            }, { withCredentials: true });

            alert(response.data.message);

        } catch(error) {
            console.error("Publication failed:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="NewReply">
        <textarea id="write-content" type="text" placeholder="répondre..." onChange={getContent}></textarea>
        <button id="reply_btn" type="button" onClick={handleComment}>publier</button>
    </div>)
    
}
export default NewReply;
