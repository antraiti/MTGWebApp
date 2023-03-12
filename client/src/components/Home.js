import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import './Home.css';
import "./../App.css"

export const Home = () => {
    return (
        <Container fluid="sm">
            <section className="jumbotron text-center">
                <div className="container">
                    <h1 className="jumbotron-heading">Better Brawl</h1>
                    <p className="lead text-muted">An alternative multiplayer format.</p>
                </div>
            </section>
            <CardGroup>
                <Card style={{ backgroundColor: "#28293d", margin: "10px" }}>
                    <Card.Header><h1 className="infocard-h">60</h1></Card.Header>
                    <Card.Text>Card singleton decks</Card.Text>
                </Card>
                <Card style={{ backgroundColor: "#28293d", margin: "10px" }}>
                    <Card.Header><h1 className="infocard-h">20</h1></Card.Header>
                    <Card.Text>Starting life total.</Card.Text>
                </Card>
                <Card style={{ backgroundColor: "#28293d", margin: "10px" }}>
                    <Card.Header><h1 className="infocard-h">1</h1></Card.Header>
                    <Card.Text>Legendary Creature or Planeswalker as your Commander.</Card.Text>
                </Card>
            </CardGroup>
        </Container>
    )
}