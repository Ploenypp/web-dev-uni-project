import {useState, useEffect, useRef} from 'react';
import "../styles/Searchbar.css";

function Searchbar() {
    return(<div className="Searchbar">
        <form><div id="searchbar_form">
            <label htmlFor="text-search">Recherche</label>
            <input id="text-search" type="text" className="text-input" placeholder="chercher des mots clés, des utilisateurs..."/>

            <input id="date-search" type="date" min="1900-01-01" max="2007-12-31" required/>

            <button id="submit-search" type="button">Chercher</button>
        </div></form>
    </div>)
}

export default Searchbar;