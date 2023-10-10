import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/Container";
import './Rules.scss';
import './../App.scss';
import userData from '../util/UserData';
import Button from "react-bootstrap/esm/Button";
import configData from "./../config.json";
import DeckCard from "./DeckCard";

//This should be moved to util since we will use it elsewhere
async function getColors() {
    return fetch(configData.API_URL+'/colors', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        }
        return data.json();
    })
}

async function getDecks(token) {
    return fetch(configData.API_URL+'/userdeckswithcards', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        } else if (data.status === 204) {
            return [];
        }
        return data.json();
    })
}

async function sendDeleteDeckRequest(token, id) {
    return fetch(configData.API_URL+'/removedeck/'+id, {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        } else if (data.status === 204) {
            return [];
        }
        return data.json();
    })
}

//Change name once replacing old decks page
export const Decks = () => {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const [decks, setDecks] = useState([]);
    const [performances, setPerformances] = useState([]);
    const [colors, setColors] = useState([]);
    let navigate = useNavigate(); 
    const createDeck = () => {
        let path = `DeckForm/`; 
        navigate(path);
    }

    const deleteDeck = (id) => {
        sendDeleteDeckRequest(userToken, id)
    }

    useEffect(() => {
        let mounted = true;
        getColors()
        .then(c => {
            if(mounted) {
                setColors(c)
            }
            })
        getDecks(userToken)
        .then(items => {
        if(mounted) {
            console.log(items)
            setDecks(items.deckandcards)
            setPerformances(items.performances)
        }
        })
        return () => mounted = false;
      }, [])

    return (
        <Container style={{ padding: "20px" }}>
            <Row>
                <div className="card-footer-container">
                    <div className="footer-header mtg-font-bold">Decks</div>
                    <Container style={{padding:"0",margin:"0px 0px 20px 0px"}}>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Body style={{padding:"20px 30px 20px 40px"}}>
                                        <Row>
                                            {/* <Col>
                                                <Row>
                                                    <Form.Select placeholder="Newest"/>
                                                </Row>
                                            </Col> */}
                                            <Col>
                                                <Form.Control placeholder="Search (currently not setup :) )"/>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col style={{alignContent:"center", maxWidth:"200px"}}>
                                <Card style={{height:"80px"}}>
                                    <Card.Body>
                                        <div className="text-center">
                                            <Link to="/DeckForm/">
                                                <Button type="button" variant="standard" onClick={createDeck}>New Deck</Button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col >
                        </Row>
                    </Container>
                    <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                        <div style={{background: "transparent"}}>
                            {decks.slice(0).reverse().map((deck) => (
                                <DeckCard deckInfo={deck[0]} commanderInfo={deck[1]}
                                partnerInfo={deck[2]} companionInfo={deck[3]} 
                                colorInfo={colors.find((c) => c.id == deck[0].identityid)}
                                performanceInfo={performances.find((p) => p.deckid == deck[0].id)}
                                deleteFunction={deleteDeck}></DeckCard>
                            ))}
                        </div>
                    </Card>
                </div>
            </Row>
        </Container>
    )
}