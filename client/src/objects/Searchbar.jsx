import {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Post from './Post';

import "../styles/Searchbar.css";

function Searchbar(props) {
    const currentUserID = props.currentUserID;

    const [showResults, setShowResults] = useState(false);
    
    const [searchText, setSearchText] = useState("");
    const getSearchText = (evt) => { setSearchText(evt.target.value); }
    const [searchDate, setSearchDate] = useState("");
    const getSearchDate = (evt) => { setSearchDate(evt.target.value); }
    const date = new Date(searchDate);
    const readableDate = date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

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
    const searchByText = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8000/api/search/all-posts/text?prompt=${searchText}`);
            setPostResults(response.data);
        } catch(err) {
            console.error("search by text failed", err);
        }
    };

    const searchByDate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8000/api/search/all-posts/date?date=${searchDate}`);
            setPostResults(response.data);
        } catch(err) {
            console.error("search by date failed",err);
        }
    };

    const searchByTextDate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8000/api/search/all-posts/text-date?prompt=${searchText}&date=${searchDate}`);
            setPostResults(response.data);
        } catch(err) {
            console.error("search by text and search",err);
        }
    };

    const handleSearch = (e) => {
        setShowResults(false);
        searchUsers(e);
        if (searchText != "") {
            if (searchDate != "") { searchByTextDate(e); }
            else { searchByText(e); }
            setShowResults(true);
        } else {
            if (searchDate != "") { 
                searchByDate(e); 
                setShowResults(true);
            } else { setShowResults(false); }
        }
    };

    const navigate = useNavigate();
    const handleToUser = async (userID) => {
        if (userID === currentUserID) { 
            navigate('/profile');
            return ;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/user/visit', { userID }, { withCredentials: true });
            //alert(response.data.message);
            navigate('/user');
        } catch(err) {
            console.error("visit failed", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return(<div className="Searchbar">
        <div id="searchbar">
            <form><div id="searchbar_form">
                <label htmlFor="text-search">recherche</label>
                <input id="text-search" type="text" className="text-input" onChange={getSearchText}placeholder="chercher des mots clés, des utilisateurs..."/>
                <input id="date-search" type="date" min="1900-01-01" max="2007-12-31" onChange={getSearchDate}/>
                <button id="submit-search" type="button" onClick={handleSearch}><img src={`http://localhost:8000/api/images/load_icon/${"search"}?t=${Date.now()}`} id="search_icon" alt="icon"/></button>
            </div></form>
        </div>

        {showResults && (<div id="results">
            <p>résultats pour {searchText != "" && (searchText)}{(searchText != "" && searchDate != "") && (", ")} {searchDate != "" && (readableDate)}</p>
            <div id="user_results">
                {userResults.length === 0 && (<p>aucun utilisateur correspond</p>)}
                {userResults.map((user, index) => (
                    <button id="user_result_card" type="button" onClick={() => handleToUser(user._id)} key={index}>
                        <img id="res_pic" src={`http://localhost:8000/api/images/load_pfp/${user._id}?t=${Date.now()}`} alt="pfp" />
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
                    </button>
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