import axios from 'axios';

import "../styles/Requests.css";

function Request(props) {
    const senderID = props.senderID;

    const handleAccept = async () => {
        try {
            await axios.post(`http://localhost:8000/api/users/accept-friend-request/${senderID}`, { withCredentials: true });
        } catch(err) {
            console.error("error accepting request :", err.reponse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleReject = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/user/reject-friend-request/${senderID}`, { withCredentials: true });
        } catch(err) {
            console.error("error rejecting request :", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    }

    return(<div className="Request">
        <img src={`http://localhost:8000/api/images/load_pfp/${senderID}?t=${Date.now()}`} id="req_pfp" alt="profile picture"/>
        <p> {props.fst_name} {props.surname}</p>
        <div id="req_btns">
            <button id="accept" type="button" onClick={handleAccept}>✓</button>
            <button id="reject" type="button" onClick={handleReject}>X</button>
        </div>
    </div>)
}

export default Request;