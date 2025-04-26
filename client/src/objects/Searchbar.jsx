import {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import Post from './Post';

import search from '../assets/search.png';
import "../styles/Searchbar.css";

// profile pictures
import tmp_pfp from "../assets/tmp_pfp.png";
import xemnas from "../assets/profile_pics/xemnas.png";
import xigbar from "../assets/profile_pics/xigbar.png";
import xaldin from "../assets/profile_pics/xaldin.png";
import vexen from "../assets/profile_pics/vexen.png";
import lexaeus from "../assets/profile_pics/lexaeus.png";
import zexion from "../assets/profile_pics/zexion.png";
import saix from "../assets/profile_pics/saix.png";
import axel from "../assets/profile_pics/axel.png";
import demyx from "../assets/profile_pics/demyx.png";
import luxord from "../assets/profile_pics/luxord.png";
import marluxia from "../assets/profile_pics/marluxia.png";
import larxene from "../assets/profile_pics/larxene.png";
import roxas from "../assets/profile_pics/roxas.png";
import xion from "../assets/profile_pics/xion.png";

function Searchbar(props) {
    const currentUserID = props.currentUserID;

    const [showResults, setShowResults] = useState(false);
    
    const [searchText, setSearchText] = useState("");
    const getSearchText = (evt) => { setSearchText(evt.target.value); }
    const [searchDate, setSearchDate] = useState("");
    const getSearchDate = (evt) => { setSearchDate(evt.target.value); }

    const [userResults, setUserResults] = useState([]);
    const searchUsers = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8000/api/search/all-users?prompt=${searchText}`);
            setUserResults(response.data);
        } catch(err) {
            console.error("user search failed", err);
        }
    };
    const pfp = (name) => {
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

    const [postResults, setPostResults] = useState([]);
    const searchPosts = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8000/api/search/all-posts?prompt=${searchText}`);
            setPostResults(response.data);
        } catch(err) {
            console.error("post search failed", err);
        }
    };

    const handleSearch = (e) => {
        setShowResults(false);
        searchUsers(e);
        searchPosts(e);
        setShowResults(true);
    };

    return(<div className="Searchbar">
        <div id="searchbar">
            <form><div id="searchbar_form">
                <label htmlFor="text-search">recherche</label>
                <input id="text-search" type="text" className="text-input" onChange={getSearchText}placeholder="chercher des mots clés, des utilisateurs..."/>
                <input id="date-search" type="date" min="1900-01-01" max="2007-12-31" onChange={getSearchDate}/>
                <button id="submit-search" type="button" onClick={handleSearch}><img src={search} id="search_icon" alt="icon"/></button>
            </div></form>
        </div>

        {showResults && (<div id="results">
            <p>résultats pour "{searchText}"</p>
            <div id="user_results">
                {userResults.length === 0 && (<p>aucun utilisateur correspond</p>)}
                {userResults.map((user, index) => (
                    <div id="user_result_card">
                        <img id="res_pic" src={pfp(user.fstname)} alt="pfp" />
                        <div id="res_name">
                            {user.fstname} {user.surname}
                        </div>
                        <div id="res_field">
                            date de naissance
                            <div id="res_info">
                            {new Date(user.dob).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </div>
                        </div>
                        <div id="res_field">
                            status
                            <div id="res_info">
                            {user.status}
                            </div>
                        </div>
                        <div id="res_field">
                            team
                            <div id="res_info">
                            {user.team}
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <div id="post_results">
                {postResults.length === 0 && (<p>aucune publication correspond </p>)}
                {postResults.map((post, index) => (
                <Post
                    key={index}
                    postID={post._id}
                    userID={post.userID}
                    title={post.title}
                    author={post.author}
                    timestamp={post.timestamp}
                    content={post.content}
                            currentUserID={currentUserID}
                />))}
            </div>
        </div>)}

    </div>)
}

export default Searchbar;