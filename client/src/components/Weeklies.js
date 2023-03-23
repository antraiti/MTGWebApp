import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type }  from 'react-bootstrap-table2-editor';
import './Rules.scss';
import './../App.scss';
import userData from '../util/UserData';
import Button from "react-bootstrap/esm/Button";

async function getEvents(token) {
    return fetch('http://localhost:5000/event', {
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

async function newEvent(token) {
    return fetch('http://localhost:5000/event', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify("")
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        }
        return data.json();
    })
}

export const Weeklies = () => {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const [events, setEvents] = useState([]);
    const createEvent = () => {
        newEvent(userToken);
    }

    useEffect(() => {
        let mounted = true;
        getEvents(userToken)
        .then(items => {
        if(mounted) {
            setEvents(items)
        }
        })
        return () => mounted = false;
      }, [])

    const colHeaderStyle = {backgroundColor: 'white'}
    const columns = [{
        dataField: 'name',
        text: 'Event Name',
        headerStyle: colHeaderStyle
    }, {
        dataField: 'time',
        text: 'Date',
        headerStyle: colHeaderStyle
    }, {
        dataField: 'themed',
        text: 'Themed',
        headerStyle: colHeaderStyle
    }];

    return (
        <Container style={{ padding: "20px" }}>
            <Row>
                <div className="card-footer-container">
                    <div className="footer-header mtg-font-bold">Weeklies</div>
                    <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                        <Button type="button" variant="standard" onClick={createEvent}>New Event</Button>
                        <BootstrapTable rowStyle={{backgroundColor: "white"}} 
                            keyField="id"
                            data={ events }
                            columns={ columns }
                            striped hover condensed
                            cellEdit={ cellEditFactory({
                                mode: 'dbclick',
                                afterSaveCell: (oldValue, newValue, row, column) => {  }
                            })}/>
                    </Card>
                </div>
            </Row>
        </Container>
    )
}