import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import userData from '../util/UserData';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type }  from 'react-bootstrap-table2-editor';
import './../App.scss';

//This should be moved to util since we will use it elsewhere
async function getColors() {
    return fetch('http://localhost:5000/colors', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        }
        return data.json();
    })
}

async function getDecks(token) {
    return fetch('http://localhost:5000/deck', {
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

async function newDeck(token) {
    return fetch('http://localhost:5000/deck', {
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

async function updateDeck(token, deck) {
    return fetch('http://localhost:5000/deck', {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify(deck)
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        }
        return data.json();
    })
}

async function getCardName(inputtext) {
    return fetch('https://api.scryfall.com/cards/named?fuzzy=' + inputtext, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        }
        return data.json();
    })
}

export const Decks = () => {
    const { user, setUserData, userName, userToken, removeUserData } = userData();
    const [colors, setColors] = useState([]);
    const [decks, setDecks] = useState([]);
    const createDeck = () => {
        newDeck(userToken);
    }
    const submitDeck = (rowinfo, columninfo) => {
        if(columninfo.dataField === 'commander') {
            getCardName(rowinfo.commander).then(items => {
                rowinfo.commander = items.name;
                updateDeck(userToken, rowinfo).then(() =>{window.location.reload(false);});
            });
        } else if (columninfo.dataField === 'partner') {
            getCardName(rowinfo.partner).then(items => {
                rowinfo.partner = items.name;
                updateDeck(userToken, rowinfo).then(() =>{window.location.reload(false);});
            });
        } else if (columninfo.dataField === 'companion') {
            getCardName(rowinfo.companion).then(items => {
                rowinfo.companion = items.name;
                updateDeck(userToken, rowinfo).then(() =>{window.location.reload(false);});
            });
        } else {
            updateDeck(userToken, rowinfo);
        }
    }
    const colHeaderStyle = {backgroundColor: 'white'}

    useEffect(() => {
        let mounted = true;
        getColors()
          .then(items => {
            if(mounted) {
              setColors(items)
            }
          })
        getDecks(userToken)
        .then(items => {
        if(mounted) {
            setDecks(items)
        }
        })
        return () => mounted = false;
      }, [])

    const columns = [{
        dataField: 'name',
        text: 'Deck Name',
        headerStyle: colHeaderStyle
      }, {
        dataField: 'commander',
        text: 'Commander',
        headerStyle: colHeaderStyle
      }, {
        dataField: 'partner',
        text: 'Partner',
        headerStyle: colHeaderStyle
      }, {
        dataField: 'companion',
        text: 'Companion',
        headerStyle: colHeaderStyle
      }, {
        dataField: 'identityid',
        text: 'Color',
        headerStyle: colHeaderStyle,
        formatter: (cell, row) => {
            const colorres = colors.find(x => x.id === cell)
            if(colorres)
                return colorres.name;
          },
        editor: {
            type: Type.SELECT,
            options: colors.map((colorinfo) => ({value: colorinfo.id, label: colorinfo.name}))
          }
      }, {
        dataField: 'power',
        text: 'Power',
        headerStyle: colHeaderStyle
      }, {
        dataField: 'link',
        text: 'Deck Link',
        headerStyle: colHeaderStyle
      }];
      
    return (
        <Container style={{ padding: "20px" }}>
            <div class="card-footer-container">
                <div class="footer-header mtg-font-bold">Decks</div>
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Button onClick={createDeck} type="button" variant="standard">New Deck</Button>
                    <BootstrapTable rowStyle={{backgroundColor: "white"}} 
                        keyField="id"
                        data={ decks }
                        columns={ columns }
                        striped hover condensed
                        cellEdit={ cellEditFactory({
                             mode: 'dbclick',
                             afterSaveCell: (oldValue, newValue, row, column) => { submitDeck(row, column) }
                        }) }/>
                </Card>
            </div>
        </Container>
    )
}