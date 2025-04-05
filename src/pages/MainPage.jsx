import {useState, useEffect, useRef} from 'react';

import Ribbon from "../objects/Ribbon.jsx";
import Searchbar from "../objects/Searchbar.jsx";

function MainPage () {
    return(<div className="MainPage">
        <Ribbon />
        <Searchbar />
    </div>)
    
}

export default MainPage;