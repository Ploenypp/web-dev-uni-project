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
    const fstname = props.fstname;
    const surname = props.surname;
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
    };
    const toggleTeam = () => {
        if (btnSelected === "team") { setBtnSelected("none"); }
        else { setBtnSelected("team"); }
    };
    const toggleRemove = () => {
        if (btnSelected === "remove") { setBtnSelected("none"); }
        else { setBtnSelected("remove"); }
    };

    const [assignedTeam, setAssignedTeam] = useState("");
    const getAssignedTeam = (evt) => { setAssignedTeam(evt.target.value); }

    const changeStatus = async () => {
        const newStatus = (status == "member" ? "admin" : "member");
        try {
            const response = await axios.post('http://localhost:8000/api/admin/change-status', { userID, newStatus }, { withCredentials: true });
            //alert(response.data.message);
        } catch(err) {
            console.error("status change failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleStatus();
    };

    const assignTeam = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/admin/assign-team', { userID, assignedTeam }, { withCredentials: true });
            //alert(response.data.message);
        } catch(err) {
            console.error("team assignment failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleTeam();
    };

    const deleteUser = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/admin/delete-user/${userID}`, {
                params: { fstname, surname },
                withCredentials: true 
            });
            alert(response.data.message);
        } catch(err) {
            console.error("user deletion failed", err.resopnse?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleRemove();
    };

    const handleUserOps = () => {
        if (btnSelected === "status") { changeStatus(); }
        if (btnSelected === "team") { assignTeam(); }
        if (btnSelected == "remove") { deleteUser(); }
    };

    return(<div className="UserAdminCard">
        <img id="admin_card_pfp" src={`http://localhost:8000/api/images/load_pfp/${userID}?t=${Date.now()}`} alt="profile picture" />
        <div id="user_facts">
            <div id="user_name">
                {fstname} {surname}
            </div>
            <div id="user_field">
                date de naissance
                <div id="user_admin_info">
                    {readableDate}
                </div>
            </div>
            <div id="user_field">
                statut
                <div id="user_admin_info">
                    {status}
                </div>
            </div>
            <div id="user_field">
                équipe
                <div id="user_admin_info">
                    {props.team}
                </div>
            </div>
        </div>
        <div id="user_modif">
            <div id="user_modif_btns">
                <button className={`update_status_btn ${btnSelected === "status"}`} type="button" onClick={toggleStatus}>
                    {btnSelected === "status" ? 
                        (status === "member" ? (<div>↑ promouvoyez</div>) : (<div>↓ rétrogradez</div>)) : 
                        
                        (status === "member" ? (<div>↑</div>) : (<div>↓</div>)) }
                </button>

                <button className={`assign_team_btn ${btnSelected === "team"}`} type="button" onClick={toggleTeam}>
                    {btnSelected === "team" ? (<div>⇄ attribuez une équipe</div>) : (<div>⇄</div>)}
                </button>
                {btnSelected === "team" && (<input id="assigned_team" type="text" onChange={getAssignedTeam}></input>)}

                <button className={`rem_user_btn ${btnSelected === "remove"}`} type="button" onClick={toggleRemove}>
                    {btnSelected === "remove" ? (<div>⌫ enlevez</div>) : (<div>⌫</div>)}
                </button>
            </div>

            {btnSelected != "none" && (<div id="confirm_ops">
                <button className={`confirm_ops_btn ${btnSelected}`} type="button" onClick={handleUserOps}>confirmer</button>
            </div>)}
        </div>
    </div>)
}

export default UserAdminCard;