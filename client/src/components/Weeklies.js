import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import './Rules.css';
import './../App.css';
import useToken from '../util/UserData';


export const Weeklies = () => {
    const { token } = useToken();

    return (
        <Container style={{ padding: "20px" }}>
            <Row>
                <Card style={{ backgroundColor: "#28293d", padding: "20px", marginBottom: "20px" }}>
                    <h2 className="section-header">{token}</h2>
                </Card>
            </Row>
        </Container>
    )
}