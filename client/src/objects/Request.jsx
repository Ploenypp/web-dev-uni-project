import axios from 'axios';

import "../styles/Requests.css";

// requête d'amitié
function Request(props) {
    const requestID = props.requestID;
    const senderID = props.senderID;

    // accepter la requête
    const handleAccept = async () => {
        try {
            await axios.post(`http://localhost:8000/api/users/accept-friend-request/${requestID}`, {}, { withCredentials: true });
        } catch(err) {
            console.error("error accepting request :", err.reponse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    // rejeter la requête
    const handleReject = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/users/reject-friend-request/${requestID}`, { withCredentials: true });
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