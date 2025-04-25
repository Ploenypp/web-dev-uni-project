import { useState, useEffect } from 'react';
import axios from 'axios';

function Registration(props) {
    const regID = props.regID;
    const username = props.username;
    const password = props.password;
    const date = new Date(props.dob);
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

    return(<div className="Registration">
        <div id="reg_info">
            <div id="reg_name">{props.fstname} {props.surname}</div>
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
                    <input id="assign_status" type="text" />
                </div>
                <div id="assign_field">
                    <label htmlFor="assign_team">équipe : </label>
                    <input id="assign_team" type="text" />
                </div>
            </div>
        </div>)}

        {btnSelected === "reject" && (<div>rejeter cette demande d'inscription</div>)}

        {btnSelected != "none" && (<button id="confirm_reg" type="button">confirmer</button>)}
    </div>)
}

export default Registration;