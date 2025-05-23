import { useNavigate } from 'react-router-dom';

import "../styles/Comment.css"

// commentaire d'une publication dans le forum général
function Comment(props) {
    const userID = props.userID;
    const author = props.author;
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
        const names = author.split(" ");
        navigate(`/profile/${names[0]}_${names[1]}`);
        window.location.reload();
    };

    return(<div className="Comment">
        {userID ? (<button id="comment_author_btn" type="button" onClick={handleToUser}><img id="comment_pfp" src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} alt="profile_pic"/>{author}</button>) : (<div id="deleted_user"><img src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} id="post_pfp" alt="profile picture" /> {author}</div>)}

        <div id="comment_content">
            <div id="comment_time">{readableDate}</div>
            {formatText(props.content)}
        </div>
    </div>)
}

export default Comment;