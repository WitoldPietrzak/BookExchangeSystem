import React from "react";
import logo from "../logo.svg";
import {withTranslation} from "react-i18next";
import Navbar from "react-bootstrap/Navbar";
import {MDBContainer, MDBFooter} from "mdbreact";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import BreadCrumbs from "../Components/BreadCrumbs/BreadCrumbs";
import './MainView.css';

class MainViewNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            flag: "",
            language: "",
            location:'',
        }
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(loc =>{
                this.setState({
                    location:`lat: ${loc.coords.latitude} len:${loc.coords.longitude}`
                })
            })
        }
    }
    

    render() {
        const {t} = this.props;
        return (
            <div className="App container py-3 ">
                <Navbar collapseOnSelect expand="md" className=" nav-bar shadow-box-example mb-3">
                    <div id="navbarDiv" >
                    <Container fluid>
                        <Row>
                            <Col>
                                <Navbar.Brand as={Link} to="/"
                                              className="font-weight-bold text-muted justify-content-end">
                                    {t("Home")}
                                </Navbar.Brand>
                            </Col>
                        </Row>
                        <Row> <Col> <BreadCrumbs/> </Col> </Row>
                    </Container>
                    </div>
                </Navbar>
                <header className="App-header">
                    {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                    {/*<p>*/}
                    {/*    <code>Hello world</code>*/}
                    {/*</p>*/}
                    {/*<a*/}
                    {/*    className="App-link"*/}
                    {/*    href="https://reactjs.org"*/}
                    {/*    target="_blank"*/}
                    {/*    rel="noopener noreferrer"*/}
                    {/*>*/}
                    {/*    Learn React*/}
                    {/*</a>*/}
                    {this.state.location}
                </header>
                <MDBFooter color="blue" className="font-small pt-4 mt-4 bottom" id="footer">
                    <div className="footer-copyright text-right py-3">
                        <MDBContainer>
                            BookCross, &copy; {new Date().getFullYear()} Copyright by Witold Pietrzak
                        </MDBContainer>
                    </div>
                </MDBFooter>
            </div>
        );
    }
}

const MainViewTr = withTranslation()(MainViewNoTr)
export default function MainView() {
    return (
        <MainViewTr/>
    )
}
