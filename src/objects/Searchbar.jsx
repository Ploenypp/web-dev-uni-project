import {useState, useEffect, useRef} from 'react';
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
            <button id="submit-search" type="button">chercher</button>
        </div></form>
    </div>)
}

export default Searchbar;