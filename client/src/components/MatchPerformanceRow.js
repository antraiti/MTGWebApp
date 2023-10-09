import React, {useState} from "react";
import {
  Link
} from "react-router-dom";
import Card from "react-bootstrap/Card";
import './../App.scss';
import './MatchPerformanceRow.scss';
import CardHeader from "react-bootstrap/esm/CardHeader";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import userData from '../util/UserData';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {LabelDropdown} from '../util/LabelDropdown';
import {DynamicLabelDropdown} from '../util/DynamicLabelDropdown';
import configData from "./../config.json";

async function getDecks(token, userid) {
  return fetch(configData.API_URL+'/deck/'+userid, {
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

export default function MacthPerformanceRow(performanceObject) {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const performanceData = performanceObject.performanceData;
    const playerCount = performanceObject.playerCount;
    const users = performanceObject.userlist;
    const starttime = performanceObject.starttime;
    const deckCommanderId = performanceObject.deckcommander;

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

    function deletePerformance(){
      updatePerformance(userToken, performanceData.id, 'delete', 'delete');
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

    /**
     * Takes the given commanderId and generated the scryfall art url for the commander
     * @returns string
     */
    function getCommanderImageUrl() {
      // Example: https://cards.scryfall.io/art_crop/front/c/e/ce4c6535-afea-4704-b35c-badeb04c4f4c.jpg
      
      const url = 'https://cards.scryfall.io/art_crop/front';
      url += '/' + commanderId.subString(0, 1);
      url += '/' + commanderId.subString(1, 1) + '/';
      url += commanderId + '.jpg';

      return url;      
    }

    const performanceRowStyle = {
      '--commander-image-url': `url(${getCommanderImageUrl()})`
    }

    return(
      <div className="performance-row" style={performanceRowStyle}>
        <Card>
          <Card.Body style={{padding:"2px"}} className={selectedPosition === 1 ? 'winner' : ''}>
          <Row className="align-items-center row-content">
            <Col>
              <h6 
                style={{color:"white"}}
                className={selectedPosition === 1 ? 'bold' : ''}
              >
                {performanceData != null && (selectedPosition === 1 ? '🏆 ' + performanceData.username : performanceData.username)}
              </h6>
            </Col>
            <Col>
              <div>
                <DynamicLabelDropdown value={getDeckDisplayName()} 
                  items={performanceObject.decks.map((deck) => ({d: (new Date(Date.parse(deck.lastupdated)).toLocaleDateString("en-US") + ' ' + deck.name), v: deck.id})).reverse()}
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
            {starttime == null &&
            <Col>
                <Button onClick={deletePerformance} variant="danger" style={{float:"right"}}>X</Button>
            </Col>}
          </Row>
          </Card.Body>
        </Card>
      </div>
    )
  }