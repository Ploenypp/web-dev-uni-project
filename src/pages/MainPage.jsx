import {useState, useEffect, useRef} from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";

import "../styles/MainPage.css";

function MainPage () {
    return(<div className="MainPage">
        <Ribbon />
        <Searchbar />
    </div>)
    
}

export default MainPage;