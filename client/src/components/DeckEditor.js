import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import configData from "./../config.json";
import userData from '../util/UserData';
import './Rules.scss';
import './../App.scss';
import './DeckEditor.scss';
import Cropper from 'react-easy-crop'
import { BarChart, Bar, Rectangle, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Sector, Cell,  } from 'recharts';
import { GeneratePicpos, ParsePicpos } from "../util/DeckHelper";


//Form will just be a text field to dump in deck list formatted in a good way that each attribute can be pulled
//separated by lines to denote, Commander, Partner, Companion, Deck, Sideboard
  async function getDeckInfo(token, id) {
    return fetch(configData.API_URL+'/deck/v2/'+id, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    }})
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        }
        return data.json();
    })
  }

  async function updateDeck(token, id, prop, val) {
    return fetch(configData.API_URL+'/deck/v2/'+id, {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify({'prop': prop, 'val': val})
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error(data.message);
        }
        if(prop != 'name' && prop != 'picpos') window.location.reload(false); //refreshes page we need to fix things so we dont use this
        return data.json();
    })
  }

export const DeckEditor = () => {
    const { id } = useParams();
    const { userToken } = userData();
    const [deckName, setDeckName] = useState("");
    const [deckCommander, setDeckCommander] = useState();
    const [deckPartner, setDeckPartner] = useState();
    const [deckCompanion, setDeckCompanion] = useState();
    const [cardList, setCardList] = useState([]);
    const [deckLegality, setDeckLegality] = useState();
    const [deckLegalityMessages, setDeckLegalityMessages] = useState([]);
    const [ctimer, setCtimer] = useState(null);

    // Cropping variables
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        updateDeck(userToken, id, 'picpos', GeneratePicpos(crop, zoom));
    }

    const [manaCurveValues, setManaCurveValues] = useState([]);
    const [manaColorValues, setManaColorValues] = useState([]);

    useEffect(() => {
        let mounted = true;
        getDeckInfo(userToken, id)
        .then(item => {
            if(mounted) {
                setDeckName(item.deck.name);
                setDeckCommander(item.deck.commander);
                setDeckPartner(item.deck.partner);
                setDeckCompanion(item.deck.companion);
                setCardList(item.cardlist);
                setDeckLegality(item.legality.legal);
                setDeckLegalityMessages(item.legality.messages);
                
                const chartValues = populateChart(item.cardlist);
                setManaCurveValues(chartValues[0]);
                setManaColorValues(chartValues[1]);

                var picpos = ParsePicpos(item.deck.picpos);
                if (picpos && picpos != null) {
                    setCrop(picpos.crop);
                    setZoom(picpos.zoom);
                }
            }
            })


        return () => mounted = false;

      }, [])
    
    function changeDelay(prop, val) {
        if (ctimer) {
          clearTimeout(ctimer);
          setCtimer(null);
        }
        setCtimer(
          setTimeout(() => {
            updateDeck(userToken, id, prop, val);
          }, 500)
        );
    }

    const getCardListAsText = () => {
        return cardList.sort((a,b) => a[1].name.localeCompare(b[1].name)).map(item => `${item[0].count} ${item[1].name}\n`);
    }

    function getCommanderImageUrl() {         
        const commanderId = deckCommander;
        if (!commanderId) {
            return '';
        }    

        let url = 'https://cards.scryfall.io/art_crop/front';
        url += '/' + commanderId.substring(0, 1);
        url += '/' + commanderId.substring(1, 2) + '/';
        url += commanderId + '.jpg';
  
        return url;      
      }
  
    const commanderRowStyle = {
        '--commander-image-url': `url(${getCommanderImageUrl()})`
    }

    const populateChart = (cardList) => {
        const manaValues = {};
        const manaColors = {
            'C': 0, //colorless
            'W': 0,
            'U': 0,
            'B': 0,
            'R': 0,
            'G': 0,
            'M': 0 //multicolor
        };
        
        cardList.forEach(deckCard => {
            const card = deckCard[1];
            
            if (!manaValues[card.mv]) {
                manaValues[card.mv] = 1;
            } else {
                manaValues[card.mv] += deckCard[0].count;
            }

            const uniqueChars = new Set();            
            for (let i = 0; i < card.cost.length; i++) {
                const char = card.cost[i];
                if (char.match(/[A-Za-z]/) && !uniqueChars.has(char) && char !== 'X') {
                    uniqueChars.add(char);
                }
            }            
            
            if (uniqueChars.size === 0) {
                manaColors['C'] += deckCard[0].count;            
            } else if (uniqueChars.size === 1) {
                manaColors[Array.from(uniqueChars)[0]] += deckCard[0].count;
            } else {
                manaColors['M'] += deckCard[0].count;
            }
        });
        
        const manaValuesReturn = [];
        for(const key of Object.keys(manaValues)) {
            manaValuesReturn.push({
                name: key,
                uv: manaValues[key],
                amt: manaValues[key],                
            })
        }

        const colorValuesReturn = [];
        for (const key of Object.keys(manaColors)) {
            if (manaColors[key] !== 0) {
                colorValuesReturn.push({
                    name: key,
                    value: manaColors[key],
                });
            }
        }


        return [manaValuesReturn, colorValuesReturn];
    }

    function getPieColor(dataEntry) {
         if (dataEntry.name === 'C') {
          return '#cccccc';
        } else if (dataEntry.name === 'W') {
          return '#ccccbb';
        } else if (dataEntry.name === 'U') {
          return '#4444cc';
        } else if (dataEntry.name === 'B') {
          return '#664466';
        } else if (dataEntry.name === 'R') {
          return '#cc4444';
        } else if (dataEntry.name === 'G') {
          return '#44cc44';
        } else if (dataEntry.name === 'M') {
          return '#cccc44';
        } else {
          return '#ff0000'; // Default color if no match
        }
      }
    

    return (
        <Container style={{ padding: "20px" }}>
            <div className="card-footer-container">
                <div className="footer-header mtg-font-bold">Deck Editor</div>
                {!deckLegality && deckLegalityMessages && deckLegalityMessages.map((mes) => (
                        <Card key={mes} style={{color:"red"}}>! {mes}</Card>
                    ))}
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        <InputGroup>
                        <InputGroup.Text>Deck Name</InputGroup.Text>
                        <Form.Control type="text" placeholder="Name" value={deckName ?? undefined} onChange={e => {setDeckName(e.target.value); changeDelay("name", e.target.value);}}/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Commander</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckCommander ?? undefined} onChange={e => updateDeck(userToken, id, "commander", e.target.value)}>
                            <option key="nothing" value={undefined}></option>
                            {cardList.map(card => 
                                <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Partner</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckPartner ?? undefined} onChange={e => updateDeck(userToken, id, "partner", e.target.value)}>
                        <option key="nothing" value={undefined}></option>
                        {cardList.map(card => 
                                <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                        <InputGroup.Text>Companion</InputGroup.Text>
                        <Form.Select type="select" placeholder="Name" value={deckCompanion ?? undefined} onChange={e => updateDeck(userToken, id, "companion", e.target.value)}>
                        <option key="nothing" value={undefined}></option>
                        {cardList.map(card => 
                                <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                )}
                        </Form.Select>
                        </InputGroup>
                    </Form>
                </Card>
                <Card style={{ backgroundColor: "#232323", padding: "20px", marginBottom: "20px" }}>
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>Sideboard</InputGroup.Text>
                            <Form.Select type="select" placeholder="Name" value={deckCompanion ?? undefined} onChange={e => updateDeck(userToken, id, "sideboard", e.target.value)}>
                                <option key="nothing" value={undefined}></option>
                                {cardList.map(card => 
                                        <option key={card[0].cardid} value={card[0].cardid}>{card[1].name}</option>
                                        )}
                                </Form.Select>
                        </InputGroup>
                        <br/>
                        {cardList.filter((card) => card[0].issideboard).map(card => 
                            <Card key={card[1].name}>
                                <Stack direction="horizontal">
                                    <label style={{ color: "white"}}>{card[1].name}</label>
                                    <Button variant="danger" style={{ width: "20px", height: "20px", padding:"0px"}} onClick={e => updateDeck(userToken, id, "-sideboard", card[0].cardid)}>x</Button>
                                </Stack>
                            </Card>
                            )}
                    </Form>
                </Card>
            
                <div className="footer-header mtg-font-bold">Deck Contents</div>
                <Card className="commander-crop flex-row flex-align-space-between">                    
                    <div className="flex-column">
                        <div className="cropper-container">
                            <Cropper
                                image={getCommanderImageUrl()}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 4}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="small accent light flex-align-center">Crop your commander's image above</div>
                    </div>
                    <div class="cropper-sample flex-row flex-grow" style={commanderRowStyle}>
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={manaColorValues}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                label
                            >
                            {manaColorValues.map((entry, index) => (
                                <Cell key={index} fill={getPieColor(entry)} />
                            ))}
                            </Pie>
                        </PieChart>
                        </ResponsiveContainer>
                        
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                            width={500}
                            height={300}
                            data={manaCurveValues}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="deck-contents-card">
                
                    <div className="card-grid">
                        {getCardListAsText()}               
                    </div>
                </Card>
            </div>

        </Container>
    )
    }