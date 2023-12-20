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

            const today = new Date();        
            if (LocalDate(item.event.time) === today.toLocaleDateString()) {
                startPollingWithExponentialBackoff(userToken, id);
            }
        }
        })
        getUsers(userToken)
        .then(item => {
            if(mounted) {
                setUsers(item)
            }
            })

        
        return () => mounted = false;
    }, [userToken, id])

      const startPollingWithExponentialBackoff = (userToken, id) => {
        let pollingInterval = 1000; // Initial polling interval (1 second)
        const maxPollingInterval = 30000; // Maximum polling interval (30 seconds)
      
        const poll = () => {
          getEventDetails(userToken, id)
            .then(item => {
              setEventDetails(item);
              setEventName(item.event.name);
              setDecks(item.decks);
            })
            .catch(error => {
              console.error('Error fetching event details:', error);
            })
            .finally(() => {
              console.log('poll test');
      
              // Adjust the polling interval with exponential backoff, but cap it at maxPollingInterval
              pollingInterval = Math.min(pollingInterval * 1.5, maxPollingInterval);
      
              // Schedule the next poll
              setTimeout(poll, pollingInterval);
            });
        };
      
        // Start the initial poll
        poll();
      };
      

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
                <button onClick={createMatch} className="add-match-button">+ Add Match</button>
            </Row>
            <Row>
                {eventDetails.matches != null && users != null && eventDetails.matches.sort((a, b) => { return b.match.id - a.match.id }).map((match) => (
                    <MatchCard key={match.match.id} matchInfo={match} userlist={users} decklist={decks}></MatchCard>
                ))}
            </Row>
            
        </Container>
    )
}