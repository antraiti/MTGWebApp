import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import './Rules.scss';
import './../App.scss';

export const Rules = () => {
    return (
        <Container style={{ padding: "20px" }}>
            <Row>
                <div class="card-footer-container">
                    <div class="footer-header mtg-font-bold">Deck Requirements and Restrictions</div>
                    <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                        <ul>
                            <li className="section-li">60 card deck</li>
                            <li className="section-li">A commander - part of the 60 card deck but starts the game in the command zone - commanders can be either: one legendary creature, one planeswalker, or two legendary creatures with partner</li>
                            <li className="section-li">All cards in the deck must be in the color identity of your commander(s)</li>
                            <li className="section-li">One copy of any card, except basic lands</li>
                            <li className="section-li">Decks may not contain any copies of cards on the banlist (see below)</li>
                            <li className="section-li">Decks may also have sideboards of up to 5 cards</li>
                        </ul>
                    </Card>
                </div>
            </Row>
            <Row>
                <div class="card-footer-container">
                    <div class="footer-header mtg-font-bold">Basic Game Rules</div>
                    <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                        <ul>
                            <li className="section-li">2+ players</li>
                            <li className="section-li">Free for all</li>
                            <li className="section-li">All players start the game with 20 life</li>
                            <li className="section-li">All commanders start the game in the command zone</li>
                            <li className="section-li">The last player left standing wins the game</li>
                        </ul>
                    </Card>
                </div>
            </Row>
            <Row>
                <div class="card-footer-container">
                    <div class="footer-header mtg-font-bold">Important Things to Note</div>
                    <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                        <ul>
                            <li className="section-li">There is no “commander damage” like in the Commander format.</li>
                            <li className="section-li">There are no “signature spells” like in the Oathbreaker format.</li>
                            <li className="section-li">If your playgroup wants to use different rules you have our explicit permission right here to do so (as long as your friends agree!).</li>
                            <li className="section-li">A card's color identity can come from any part of that card, including its casting cost and any mana symbols in its text. Every card in your deck must only use mana symbols that also appear on your commander. Mana symbols included in reminder text, like extort, are not technically part of the card and are therefore excluded in the card’s color identity. Basic lands are included in this rule, you may only use basic lands that are part of your commander’s color identity in your deck.</li>
                            <li className="section-li">The command zone is where your commander resides during the game when they are not in play. At the start of the game, each player puts their commander face up into the command zone, typically towards the center of the play area. A commander can be cast from the command zone for its normal costs, plus an additional two generic mana for each previous time it's been cast from the command zone this game. If your commander is put into your library, hand, graveyard or exile from anywhere, you may return it to your command zone.</li>
                            <li className="section-li">BB follows the same mulligan rules as other multiplayer formats. Each player gets one free mulligan, followed by the standard London Mulligan. Each player draws a card on their first turn of the game.</li>
                            <li className="section-li">Conceding the game is encouraged to be a sorcery speed action</li>
                            <li className="section-li">If you would like to use a companion alongside your Commander: Your companion is part of your deck’s sideboard, your deck (including commander(s)) must follow the deck building restrictions of the companion, and your companion must be in the same color identity as your commander.</li>
                            <li className="section-li">Updated companion rule from WotC: Once per game, any time you could cast a sorcery (during your main phase when the stack is empty), you can pay 3 generic mana to put your companion from your sideboard into your hand. This is a special action, not an activated ability.</li>
                            <li className="section-li">Yorion, Sky Nomad is legal to play as a companion (for now) and if you choose to do so, your deck must be 80 cards. This is the only exception to the 60 card deck size rule, because it’s fun.</li>
                        </ul>
                    </Card>
                </div>
            </Row>
        </Container>
    )
}