import React, {useState} from "react";
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
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {LabelDropdown} from '../util/LabelDropdown';
import {DynamicLabelDropdown} from '../util/DynamicLabelDropdown';

async function getDecks(token, userid) {
  return fetch('http://localhost:5000/deck/'+userid, {
  method: 'GET',
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token
  }})
  .then(data => {
      if(data.status >= 400) {
          throw new Error("Server responds with error!");
      } else if (data.status == 204) {
          return [];
      }
      return data.json();
  })
}

async function updatePerformance(token, id, key, val) {
  return fetch('http://localhost:5000/performance', {
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

export default function MacthPerformanceRow(performanceObject) {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const performanceData = performanceObject.performanceData;
    const playerCount = performanceObject.playerCount;
    const users = performanceObject.userlist;

    const [placement, setPlacement] = useState([performanceData.placement]);
    const [position, setPosition] = useState([performanceData.order]);
    const [deckid, setDeckid] = useState([performanceData.deckid]);
    const [killedby, setKilledby] = useState([performanceData.killedby]);

    function selectedPlace(selectedPlace){
      updatePerformance(userToken, performanceData.id, 'placement', selectedPlace);
      setPlacement(selectedPlace);
    }

    function selectedPosition(selectedPosition){
      updatePerformance(userToken, performanceData.id, 'order', selectedPosition);
      setPosition(selectedPosition);
    }

    function selectedDeck(selectedDeck){
      updatePerformance(userToken, performanceData.id, 'deckid', selectedDeck);
    }
    function selectedKilledBy(selectedKilledBy){
      updatePerformance(userToken, performanceData.id, 'killedby', selectedKilledBy);
    }

    function getDeckDisplayName() {
      if(performanceData.deckid == null || deckid == undefined || deckid.length <= 0 || deckid < 0) {return "Select Deck"}
      return performanceObject.decks.find((deck) => deck.id == deckid)?.name;
    }

    function getKilledByDisplayName() {
      if(performanceData.killedbyname == null || performanceData.killedbyname.length <= 0) {return "Killed By"}
      return performanceData.killedbyname;
    }

    return(
      <div className="performance-row">
        <Card style={{ backgroundColor: "#232323", marginLeft: "20px", marginRight: "00px"}}>
          <Card.Body style={{padding:"2px"}}>
          <Row className="align-items-center">
            <Col>
              <h6 style={{color:"white"}}>{performanceData != null && performanceData.username}</h6>
            </Col>
            <Col>
              <div>
                <DynamicLabelDropdown value={getDeckDisplayName()} 
                  items={performanceObject.decks.map((deck) => ({d: deck.name, v: deck.id}))}
                  selected={selectedDeck}
                  />
              </div>
            </Col>
            <Col>
              <div>
                <LabelDropdown value={"Finished: " + placement} 
                  items={Array.from({length: playerCount}, (x, i) => i+1)}
                  selected={selectedPlace}
                  />
              </div>
            </Col>
            <Col>
              <div>
                <LabelDropdown value={"Order: " + position} 
                  items={Array.from({length: playerCount}, (x, i) => i+1)}
                  selected={selectedPosition}
                  />
              </div>
            </Col>
            <Col>
              <div>
              <DynamicLabelDropdown value={getKilledByDisplayName()} 
                  items={performanceObject.userlist.map((user) => ({d: user.username, v: user.publicid}))}
                  selected={selectedKilledBy}
                  />
              </div>
            </Col>
            <Col>
                <h6 style={{color:"red", textAlign:"end"}}>X</h6>
            </Col>
          </Row>
          </Card.Body>
        </Card>
      </div>
    )
  }