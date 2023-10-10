import React from "react";
import {
  Link
} from "react-router-dom";
import Card from "react-bootstrap/Card";
import './../App.scss';
import CardHeader from "react-bootstrap/esm/CardHeader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";


export default function DeckCard(deckObject) {
    const deckInfo = deckObject.deckInfo;
    const colorInfo = deckObject.colorInfo;
    const deckCommander = deckObject.commanderInfo;
    const deckPartner = deckObject.partnerInfo;
    const deckCompanion = deckObject.companionInfo;
    const performanceInfo = deckObject.performanceInfo;
    const deleteFunction = deckObject.deleteFunction;

    return(
      <Row direction="horizontal">
        <Col style={{margin:"0",padding:"0"}}>
          <Link to={"/DeckForm/" + deckInfo.id} style={{textDecoration: "none"}}>
            <Card className="deck-card h-100" border="secondary" style={{ backgroundColor: "#232323", marginBottom: "20px", cursor: "pointer" }}>
              <CardHeader as="h5" style={{color:"white"}}>
                  <Stack direction="horizontal">
                      {deckInfo.name}
                      <Stack direction="horizontal" style={{padding:"0px 10px 0px 10px"}}>
                          {colorInfo && colorInfo.id == 1 && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="silver" class="bi bi-file-fill" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          </svg>}
                          {colorInfo && colorInfo.white && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f8db" class="bi bi-file-fill" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          </svg>}
                          {colorInfo && colorInfo.blue && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#bcdaec" class="bi bi-file-fill" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          </svg>}
                          {colorInfo && colorInfo.black && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8f8985" class="bi bi-file-fill" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          </svg>}
                          {colorInfo && colorInfo.red && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f8a076" class="bi bi-file-fill" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          </svg>}
                          {colorInfo && colorInfo.green && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9cc597" class="bi bi-file-fill" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                          </svg>}
                      </Stack>
                      {deckCommander && <label style={{color:"white"}}>{deckCommander.name}</label>}
                      {deckPartner && <label style={{color:"white", margin:"0 0 0 5px"}}>/ {deckPartner.name}</label>}
                      {deckCompanion && <label style={{color:"grey", margin:"0 0 0 5px"}}>/ {deckCompanion.name}</label>}
                  </Stack>
              </CardHeader>
              <Stack direction="horizontal">
                  <Card.Body style={{color:"white"}}>last updated: {deckInfo.lastupdated}</Card.Body>
                  <Card.Body style={{color:"white"}}>last used: {deckInfo.lastused}</Card.Body>
              </Stack>
            </Card>
          </Link>
        </Col>
        {!performanceInfo && 
        <Col xs="auto" style={{margin:"0",padding:"0", display:"block"}}>
          <Button className="h-100" variant="danger" onClick={x => deleteFunction(deckInfo.id)} style={{height:"fill"}}>X</Button>
        </Col>}
      </Row>
    )
  }