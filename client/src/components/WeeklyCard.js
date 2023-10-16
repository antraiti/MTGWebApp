import React from "react";
import {
  Link
} from "react-router-dom";
import Card from "react-bootstrap/Card";
import './../App.scss';
import CardHeader from "react-bootstrap/esm/CardHeader";
import { LocalDate } from "../util/TimeHelpers";

const isToday = (someDate) => {
  const today = new Date()
  const parsed = new Date(Date.parse(someDate))
  return parsed.getDate() === today.getDate() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getFullYear() === today.getFullYear()
}

export default function WeeklyCard(eventObject) {
    const eventInfo = eventObject.eventInfo;

    return(
      <div className="weekly-card">
        <Link to={"/Weeklies/" + eventInfo.id}>
          <Card border={isToday(eventInfo.time) ? "warning" : "secondary"} style={{ backgroundColor: "#232323", marginBottom: "20px", cursor: "pointer" }}>
            <CardHeader as="h5" style={{color:"white"}}>{eventInfo.name}</CardHeader>
            <Card.Body style={{color:"white"}}>{LocalDate(eventInfo.time+' GMT')}</Card.Body>
            <Card.Body style={{color:"white"}}>{eventInfo.themed ? "Themed" : "No Theme"}</Card.Body>
          </Card>
        </Link>
      </div>
    )
  }