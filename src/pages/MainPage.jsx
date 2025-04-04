import {useState, useEffect, useRef} from 'react';
import "../styles/MainPage.css";
import logo from '../assets/logo.png';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";

function MainPage () {
    return(<div className="MainPage">
        <Ribbon />
        <Searchbar />
    </div>)
    
}

export default MainPage;