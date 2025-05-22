import { useState, useEffect } from 'react';
import axios from 'axios';

function Registration(props) {
    const regID = props.regID;
    const fstname = props.fstname;
    const surname = props.surname;
    const dob = props.dob;
    const date = new Date(dob);
    const readableDate = date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [btnSelected, setBtnSelected] = useState("none");
    const toggleAcceptBtn = () => { 
        if (btnSelected === "accept") { setBtnSelected("none"); }
        else { setBtnSelected("accept"); }
    }
    const toggleRejectBtn = () => {
        if (btnSelected === "reject") { setBtnSelected("none"); }
        else { setBtnSelected("reject"); }

    }
    const [status, setStatus] = useState("");
    const getStatus = (evt) => {
        setStatus(evt.target.value);
    }

    const [team, setTeam] = useState("");
    const getTeam = (evt) => {
        setTeam(evt.target.value);
    }

    const handleRegOpsConfirm = () => {
        if (btnSelected === "accept") { acceptRegistration(); }
        if (btnSelected === "reject") { rejectRegistration(); }
    };

    const acceptRegistration = async () => {
        try {
            await axios.post(`http://localhost:8000/api/admin/accept-registration/${regID}`, { status, team }, { withCredentials: true });
        } catch(err) {
            console.error("error accepting registration", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const rejectRegistration = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/reject-registration/:${regID}`, { withCredentials: true });
        } catch(err) {
            console.error("error rejecting registration", err.reponse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    }

    return(<div className="Registration">
        <div id="reg_info">
            <div id="reg_name">{fstname} {surname}</div>
            {readableDate}
        </div>

        <div id="reg_btns">
            <button className={`accept_reg_btn ${btnSelected === "accept"}`} type="button" onClick={toggleAcceptBtn}>✓</button>
            
            <button className={`reject_reg_btn ${btnSelected === "reject"}`} type="button" onClick={toggleRejectBtn}>X</button>
        </div>

        {btnSelected === "accept" && (<div id="accept_ops">
            <div>attribuez</div>
            <div id="assign_form">
                <div id="assign_field">
                    <label htmlFor="assign_status">statut : </label>
                    <input id="assign_status" type="text" placeholder="member / admin" onChange={getStatus} />
                </div>
                <div id="assign_field">
                    <label htmlFor="assign_team">équipe : </label>
                    <input id="assign_team" type="text" placeholder="General Operations / ..." onChange={getTeam}/>
                </div>
            </div>
        </div>)}

        {btnSelected === "reject" && (<div>rejeter cette demande d'inscription</div>)}

        {btnSelected != "none" && (<button className={`confirm_reg ${btnSelected === "accept"}`} type="button" onClick={handleRegOpsConfirm}>confirmer</button>)}
    </div>)
}

export default Registration;