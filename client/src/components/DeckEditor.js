import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import configData from "./../config.json";
import userData from '../util/UserData';
import './Rules.scss';
import './../App.scss';

//Form will just be a text field to dump in deck list formatted in a good way that each attribute can be pulled
//separated by lines to denote, Commander, Partner, Companion, Deck, Sideboard
  async function getDeckInfo(token, id) {
    return fetch(configData.API_URL+'/deck/v2/'+id, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        }
        return data.json();
    })
  }

  async function updateDeck(token, id, prop, val) {
    return fetch(configData.API_URL+'/deck/v2/'+id, {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify({'prop': prop, 'val': val})
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        }
        window.location.reload(false); //refreshes page
        return data.json();
    })
  }

export const DeckEditor = () => {
    const { id } = useParams();
    const { userToken } = userData();
    const [deckName, setDeckName] = useState("");
    const [deckCommander, setDeckCommander] = useState();
    const [deckPartner, setDeckPartner] = useState();
    const [deckCompanion, setDeckCompanion] = useState();
    const [cardList, setCardList] = useState([]);
    const [deckLegality, setDeckLegality] = useState();
    const [deckLegalityMessages, setDeckLegalityMessages] = useState([]);

    useEffect(() => {
        let mounted = true;
        getDeckInfo(userToken, id)
        .then(item => {
            if(mounted) {
                setDeckName(item.deck.name);
                setDeckCommander(item.deck.commander);
                setDeckPartner(item.deck.partner);
                setDeckCompanion(item.deck.companion);
                setCardList(item.cardlist);
                setDeckLegality(item.legality.legal);
                setDeckLegalityMessages(item.legality.messages);
            }
            })
        return () => mounted = false;
      }, [])

    return (
        <Container style={{ padding: "20px" }}>
            <div className="card-footer-container">
                <div className="footer-header mtg-font-bold">Deck Editor</div>
                {!deckLegality && deckLegalityMessages && deckLegalityMessages.map((mes) => (
                        <Card key={mes} style={{color:"red"}}>! {mes}</Card>
                    ))}
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        <InputGroup>
                        <InputGroup.Text>Deck Name</InputGroup.Text>
                        <Form.Control type="text" placeholder="Name" value={deckName ?? undefined} onChange={e => updateDeck(userToken, id, "name", e.target.value)}/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Commander</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckCommander ?? undefined} onChange={e => updateDeck(userToken, id, "commander", e.target.value)}>
                            <option key="nothing" value={undefined}></option>
                            {cardList.map(card => 
                                <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Partner</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckPartner ?? undefined} onChange={e => updateDeck(userToken, id, "partner", e.target.value)}>
                        <option key="nothing" value={undefined}></option>
                        {cardList.map(card => 
                                <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Companion</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckCompanion ?? undefined} onChange={e => updateDeck(userToken, id, "companion", e.target.value)}>
                        <option key="nothing" value={undefined}></option>
                        {cardList.map(card => 
                                <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                    </Form>
                </Card>
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>Sideboard</InputGroup.Text>
                            <Form.Select type="select" placeholder="Name" value={deckCompanion ?? undefined} onChange={e => updateDeck(userToken, id, "sideboard", e.target.value)}>
                                <option key="nothing" value={undefined}></option>
                                {cardList.map(card => 
                                        <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                        )}
                                </Form.Select>
                        </InputGroup>
                        <br/>
                        {cardList.filter((card) => card[0].issideboard).map(card => 
                            <Card key={card[1].name}>
                                <Stack direction="horizontal">
                                    <label style={{ color: "white"}}>{card[1].name}</label>
                                    <Button variant="danger" style={{ width: "20px", height: "20px", padding:"0px"}} onClick={e => updateDeck(userToken, id, "-sideboard", card[0].cardid)}>x</Button>
                                </Stack>
                            </Card>
                            )}
                    </Form>
                </Card>
            </div>
        </Container>
    )
    }