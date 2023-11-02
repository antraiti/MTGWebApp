import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import "./Banlist.scss";
import "./../App.scss";
import banlist from "./../assets/banlist.txt";
import silverbanlist from './../assets/banlist-silver.txt';
import alchemybanlist from './../assets/banlist-alchemy.txt';


export const DeckCheck = () => {
    const [errorList, setErrorList] = useState([]);
    const [bannedCards, setBannedCards] = useState([]);
    const [debug, setDebug] = useState('debug');

    const findCardNameRegex = /^(\d+x?)?\s*([^(\n\*]+)\s*(?:\(.*\))?\s*(\*CMDR\*)?/;

    useEffect(() => {
        // Fetch and populate banned cards from different lists
        Promise.all([
            fetch(banlist).then(r => r.text()),
            fetch(silverbanlist).then(r => r.text()),
            fetch(alchemybanlist).then(r => r.text())
        ]).then(textArray => {
            const combinedBannedCards = textArray.join('\r\n').split('\r\n');
            setBannedCards(combinedBannedCards);
        });
    }, []); 

    const checkBannedCards = (event) => {
        console.log(bannedCards);
        const inputtext = event.target.value;
        const newErrors = [];


        inputtext.split('\n').map(entry => {
            const foundRegex = entry.match(findCardNameRegex);
            let cardName = '';
            if (foundRegex && foundRegex.length > 0 && foundRegex[2]) {
                cardName = foundRegex[2];
            }

            if (!cardName) {
                return;
            }

            cardName.replace(/\n/g, '');
            if (bannedCards.map(item => item.toLocaleLowerCase()).includes(cardName.toLocaleLowerCase())) {
                newErrors.push(cardName);
            }
        });
        setErrorList(newErrors);
    }

    

    return (
        <Container style={{ padding: "20px" }}>
            <div className="card-footer-container">
                <div className="footer-header mtg-font-bold">Deck Legality Checker</div>
                <Card style={{ backgroundColor: "#232323", padding: "20px" }}>
                    <p style={{color: "white"}}>This tool is designed to give a quick deck list check for any banned cards (does not currently check for un-set cards). Input your cardlist.</p>
                    <div class="container">
                    <div class="row">
                        <div class="col">
                            <textarea onChange={checkBannedCards} class="form-control" id="deckCheckTextArea" rows="20"></textarea>
                        </div>
                        <div className="col" style={{ paddingLeft: "40px"}}>
                            <div className="row">
                                <label style={{color: "white"}}>Banned Cards:</label>
                            </div>
                            <div className="row">
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