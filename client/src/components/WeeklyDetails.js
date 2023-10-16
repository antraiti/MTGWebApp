import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import userData from '../util/UserData';
import './Rules.scss';
import './../App.scss';
import './WeeklyDetails.scss';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import MatchCard from "./MatchCard";
import EditableLable from "./EditableLable";
import configData from "./../config.json";
import { LocalDate } from "../util/TimeHelpers";

async function getEventDetails(token, id) {
    return fetch(configData.API_URL+'/event/'+id, {
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

async function newMatch(token, matchid) {
    return fetch(configData.API_URL+'/match', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify(matchid)
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        }
        window.location.reload(false); //refreshes page
        return data.json();
    })
}

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

export const WeeklyDetails = () => {
    const { id } = useParams();
    const { userToken } = userData();
    const [eventDetails, setEventDetails] = useState([]);
    const createMatch = () => {
        newMatch(userToken, id);
    }
    const [eventName, setEventName] = useState([]);
    const [showInputEle, setShowInputEle] = useState(false);
    const [users, setUsers] = useState([]);
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        let mounted = true;
        getEventDetails(userToken, id)
        .then(item => {
        if(mounted) {
            setEventDetails(item)
            setEventName(item.event.name)
            setDecks(item.decks)
        }
        })
        getUsers(userToken)
        .then(item => {
            if(mounted) {
                setUsers(item)
            }
            })
        return () => mounted = false;
      }, [])

    return (
        <Container>
            <Row style={{ margin: "20px"}}>
                <Row>
                    <Col>
                        <EditableLable
                            value={eventName}
                            handleChange={(e) => setEventName(e.target.value)}  
                            handleDoubleClick={() => setShowInputEle(true)} 
                            handleBlur={() => setShowInputEle(false)}         
                            showInputEle={showInputEle}
                            />
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 style={{color:"grey"}}>{eventDetails.event != null && LocalDate(eventDetails.event.time)}</h5>
                    </Col>
                    <Col>
                        <h5 style={{color:"grey", textAlign:"end"}}>{eventDetails.event != null && eventDetails.event.themed ? "Themed" : "No Theme"}</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h5 style={{color:"grey"}}>{eventDetails.matches != null && eventDetails.matches.length} matches</h5>
                    </Col>
                </Row>
            </Row>
            <Row>
                {eventDetails.matches != null && users != null && eventDetails.matches.map((match) => (
                    <MatchCard key={match.match.id} matchInfo={match} userlist={users} decklist={decks}></MatchCard>
                ))}
            </Row>
            <Row>
                <button onClick={createMatch} className="add-match-button">+ Add Match</button>
            </Row>
        </Container>
    )
}