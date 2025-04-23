import { useState, useEffect, useRef } from 'react';

function FlaggedChk(props) {
    return(<div className="FlaggedChk">
        <div id="flagged_post_container">
            <div id="flagged_title"></div>
            <div id="flagged_author"></div>
            <div id="flagged_content"></div>
        </div>

        <div id="flagged_btns">
            <button id="flagged_accept" type="button"></button>

            <button id="flagged_reject" type="button"></button>
        </div>
    </div>)
}

export default FlaggedChk;