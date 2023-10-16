import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
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
        'Content-Type': 'application/json'
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        }
        return data.json();
    })
  }

  async function SubmitDeck(token, di) {
    return fetch(configData.API_URL+'/deck/v2', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify(di)
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        } else {
            //success or different error handling
            //console.log(data);
        }
        return data.json();
    })
}

export const DeckForm = () => {
    const { id } = useParams();
    const [users, setUsers] = useState();
    const { user, userToken } = userData();
    const [deckList, setDeckList] = useState("");
    const [deckUser, setDeckUser] = useState(user.publicid);
    const [deckName, setDeckName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        getUsers(userToken)
        .then(item => {
            if(mounted) {
                setUsers(item);
            }
            })
        return () => mounted = false;
      }, [])

    const finalizeDeck = () => {
            const di = {
                user: deckUser,
                list: deckList,
                name: deckName
            }
            if(id === null) {
                setSubmitted(true);
                SubmitDeck(userToken, di)
                .then(response => {
                    if(response.deckid != null) {
                        navigate(`/DeckForm/` + response.deckid);
                        window.location.reload(false);
                    }
                })
            }
        }

    return (
        <Container style={{ padding: "20px" }}>
            <div className="card-footer-container">
                <div className="footer-header mtg-font-bold">New Deck Form</div>
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        <InputGroup>
                        <InputGroup.Text>Player</InputGroup.Text>
                        {users && users.length > 0 && <Form.Select aria-label="User selection" value={deckUser} onChange={e => setDeckUser(e.target.value)} disabled={submitted}>
                            {users.map(usr => 
                                <option key={usr.publicid} value={usr.publicid}>{usr.username}</option>
                                )}
                            </Form.Select>}
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Deck Name</InputGroup.Text>
                        <Form.Control type="text" placeholder="Name" onChange={e => setDeckName(e.target.value)} disabled={submitted}/>
                        </InputGroup>
                        <br/>
                        <Form.Control as="textarea" style={{height:"600px"}} aria-label="Decklist" onChange={e => setDeckList(e.target.value)} disabled={submitted}/>
                        <br/>
                        <Button variant="standard" onClick={finalizeDeck} disabled={submitted}>
                            Save
                        </Button>
                    </Form>
                </Card>
            </div>
        </Container>
    )
    }