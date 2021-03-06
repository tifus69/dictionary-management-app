import React from 'react';
import { useSelector } from 'react-redux';
import { NavbarBrand, Row, Col, Container, Nav } from 'reactstrap';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Logo from '../assets/logo.png';
import DictionaryAddPage from './DictionaryAddPage.component';
import DictionaryAllPage from './DictionaryAllPage.component';
import DictionaryPage from './DictionaryPage.component';
import DictionaryEditPage from './DictionaryEditPage.component';
import {
  IconAdd,
  IconList,
  StyledLink,
  StyledNavBar,
  VCenteredWrapper,
  VHCenteredWrapper,
} from '../styled/style';
import { AppState } from '../reducers/rootReducers';

const Home = () => {
  const dictionaries = useSelector(
    (state: AppState) => state.dictionariesReducer.dictionaries
  );

  return (
    <div>
      <StyledNavBar fixed="top">
        <ToastContainer />
        <NavbarBrand className="mr-auto">
          <img src={Logo} alt="logo" />
        </NavbarBrand>
      </StyledNavBar>
      <Container fluid>
        <Row>
          <Col
            xs="12"
            sm="3"
            style={{
              height: '100vh',
            }}
          >
            <VCenteredWrapper>
              <Nav vertical>
                <StyledLink to="/">
                  <IconList />
                  All dictionaries
                </StyledLink>
                <StyledLink to="/addDictionary">
                  <IconAdd />
                  Add a dictionary
                </StyledLink>
              </Nav>
            </VCenteredWrapper>
          </Col>

          <Col
            xs="12"
            sm="9"
            style={{
              height: '100vh',
              backgroundColor: '#fff',
            }}
          >
            <Switch>
              <Route exact path="/">
                {dictionaries.length ? (
                  <DictionaryAllPage />
                ) : (
                  <VHCenteredWrapper>
                    <h4>No dictionary available !</h4>
                  </VHCenteredWrapper>
                )}
              </Route>
              <Route path="/addDictionary">
                <DictionaryAddPage />
              </Route>
              <Route path="/dictionary">
                <DictionaryPage />
              </Route>
              <Route path="/editDictionary">
                <DictionaryEditPage />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
