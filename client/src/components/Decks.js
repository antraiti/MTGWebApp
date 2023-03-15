import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import './Rules.css';
import './../App.css';
import userData from '../util/userData';
import Button from 'react-bootstrap/Button';


//This should be moved to util since we will use it elsewhere
async function getcolors() {
    return fetch('http://localhost:5000/colors', {
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

async function newDeck(token) {
    return fetch('http://localhost:5000/deck', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify("")
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message + data.body);
        }
        return data.json();
    })
}

export const Decks = () => {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const [colors, setColors] = useState([]);

    useEffect(() => {
        let mounted = true;
        getcolors()
          .then(items => {
            if(mounted) {
              setColors(items)
            }
          })
        return () => mounted = false;
      }, [])

    const createDeck = () => {
        newDeck(userToken);
    }

    return (
        <Container style={{ padding: "20px" }}>
            <Row>
                <Card style={{ backgroundColor: "#28293d", padding: "20px", marginBottom: "20px" }}>
                    <h2 className="section-header">{userName}</h2>
                    <Button onClick={createDeck} style={{backgroundColor: "#5483df", borderWidth: "0px", justifySelf: "right"}}>New Deck</Button>

                    <Form.Select aria-label="Color Identity">
                        {colors.map((colorinfo) => (<option>{colorinfo.name}</option>))}
                    </Form.Select>
                </Card>
            </Row>
        </Container>
    )
}