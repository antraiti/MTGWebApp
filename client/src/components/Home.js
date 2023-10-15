import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import './Home.scss';
import "./../App.scss"

export const Home = () => {
    return (
        <div className="site-container full-vh">
        <Container fluid="sm">
            <div className="inner-container full-vh flex-column">
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading mtg-font-bold">Rumble</h1>
                        <p className="lead">An alternative multiplayer format.</p>
                    </div>
                </section>
                <div className="card-footer-container">
                    <div className="footer-header mtg-font-bold">Quick Ruleset</div>
                    <CardGroup>
                        <Card style={{margin: "10px" }}>
                            <Card.Header><h1 className="infocard-h mtg-font">60</h1></Card.Header>
                            <Card.Text><span className="mtg-font">Card singleton decks</span></Card.Text>
                        </Card>
                        <Card style={{ backgroundColor: "#232323", margin: "10px" }}>
                            <Card.Header><h1 className="infocard-h mtg-font">20</h1></Card.Header>
                            <Card.Text><span className="mtg-font">Starting life total.</span></Card.Text>
                        </Card>
                        <Card style={{ backgroundColor: "#232323", margin: "10px" }}>
                            <Card.Header><h1 className="infocard-h mtg-font">1</h1></Card.Header>
                            <Card.Text><span className="mtg-font">Legendary Creature or Planeswalker as your Commander.</span></Card.Text>
                        </Card>
                    </CardGroup>
                </div>
            </div>
        </Container>
        </div>
    )
}