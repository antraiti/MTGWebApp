import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import './Home.scss';
import "./../App.scss"

export const Home = () => {
    return (
        <div class="site-container full-vh">
        <Container fluid="sm">
            <div class="crown-container"></div>
            <div class="inner-container full-vh flex-column flex-align-space-between">
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading mtg-font-bold">Better Brawl</h1>
                        <p className="lead">An alternative multiplayer format.</p>
                    </div>
                </section>

                <div class="cta-container flex-row flex-align-space-between">
                    <button class="mtg-font">
                        Learn the  Rules
                    </button>
                    <button class="mtg-font">
                        Build a Deck
                    </button>
                    <button class="mtg-font">
                        Explore the Banlist
                    </button>
                </div>

                <div class="card-footer-container">
                    <div class="footer-header mtg-font-bold">Quick Ruleset</div>
                    <CardGroup>
                        <Card style={{ backgroundColor: "#28293d", margin: "10px" }}>
                            <Card.Header><h1 className="infocard-h mtg-font">60</h1></Card.Header>
                            <Card.Text><span class="mtg-font">Card singleton decks</span></Card.Text>
                        </Card>
                        <Card style={{ backgroundColor: "#28293d", margin: "10px" }}>
                            <Card.Header><h1 className="infocard-h mtg-font">20</h1></Card.Header>
                            <Card.Text><span class="mtg-font">Starting life total.</span></Card.Text>
                        </Card>
                        <Card style={{ backgroundColor: "#28293d", margin: "10px" }}>
                            <Card.Header><h1 className="infocard-h mtg-font">1</h1></Card.Header>
                            <Card.Text><span class="mtg-font">Legendary Creature or Planeswalker as your Commander.</span></Card.Text>
                        </Card>
                    </CardGroup>
                </div>
            </div>
        </Container>
        </div>
    )
}