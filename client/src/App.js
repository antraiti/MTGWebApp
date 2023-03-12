import logo from './BB.png';
import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {
  Link,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { Home } from './components/Home';
import { Banlist } from './components/Banlist';
import { Rules } from './components/Rules';
import { Signin } from './components/Signin';
import userData from './util/userData';
import './App.css';
import { Weeklies } from './components/Weeklies';

function App() {

  const { user, setUserData, userName, userToken } = userData();

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar variant="dark" className='navigation-bar'>
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Nav className='me-auto'>
              <Nav.Link as={Link} to="/Rules">Rules</Nav.Link>
              <Nav.Link as={Link} to="/Banlist">Banlist</Nav.Link>
              {user && <Nav.Link as={Link} to="/Weeklies">Weeklies</Nav.Link>}
            </Nav>
            <Nav>
              {!user && <Nav.Link as={Link} to="/Signin">
                <Button style={{backgroundColor: "#5483df", borderWidth: "0px"}}>Sign in</Button>
              </Nav.Link>}
              {user && <Nav.Link as={Link} to="/">{userName}</Nav.Link>}
            </Nav>
          </Container>
        </Navbar>
        <div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Banlist" element={<Banlist/>}/>
            <Route path="/Rules" element={<Rules/>}/>
            <Route path="/Signin" element={<Signin setUserData={setUserData}/>}/>
            <Route path="/Weeklies" element={<Weeklies/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
