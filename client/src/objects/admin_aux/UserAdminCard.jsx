import { useState, useEffect } from 'react';
import axios from 'axios';


import xemnas from "../../assets/profile_pics/xemnas.png";
import xigbar from "../../assets/profile_pics/xigbar.png";
import xaldin from "../../assets/profile_pics/xaldin.png";
import vexen from "../../assets/profile_pics/vexen.png";
import lexaeus from "../../assets/profile_pics/lexaeus.png";
import zexion from "../../assets/profile_pics/zexion.png";
import saix from "../../assets/profile_pics/saix.png";
import axel from "../../assets/profile_pics/axel.png";
import demyx from "../../assets/profile_pics/demyx.png";
import luxord from "../../assets/profile_pics/luxord.png";
import marluxia from "../../assets/profile_pics/marluxia.png";
import larxene from "../../assets/profile_pics/larxene.png";
import roxas from "../../assets/profile_pics/roxas.png";
import xion from "../../assets/profile_pics/xion.png";
import tmp_pfp from "../../assets/tmp_pfp.png";

function UserAdminCard(props) {
    const userID = props.userID;
    const date = new Date(props.dob);
    const readableDate = date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const status = props.status;


    const pfp = () => {
        const name = props.fstname;
        if (name === "Xemnas") { return xemnas; }
        if (name === "Xigbar") { return xigbar; }
        if (name === "Xaldin") { return xaldin; }
        if (name === "Vexen") { return vexen; }
        if (name === "Lexaeus") { return lexaeus; }
        if (name === "Zexion") { return zexion; }
        if (name === "Saix") { return saix; }
        if (name === "Axel") { return axel; }
        if (name === "Demyx") { return demyx; }
        if (name === "Luxord") { return luxord; }
        if (name === "Marluxia") { return marluxia; }
        if (name === "Larxene") { return larxene; }
        if (name === "Roxas") { return roxas; }
        if (name === "Xion") { return xion; }
        return tmp_pfp;
    };

    const [btnSelected, setBtnSelected] = useState("none");
    const toggleStatus = () => {
        if (btnSelected === "status") { setBtnSelected("none"); }
        else { setBtnSelected("status"); }
    }
    const toggleTeam = () => {
        if (btnSelected === "team") { setBtnSelected("none"); }
        else { setBtnSelected("team"); }
    }
    const toggleRemove = () => {
        if (btnSelected === "remove") { setBtnSelected("none"); }
        else { setBtnSelected("remove"); }
    }

    return(<div className="UserAdminCard">
        <img id="admin_card_pfp" src={pfp()} alt="pfp" />
        <div id="user_facts">
            <div id="user_name">
                {props.fstname} {props.surname}
            </div>
            <div id="user_current">
                né(e): <strong>{readableDate}</strong>
                <br></br>
                statut : <strong>{status}</strong>
                <br></br>
                équipe : <strong>{props.team}</strong>
            </div>
        </div>
        <div id="user_modif">
            <div id="user_modif_btns">
                <button id="update_status_btn" type="button" onClick={toggleStatus}>
                    {status === "member" ? (<div>↑</div>) : (<div>↓</div>)}
                </button>

                <button id="assign_team_btn" type="button" onClick={toggleTeam}>⇄</button>

                <button id="rem_user_btn" type="button" onClick={toggleRemove}>⌫</button>
            </div>
            {btnSelected === "team" && (<div id="ops_user">
                    <div>attribuez {props.fstname} {props.surname} à une équipe</div>
                    <div id="assign_team_form">
                        <input id="assigned_team" type="text"></input>
                        <button id="confirm_team_btn" type="button">✍︎</button>
                    </div>
            </div>)}
        </div>
    </div>)
}

export default UserAdminCard;