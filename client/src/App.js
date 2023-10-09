import logo from './rumble_colored.png';
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
import userData from './util/UserData';
import './App.scss';
import { Weeklies } from './components/Weeklies';
import { Decks } from './components/Decks';
import { WeeklyDetails } from './components/WeeklyDetails';
import { DeckCheck } from './components/DeckCheck';
import { DeckForm } from './components/DeckForm';
import { DeckEditor } from './components/DeckEditor';


function App() {

  const { user, setUserData, userName, userToken, removeUserData } = userData();
  
  const signOut = () => {
    removeUserData();

    window.location.reload(false);
  }

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
              <Nav.Link as={Link} to="/DeckCheck">Deck Check</Nav.Link>
            </Nav>
            <Nav>
              {userToken && <Nav.Link as={Link} to="/Weeklies">Weeklies</Nav.Link>}
              {userToken && <Nav.Link as={Link} to="/Decks">Decks</Nav.Link>}
              {!user && <Nav.Link as={Link} to="/Signin">Sign In</Nav.Link>}
              {user && <Nav.Link as={Link} to="/">{userName}</Nav.Link>}
              {user && <Nav.Link onClick={signOut}> Sign Out</Nav.Link>}
            </Nav>
          </Container>
        </Navbar>
        <div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Banlist" element={<Banlist/>}/>
            <Route path="/Rules" element={<Rules/>}/>
            <Route path="/DeckCheck" element={<DeckCheck/>}/>
            <Route path="/Signin" element={<Signin setUserData={setUserData}/>}/>
            <Route path="/Weeklies" element={<Weeklies/>}/>
            <Route path="/Weeklies/:id" element={<WeeklyDetails/>}/>
            <Route path="/Decks" element={<Decks/>}/>
            <Route path="/DeckForm" element={<DeckForm/>}/>
            <Route path="/DeckForm/:id" element={<DeckEditor/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
