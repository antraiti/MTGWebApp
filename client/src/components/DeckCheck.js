import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';import "./Banlist.scss"
import "./../App.scss"
import banlist from "./../assets/banlist.txt"

export const DeckCheck = () => {
    const [errorList, setErrorList] = useState([]);
    const [debug, setDebug] = useState('debug');

    const findBannedCards = event => {
        // event.target.value
        const inputtext = event.target.value
        const newErrors = []
        fetch(banlist)
            .then(r => r.text())
            .then(text => {
                text.split('\r\n').map(card => {
                    inputtext.split('\n').map(entry => {
                        const firstChar = entry.charAt(0);
                        let trimmed = "";
                        if( firstChar >= '0' && firstChar <= '9') {
                            trimmed = entry.substring(entry.indexOf(' ')+1);
                        } else {
                            trimmed = entry;
                        }
                        if(trimmed.toUpperCase() === card.toUpperCase()){newErrors.push(card);}
                    });
                })
                setErrorList(newErrors);
            });
      };

    return (
        <Container style={{ padding: "20px" }}>
            <div class="card-footer-container">
                <div class="footer-header mtg-font-bold">Deck Legality Checker</div>
                <Card style={{ backgroundColor: "#232323", padding: "20px" }}>
                    <p style={{color: "white"}}>This tool is designed to give a quick deck list check for any banned cards (does not currently check for un-set cards). Input your cardlist.</p>
                    <div class="container">
                    <div class="row">
                        <div class="col">
                            <textarea onChange={findBannedCards} class="form-control" id="deckCheckTextArea" rows="20"></textarea>
                        </div>
                        <div class="col" style={{ paddingLeft: "40px"}}>
                            <div class="row">
                                <label style={{color: "white"}}>Banned Cards:</label>
                            </div>
                            <div class="row">
                                {errorList.map(error => (<li style={{color: "red"}}>{error}</li>))}
                            </div>
                        </div>
                    </div>
                    </div>
                </Card>
            </div>
        </Container>
    )
}