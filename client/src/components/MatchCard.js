import React from "react";
import Card from "react-bootstrap/Card";
import './../App.scss';
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import userData from '../util/UserData';
import MatchPerformanceRow from "./MatchPerformanceRow";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import configData from "./../config.json";
import LocalTime from "./../util/TimeHelpers"


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

async function updatePerformance(token, id, key, val) {
  return fetch(configData.API_URL+'/performance', {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify({'id': id, [key]: val})
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
  const { userToken } = userData();
  const matchInfo = matchObject.matchInfo.match;
  const users = matchObject.userlist;
  const decks = matchObject.decklist;
  const performances = matchObject.matchInfo.performances;
  
  const timestampMatch = (start) => {
    const ts = require('moment')().utc().format('YYYY-MM-DD HH:mm:ss');
    if (start) {
      updatePerformance(userToken, performances[Math.floor(Math.random() * performances.length)].id, 'order', 1);
      matchInfo.start = ts;
      updateMatchTimestamp(userToken, matchInfo, start ? "start" : "end");
    } else {
      matchInfo.end = ts;
      updateMatchTimestamp(userToken, matchInfo, start ? "start" : "end");
    }
  }
  const deleteMatch = () => {
    updateMatchTimestamp(userToken, matchInfo, "delete");
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
              (<span style={{display:"flex"}}><h6 as="h5" style={{color:"white", textAlign:"end", paddingRight:"5px"}}>Start:</h6><h6 as="h5" style={{color:"grey", textAlign:"end"}}>{LocalTime(matchInfo.start)}</h6></span>)
              : 
              (<h6 onClick={() => timestampMatch(true)} style={{color:"lime", cursor:"pointer"}}>Start Match</h6>)}
            </Col>
            <Col>
              {matchInfo.start != null ?
              matchInfo.end != null ? 
              (<span style={{display:"flex"}}><h6 as="h5" style={{color:"white", textAlign:"end", paddingRight:"5px"}}>End:</h6><h6 as="h5" style={{color:"grey", textAlign:"end"}}>{LocalTime(matchInfo.end)}</h6></span>)
              : 
              (<h6 onClick={() => timestampMatch(false)} style={{color:"red", cursor:"pointer"}}>End Match</h6>)
            : (<h5 as="h5" style={{color:"white", textAlign:"end"}}></h5>)}
            </Col>
            <Col>
              {matchInfo.start == null && (<Button as="h5" onClick={deleteMatch} variant="danger" style={{float:"right"}}>X</Button>)}
            </Col>
          </Row>
          </Card.Body>
        </Card>
        {performances != null && performances.map((performance) => (
              <MatchPerformanceRow key={performance.id} performanceData={performance} playerCount={performances.length} userlist={users} starttime={matchInfo.start} endtime={matchInfo.end} decks={decks.filter(deck => deck.userid === performance.userid)}/>
          ))}
        <DropdownButton size="sm" variant="secondary" title="Add Player" style={{cursor:"pointer", marginLeft:"20px"}}>
          {users != null && users.map((user) => (
              <Dropdown.Item key={user.publicid} onClick={() => createPerformance(user)}>{user.username}</Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
    )
  }