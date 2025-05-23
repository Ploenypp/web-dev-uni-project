import "../styles/Message.css";

// message privé
function Message(props) {
    const msg_type = props.type; // permettre de changer l'apparence du message selon l'utilisateur

    return(<div className={`Message ${props.type}`}>
        {msg_type === "other" && (<div className="msg_header"><img id="msg_pfp" src={`http://localhost:8000/api/images/load_pfp/${props.userID}?t=${Date.now()}`} alt="msg_pfp"/></div>)}
        
        <div className={`msg_content ${props.type}`}>{props.content}</div>
    </div>)
}

export default Message;