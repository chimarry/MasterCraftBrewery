import { React, useState, useEffect } from 'react';
import { useSessionStorage } from './util/Session.js';
import { Container, Row, Col } from 'reactstrap';
import Keycloak from 'keycloak-js';
import Home from './Home.js';
import './AdminPage.css';

function AdminPage(props) {
    const [keycloak, setKeycloak] = useState(null);
    const [token, setToken] = useSessionStorage("token", null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const keycloak = Keycloak("/keycloak.json");
        keycloak.init({ onLoad: "login-required", checkLoginIframe: false }).then((authenticated) => {
            if (token === "") {
                setToken(null);
                keycloak.logout();
            }
            else {
                setKeycloak(keycloak);
                setToken(keycloak.token);
                setAuthenticated(authenticated);
            }
        });
    }, [setToken, setKeycloak]);

    if (keycloak !== null) {
        if (authenticated)
            return (<>
                <Container className='admin-container' fluid>
                    <Row className='dark-main'>
                        <Col sm={2} className='admin-navmenu'>
                            <Home keycloak={keycloak} />
                        </Col>
                        <Col sm={10} className='admin-content'>
                            {props.children}
                        </Col>
                    </Row>
                </Container>
            </>);
        else return <div className='container-fluid login-container'>Prijava na sistem nije uspjela!</div>;
    }
    else return <div className='container-fluid login-container'>Učitavanje...</div>
}

export default AdminPage
