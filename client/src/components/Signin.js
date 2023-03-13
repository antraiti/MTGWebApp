import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import "./../App.css"
import Container from "react-bootstrap/Container";
import { useNavigate  } from "react-router-dom";

async function loginUser(credentials) {
    return fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
    })
    .then(data => {
        if(data.status >= 400) {
            throw new Error("Server responds with error!");
        }
        return data.json();
    })
}

export const Signin = ({ setUserData }) => {
    const navigate = useNavigate();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const userData = await loginUser({
          username,
          password
        });
        setUserData(userData);

        navigate('/');
        navigate(0);
      }

    return (
        <Container>
            <Card style={{margin: "15px", padding: "15px", backgroundColor: "#28293d"}}>
                <Form style={{color: "white"}} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" onChange={e => setUserName(e.target.value)}>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" />
                        <Form.Text className="text-muted">
                        Currently no signups. Accounts are internal use only.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword" onChange={e => setPassword(e.target.value)}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button type="submit" variant="primary" style={{backgroundColor: "#5483df", borderWidth: "0px", justifySelf: "right"}}>
                    Sign in
                    </Button>
                </Form>
            </Card>
      </Container>
    )
}