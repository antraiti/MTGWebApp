import logo from './rumble_colored.png';
import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
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
import { LinkContainer } from 'react-router-bootstrap';



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
            <Navbar.Brand as={Link} to="/" className='relative'>
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Nav className="flex-row flex-grow flex-align-space-between">
              <div className="flex-row">
                <LinkContainer to="/Rules">
                  <Nav.Link as={Link} >Rules</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/Banlist">
                  <Nav.Link as={Link} >Banlist</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/DeckCheck">
                  <Nav.Link as={Link} >Deck Check</Nav.Link>
                </LinkContainer>
              </div>
              <div className="flex-row">
                {userToken && 
                  <LinkContainer to="/Weeklies">
                    <Nav.Link as={Link}>Weeklies</Nav.Link>
                  </LinkContainer>
                }
                {userToken && 
                  <LinkContainer to="/Decks">
                  <Nav.Link as={Link}>Decks</Nav.Link>
                  </LinkContainer>
                }
                {!user && 
                  <LinkContainer to="/Signin">
                  <Nav.Link as={Link}>Sign In</Nav.Link>
                  </LinkContainer>
                }
                {user && 
                  <Nav.Link as={Link} to="/">{userName}</Nav.Link>
                }
                {user && 
                  <Nav.Link onClick={signOut}> Sign Out</Nav.Link>
                }
              </div>
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
