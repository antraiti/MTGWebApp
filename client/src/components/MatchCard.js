import React from "react";
import {
  Link
} from "react-router-dom";
import Card from "react-bootstrap/Card";
import './../App.scss';
import CardHeader from "react-bootstrap/esm/CardHeader";

export default function MatchCard(matchObject) {
    const matchInfo = matchObject.matchInfo;

    return(
      <div className="match-card">
        <Card style={{ backgroundColor: "#232323", marginBottom: "20px"}}>
            <CardHeader as="h5" style={{color:"white"}}>{matchInfo.name}</CardHeader>
        </Card>
      </div>
    )
  }