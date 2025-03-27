import {useState, useEffect, useRef} from 'react';
import "./Searchbar.css";

function Searchbar() {
    return(<div className="Searchbar">
        <div id="searchbar_form"><form>
            <label htmlFor="text-search">Recherche</label>
            <input id="text-search" type="text" className="text-input" placeholder="chercher des mots clés, des utilisateurs..."/>

            <div id="date-search">
            <form>
                <input type="number" id="day" min="1" max="31" className="date-input" placeholder='jour'/> 

                <select required>
                    <option value="" disabled selected>mois</option>
                    <option value="01">janvier</option>
                    <option value="02">février</option>
                    <option value="03">mars</option>
                    <option value="04">avril</option>
                    <option value="05">mai</option>
                    <option value="06">juin</option>
                    <option value="07">juillet</option>
                    <option value="08">août</option>
                    <option value="09">septembre</option>
                    <option value="10">octobre</option>
                    <option value="11">novembre</option>
                    <option value="12">decembre</option>
                </select>
                
                <input type="number" id="year" min="1900" max="2025" className="date-input" placeholder='année'/>
            </form>
            </div>

            <button id="submit-search" type="button">Chercher</button>
        </form></div>
    </div>)
}

export default Searchbar;