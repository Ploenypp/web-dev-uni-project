import {useState, useEffect, useRef} from 'react';

import search from '../assets/search.png';
import "../styles/Searchbar.css";

function Searchbar() {
    const [searchText, setSearchText] = useState("");
    const [searchDate, setSearchDate] = useState("");

    const getSearchText = (evt) => { setSearchText(evt.target.value); }
    const getSearchDate = (evt) => { setSearchDate(evt.target.value); }

    useEffect(() => {
        console.log(`
        text: ${searchText}
        date: ${searchDate}
        `);
    },[searchText,searchDate]);

    return(<div className="Searchbar">
        <form><div id="searchbar_form">
            <label htmlFor="text-search">recherche</label>
            <input id="text-search" type="text" className="text-input" onChange={getSearchText}placeholder="chercher des mots clés, des utilisateurs..."/>
            <input id="date-search" type="date" min="1900-01-01" max="2007-12-31" onChange={getSearchDate}/>
            <button id="submit-search" type="button"><img src={search} id="search_icon" alt="icon"/></button>
        </div></form>
    </div>)
}

export default Searchbar;