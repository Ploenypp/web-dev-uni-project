import { useState, useEffect } from 'react';
import axios from 'axios';

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
            await axios.patch(`http://localhost:8000/api/admin/change-status/${userID}`, { newStatus }, { withCredentials: true });
        } catch(err) {
            console.error("error changing status", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleStatus();
    };

    const assignTeam = async () => {
        try {
            await axios.patch(`http://localhost:8000/api/admin/assign-team/${userID}`, { assignedTeam }, { withCredentials: true });
        } catch(err) {
            console.error("error assigning team", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
        toggleTeam();
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/delete-user/${userID}`, {
                params: { fstname, surname },
                withCredentials: true 
            });
        } catch(err) {
            console.error("error deleting user", err.resopnse?.data?.message || err.message);
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