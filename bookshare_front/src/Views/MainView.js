import React, {Fragment} from "react";
import Cookies from "js-cookie";
import {withTranslation} from "react-i18next";
import {MDBContainer, MDBFooter} from "mdbreact";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import BreadCrumbs from "../Components/BreadCrumbs/BreadCrumbs";
import './MainView.css';
import Login from "../Components/Login/Login";
import Navbar from "react-bootstrap/Navbar";
import {default as SiteNavbar} from "../Components/Navbar/Navbar"
import Router from "../Routes/Router";
import i18n from "i18next";

export const jwtCookieExpirationTime = process.env.REACT_APP_FRONT_JWT_EXPIRATION_MS / (24 * 60 * 60 * 100)
export const activeRole = Cookies.get(process.env.REACT_APP_FRONT_ACTIVE_ROLE_COOKIE_NAME) !== undefined ? Cookies.get(process.env.REACT_APP_FRONT_ACTIVE_ROLE_COOKIE_NAME) : 'ROLE_GUEST';

class MainViewNoTr extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: '',
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: `lat: ${loc.coords.latitude} len:${loc.coords.longitude}`
                })
            })
        }
        Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME) === undefined ? Cookies.set(process.env.REACT_APP_LANGUAGE_COOKIE_NAME, i18n.language, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        }) : i18n.changeLanguage(Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME));
    }


    render() {
        const {t} = this.props;
        return (
            <div className="App container py-3 ">
                <SiteNavbar/>
                <BreadCrumbs/>
                <Router/>
                {/*<div>*/}
                {/*    {this.state.location} <br />*/}
                {/*</div>*/}

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
