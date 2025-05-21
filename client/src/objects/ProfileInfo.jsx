import {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import "../styles/ProfilePage.css";

function ProfileInfo(props) {
    const date = new Date(props.dob);
    const readableDate = date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [file, setFile] = useState(null);
    const handleFileUpload = (evt) => {
        const file = evt.target.files[0];
        if (file) { setFile(file); }
        else { setFile(null); }
    };

    const handleFileSubmit = async () => {
        if (!file) { return; }

        const formData = new FormData();
        formData.append('image', file); // or wherever your file comes from

        axios.post('http://localhost:8000/api/images/upload_pfp', formData, {
        withCredentials: true, // include if your server uses sessions/cookies
        headers: {
            'Content-Type': 'multipart/form-data',
        },})
        .then(res => { console.log('Upload successful:', res.data); })
        .catch(err => { console.error('Upload failed:', err); });
    };

    return(<div className="ProfileInfo">
        {props.userID && (
        <img src={`http://localhost:8000/api/images/load_pfp/${props.userID}?t=${Date.now()}`} id="profile_pic" alt="profile picture" />
        )}
            <div id="profile_text">
                <strong>{props.fstname} {props.surname}</strong>
                <div id="p_profile">
                    <div>Né(e) : <strong>{readableDate}</strong></div>
                    <div>Statut : <strong>{props.status}</strong></div>
                    <div>Équipe : <strong>{props.team}</strong></div>
                </div>
            </div>
            <div className="upload_container">
                <label htmlFor="pfp_input">modifier le photo de profil</label>
                <input id="pfp_input" type="file" accept="image/*/" onChange={handleFileUpload}/>
                {file && (
                    <div id="pfp_input_confirm">
                    {file.name}
                    <button id="confirm_pfp_btn" type="button" onClick={handleFileSubmit}>confirmer</button>
                    </div>
                )}
            </div>
    </div>)
}

export default ProfileInfo;