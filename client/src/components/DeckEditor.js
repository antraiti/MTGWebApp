import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
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

//this is being used multiple places and should be changed to a shared util or something
async function getUsers(token) {
    return fetch(configData.API_URL+'/user', {
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
    const [users, setUsers] = useState();
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const [deckUser, setDeckUser] = useState(userName);
    const [deckName, setDeckName] = useState("");
    const [deckColor, setColor] = useState();
    const [deckCommander, setDeckCommander] = useState();
    const [deckPartner, setDeckPartner] = useState();
    const [deckCompanion, setDeckCompanion] = useState();
    const [deckInfo, setDeckInfo] = useState();
    const [cardList, setCardList] = useState([]);
    const [sideboardList, setSideboardList] = useState();
    let navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        getUsers(userToken)
        .then(item => {
            if(mounted) {
                console.log(item);
                setUsers(item);
            }
            })
        getDeckInfo(userToken, id)
        .then(item => {
            if(mounted) {
                console.log(item);
                setDeckInfo(item.deck);
                setDeckName(item.deck.name);
                setDeckCommander(item.deck.commander);
                setDeckPartner(item.deck.partner);
                setDeckCompanion(item.deck.companion);
                setCardList(item.cardlist);
            }
            })
        return () => mounted = false;
      }, [])

    return (
        <Container style={{ padding: "20px" }}>
            <div class="card-footer-container">
                <div class="footer-header mtg-font-bold">Deck Editor</div>
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        {/* <InputGroup>
                        <InputGroup.Text>Player</InputGroup.Text>
                        {users && users.length > 0 && <Form.Select aria-label="User selection" onChange={e => setDeckUser(e.target.value)}>
                            {users.map(usr => 
                                <option value={usr.publicid}>{usr.username}</option>
                                )}
                            </Form.Select>}
                        </InputGroup>
                        <br/> */}
                        <InputGroup>
                        <InputGroup.Text>Deck Name</InputGroup.Text>
                        <Form.Control type="text" placeholder="Name" value={deckName} onChange={e => updateDeck(userToken, id, "name", e.target.value)}/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Commander</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckCommander} onChange={e => updateDeck(userToken, id, "commander", e.target.value)}>
                            <option value={null}></option>
                            {cardList.map(card => 
                                <option value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Partner</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckPartner} onChange={e => updateDeck(userToken, id, "partner", e.target.value)}>
                        <option value={null}></option>
                        {cardList.map(card => 
                                <option value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Companion</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckCompanion} onChange={e => updateDeck(userToken, id, "companion", e.target.value)}>
                        <option value={null}></option>
                        {cardList.map(card => 
                                <option value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                    </Form>
                </Card>
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>Sideboard</InputGroup.Text>
                            <Form.Select type="select" placeholder="Name" value={deckCompanion} onChange={e => updateDeck(userToken, id, "sideboard", e.target.value)}>
                                <option value={null}></option>
                                {cardList.map(card => 
                                        <option value={card[0].cardid}>{card[1].name}</option>
                                        )}
                                </Form.Select>
                        </InputGroup>
                        <br/>
                        {cardList.filter((card) => card[0].issideboard).map(card => 
                            <Card>
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