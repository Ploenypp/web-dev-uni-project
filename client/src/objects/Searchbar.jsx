import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Post from './Post';

import "../styles/Searchbar.css";

function Searchbar() {
    const [currentUserID, setCurrentUserID] = useState("");
    useEffect(() => {
        fetch('http://localhost:8000/api/users/currentUserID', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setCurrentUserID(data))
            .catch(err => console.error("error fetching current user ID :", err));
    })
    const [showResults, setShowResults] = useState(false);
    
    const [searchText, setSearchText] = useState("");
    const getSearchText = (evt) => { setSearchText(evt.target.value); }
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [userResults, setUserResults] = useState([]);
    const searchUsers = async (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/api/search/all-users?prompt=${searchText}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserResults(data))
            .catch(err => console.error("error searching for user :", err))
    };

    const [postResults, setPostResults] = useState([]);
    const searchByText = async (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/api/search/all-posts/text?prompt=${searchText}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setPostResults(data))
            .catch(err => console.error("error searching by text", err));
    };

    const searchByDateRange = async (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/api/search/all-posts/date?start=${startDate}&end=${endDate}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setPostResults(data))
            .catch(err => console.error("error searching by date range", err));
    };
    
    const searchByTextDateRange = async (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/api/search/all-posts/text-date?prompt=${searchText}&start=${startDate}&end=${endDate}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setPostResults(data))
            .catch(err => console.error("error searching by text and date range", err));
    };

    const handleSearch = (e) => {
        setShowResults(false);
        searchUsers(e);
        if (searchText !== "") {
            if (startDate !== "" && endDate !== "") { searchByTextDateRange(e); }
            else { searchByText(e); }
            setShowResults(true);
        } else {
            if (startDate !== "" && endDate !== "") { 
                searchByDateRange(e); 
                setShowResults(true);
            } else { setShowResults(false); }
        }
    };

    const navigate = useNavigate();
    const handleToUser = async(userNames) => {
        navigate(`/profile/${userNames}`);
        window.location.reload();
    };

    return(<div className="Searchbar">
        <div id="searchbar">
            <form><div id="searchbar_form">
                <label htmlFor="text-search">recherche</label>
                <input id="text-search" type="text" className="text-input" onChange={getSearchText}placeholder="chercher des mots clés, des utilisateurs..."/>
                
                <label htmlFor="date-search">de</label>
                <input id="date-search" type="date" min="1900-01-01" max="2007-12-31" onChange={(e) => setStartDate(e.target.value)} />
                <label htmlFor="date-search">à</label>
                <input id="date-search" type="date" min="1900-01-01" max="2007-12-31" onChange={(e) => setEndDate(e.target.value)} />
                
                <button id="submit-search" type="button" onClick={handleSearch}><img src={`http://localhost:8000/api/images/load_icon/${"search"}?t=${Date.now()}`} id="search_icon" alt="icon"/></button>
            </div></form>
        </div>

        {showResults && (<div id="results">
            <p>résultats pour {searchText != "" && (searchText)}{(searchText != "" && startDate != "" && endDate != "") && (", ")} {startDate != "" && (new Date(startDate).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }))} - {endDate != "" && (new Date(endDate).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }))}</p>
            
            <div id="user_results">
                {userResults.length === 0 && (<p>aucun utilisateur correspond</p>)}
                {userResults.map((user, index) => (
                    <button id="user_result_card" type="button" onClick={() => handleToUser(`${user.fstname}_${user.surname}`)} key={index}>
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