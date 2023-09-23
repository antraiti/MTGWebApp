import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import WeeklyCard from './WeeklyCard';
import './Rules.scss';
import './../App.scss';
import userData from '../util/UserData';
import Button from "react-bootstrap/esm/Button";
import configData from "./../config.json";

async function getEvents(token) {
    return fetch(configData.API_URL+'/event', {
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

async function newEvent(token) {
    return fetch(configData.API_URL+'/event', {
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
            throw new Error(data.message);
        }
        window.location.reload(false); //refreshes page
        return data.json();
    })
}

export const Weeklies = () => {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const [events, setEvents] = useState([]);
    const createEvent = () => {
        newEvent(userToken);
    }

    useEffect(() => {
        let mounted = true;
        getEvents(userToken)
        .then(items => {
        if(mounted) {
            setEvents(items)
        }
        })
        return () => mounted = false;
      }, [])

    return (
        <Container style={{ padding: "20px" }}>
            <Row>
                <div className="card-footer-container">
                    <div className="footer-header mtg-font-bold">Weeklies</div>
                    <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                        <Button type="button" variant="standard" onClick={createEvent} style={{ marginBottom: "20px" }}>New Event</Button>
                        <div style={{background: "transparent"}}>
                            {events.slice(0).reverse().map((event) => (
                                <WeeklyCard eventInfo={event}></WeeklyCard>
                            ))}
                        </div>
                    </Card>
                </div>
            </Row>
        </Container>
    )
}