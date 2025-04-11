import { useState, useEffect, useRef } from 'react';

import "../styles/Requests.css";

function Request(props) {
    return(<div className="Request">
        {props.fst_name} {props.surname}
        <div id="req_btns">
            <button id="accept" type="button">✓</button>
            <button id="reject" type="button">X</button>
        </div>
    </div>)
}

export default Request;