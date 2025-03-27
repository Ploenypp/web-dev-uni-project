import {useState, useEffect, useRef} from 'react';
import "./MainPage.css";
import logo from './assets/logo.png';

import Ribbon from "./Ribbon.jsx";
import Searchbar from "./Searchbar.jsx";

function MainPage () {
    return(<div clasName="MainPage">
        <Ribbon />
    </div>)
    
}

export default MainPage;