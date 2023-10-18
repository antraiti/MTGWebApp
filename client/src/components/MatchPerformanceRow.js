import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import './../App.scss';
import './MatchPerformanceRow.scss';
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import userData from '../util/UserData';
import {LabelDropdown} from '../util/LabelDropdown';
import {DynamicLabelDropdown} from '../util/DynamicLabelDropdown';
import configData from "./../config.json";
import { Tooltip } from 'react-tooltip'

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
      } else if (data.status === 204) {
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
    const userDecks = performanceObject.decks;
    const endtime = performanceObject.endtime;

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
      if(performanceData.deckid === null || deckid === undefined || deckid.length <= 0 || deckid < 0) {return "Select Deck"}
      return performanceObject.decks.find((deck) => deck.id == deckid)?.name;
    }

    function getKilledByDisplayName() {
      if(performanceData.killedbyname === null || performanceData.killedbyname.length <= 0) {return "Killed By"}
      return performanceData.killedbyname;
    }

    /**
     * Takes the given commanderId and generated the scryfall art url for the commander
     * @returns string
     */
    function getCommanderImageUrl() {
      if (!userDecks) {
        return 'https://cards.scryfall.io/art_crop/front/0/e/0eb0e8e7-266f-441e-b1cd-12b8ec3f7d71.jpg'; // Imp's Mischief UwU
      }

      const activeDeck = performanceObject.decks.find((deck) => deck.id === performanceData.deckid);
      if (!activeDeck) {
        console.error('Cant find active user deck');
        return ""
      }

      const commanderId = activeDeck.commander;
      if (!activeDeck.commander || activeDeck.commander == null || activeDeck.commander === null) {
        return 'https://cards.scryfall.io/art_crop/front/0/e/0eb0e8e7-266f-441e-b1cd-12b8ec3f7d71.jpg';
      }
      let url = 'https://cards.scryfall.io/art_crop/front';
      url += '/' + commanderId.substring(0, 1);
      url += '/' + commanderId.substring(1, 2) + '/';
      url += commanderId + '.jpg';

      return url;      
    }

    const performanceRowStyle = {
      '--commander-image-url': `url(${getCommanderImageUrl()})`
    }

    function getImageClass() {
      if (endtime) {
        return 'flex-column image-column washed';
      } else {
        return 'flex-column image-column';
      }
    }

    const navigateToCommanderScryfall = async () => {
      const activeDeck = performanceObject.decks.find((deck) => deck.id === performanceData.deckid);
      if (!activeDeck) {
        console.error('Cant find active user deck');
        return ""
      }

      const commanderId = activeDeck.commander;
      const uri = ('https://www.scryfall.com/card/' + commanderId);
      //length is a current hack to get if a card is a scryfall eligible card since we will make custom ids shorter
      //In the future will have a flag to note if a card is real or custom
      if (commanderId && commanderId.length == 36) {
        window.open(uri);
      }
      return uri;
    }

    return(
      <div className="performance-row flex-row" style={performanceRowStyle} >
        <a 
          className={performanceData.placement === 1 ? 'winner ' + getImageClass() : getImageClass()}
          onClick={navigateToCommanderScryfall}
          data-tooltip-id="my-tooltip"
          data-tooltip-content={"Commander Name"}
          
        >     
        </a>
        <Tooltip id="my-tooltip" place="left" />
        <Card className="flex-column flex-grow">
          <Card.Body className={performanceData.placement === 1 ? 'winner' : ''}>
          <div className="flex-row align-items-center row-content">          
            <div className="flex-column">
              <h6 
                className={performanceData.placement === 1 ? 'bold accent' : ''}
              >
                {performanceData != null && (performanceData.placement === 1 ? '🏆 ' + performanceData.username : performanceData.username)}
              </h6>
            </div>
            <div className="flex-column flex-grow deck-name">
              <div>
                <DynamicLabelDropdown value={getDeckDisplayName()} 
                  items={performanceObject.decks.map((deck) => ({d: (new Date(Date.parse(deck.lastupdated)).toLocaleDateString("en-US") + ' ' + deck.name), v: deck.id})).reverse()}
                  selected={selectedDeck}
                  />
              </div>
            </div>
            <div className="flex-column">
              <div>
                <LabelDropdown className={placement === 1 ? 'accent' : ''} value={"Finished: " + placement} 
                  items={endtime ? Array.from({length: playerCount}, (x, i) => i+1) : Array.from({length: playerCount-1}, (x, i) => i+2)}
                  selected={selectedPlace}
                  />
              </div>
            </div>
            <div className="flex-column">
              <div>
                { starttime && 
                <LabelDropdown value={"Order: " + position} 
                  items={Array.from({length: playerCount}, (x, i) => i+1)}
                  selected={selectedPosition}
                  />}
              </div>
            </div>
            <div className="flex-column">
              <div>
              <DynamicLabelDropdown value={getKilledByDisplayName()} 
                  items={performanceObject.userlist.map((user) => ({d: user.username, v: user.publicid}))}
                  selected={selectedKilledBy}
                  />
              </div>
            </div>
            {starttime === null &&
            <div className="flex-column">
                <Button onClick={deletePerformance} variant="danger" style={{float:"right"}}>X</Button>
            </div>}
          </div>
          </Card.Body>
        </Card>
      </div>
    )
  }