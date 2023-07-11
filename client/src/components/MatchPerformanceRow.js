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

    const [placement, setPlacement] = useState([performanceData.placement]);

    function setPlace(place){
      updatePerformance(userToken, performanceData.id, 'placement', place);
      setPlacement(place);
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
                <h6 style={{color:"white"}}>Deck: {performanceData != null && performanceData.deckname}</h6>
            </Col>
            <Col>
              <div>
                <LabelDropdown value={"Pos: " + placement} 
                  items={Array.from({length: playerCount}, (x, i) => i+1)}
                  selected={setPlace}
                  />
              </div>
            </Col>
            <Col>
                <h6 style={{color:"white"}}>Finish: {performanceData != null && performanceData.finish}</h6>
            </Col>
            <Col>
                <h6 style={{color:"white"}}>Killed By: {performanceData != null && performanceData.killedby}</h6>
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