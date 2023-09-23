import React, { useEffect, useState } from "react";
import {
  Link
} from "react-router-dom";
import Card from "react-bootstrap/Card";
import './../App.scss';
import CardHeader from "react-bootstrap/esm/CardHeader";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import userData from '../util/UserData';
import MatchPerformanceRow from "./MatchPerformanceRow";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import configData from "./../config.json";


async function updateMatchTimestamp(token, match, prop) {
  return fetch(configData.API_URL+'/match', {
  method: 'PUT',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token
  },
  body: JSON.stringify({'prop': prop, 'match': match})
  })
  .then(data => {
      if(data.status >= 400) {
          throw new Error(data.message);
      }
      window.location.reload(false); //refreshes page
      return data.json();
  })
}

async function newPerformance(token, user, match) {
  return fetch(configData.API_URL+'/performance', {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token
  },
  body: JSON.stringify({user: user, match: match})
  })
  .then(data => {
      if(data.status >= 400) {
          throw new Error(data.message);
      }
      window.location.reload(false); //refreshes page
      return data.json();
  })
}

export default function MatchCard(matchObject) {
  const { user, setUserData, userName, userToken, removeUserData } = userData();
  const matchInfo = matchObject.matchInfo.match;
  const users = matchObject.userlist;
  const decks = matchObject.decklist;
  const performances = matchObject.matchInfo.performances;
  
  const timestampMatch = (start) => {
    const ts = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    start ? matchInfo.start = ts : matchInfo.end = ts;
    updateMatchTimestamp(userToken, matchInfo, start ? "start" : "end");
  }
  const createPerformance = (user) => {
    newPerformance(userToken, user, matchInfo);
  }
    return(
      <div className="match-card" style={{marginBottom: "40px"}}>
        <Card style={{ backgroundColor: "#383838", marginBottom: "0px"}}>
          <Card.Body style={{padding:"5px"}}>
          <Row>
            <Col>
              <h5 as="h5" style={{color:"white"}}>{matchInfo.name}</h5>
            </Col>
            <Col>
              {matchInfo.start != null ? 
              (<span style={{display:"flex"}}><h6 as="h5" style={{color:"white", textAlign:"end", paddingRight:"5px"}}>Start:</h6><h6 as="h5" style={{color:"grey", textAlign:"end"}}>{matchInfo.start}</h6></span>)
              : 
              (<h6 onClick={() => timestampMatch(true)} style={{color:"lime", cursor:"pointer"}}>Start Match</h6>)}
            </Col>
            <Col>
              {matchInfo.start != null ?
              matchInfo.end != null ? 
              (<span style={{display:"flex"}}><h6 as="h5" style={{color:"white", textAlign:"end", paddingRight:"5px"}}>End:</h6><h6 as="h5" style={{color:"grey", textAlign:"end"}}>{matchInfo.end}</h6></span>)
              : 
              (<h6 onClick={() => timestampMatch(false)} style={{color:"red", cursor:"pointer"}}>End Match</h6>)
            : (<h5 as="h5" style={{color:"white", textAlign:"end"}}></h5>)}
            </Col>
          </Row>
          </Card.Body>
        </Card>
        {performances != null && performances.map((performance) => (
              <MatchPerformanceRow performanceData={performance} playerCount={performances.length} userlist={users} decks={decks.filter(deck => deck.userid === performance.userid)}/>
          ))}
        <DropdownButton size="sm" variant="secondary" title="Add Player" style={{cursor:"pointer", marginLeft:"20px"}}>
          {users != null && users.map((user) => (
              <Dropdown.Item onClick={() => createPerformance(user)}>{user.username}</Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
    )
  }