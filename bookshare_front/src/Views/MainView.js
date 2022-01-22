import React from "react";
import Cookies from "js-cookie";
import {withTranslation} from "react-i18next";
import {MDBContainer, MDBFooter} from "mdbreact";
import BreadCrumbs from "../Components/BreadCrumbs/BreadCrumbs";
import './MainView.css';
import {default as SiteNavbar} from "../Components/Navbar/Navbar"
import Router, {isLogged} from "../Routes/Router";
import i18n from "i18next";
import {makeRefreshTokenRequest} from "../Requests/mok/RefreshTokenRequest";
import {Button, Modal} from "react-bootstrap";
import {checkReadiness} from "../Requests/mok/ReadinessRequest";

export const jwtCookieExpirationTime = process.env.REACT_APP_FRONT_JWT_EXPIRATION_MS / (24 * 60 * 60 * 100)
export const activeRole = Cookies.get(process.env.REACT_APP_FRONT_ACTIVE_ROLE_COOKIE_NAME) !== undefined ? Cookies.get(process.env.REACT_APP_FRONT_ACTIVE_ROLE_COOKIE_NAME) : 'ROLE_GUEST';

class MainViewNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.readinessId = undefined;
        this.state = {
            refreshError: false,
            message: '',
            checkForReadiness: true
        };
        document.title = t("Site.name");
        Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME) === undefined ? Cookies.set(process.env.REACT_APP_LANGUAGE_COOKIE_NAME, i18n.language, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        }) : i18n.changeLanguage(Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME));
    }

    componentDidMount() {
        if (isLogged()) {
            setInterval(() => {
                makeRefreshTokenRequest(this)
            }, parseInt(process.env.REACT_APP_FRONT_REFRESH_TIME_MS));
        }
        if (this.state.checkForReadiness === true) {
            this.readinessId = setInterval(() => {
                    checkReadiness(this);
                }, parseInt(process.env.REACT_APP_FRONT_READINESS_CHECK_TIME_MS)
            );
        }

    }

    hideModal() {
        this.setState({
            refreshError: false
        })
    }


    render() {
        const {t} = this.props;
        return (
            <div className="App container py-3 ">
                <SiteNavbar/>
                <BreadCrumbs/>
                <div className='View'>
                    <Router/>
                </div>
                <MDBFooter color="blue" className="font-small pt-4 mt-4 bottom" id="footer">
                    <div className="footer-copyright text-right py-3">
                        <MDBContainer>
                            BookCross, &copy; {new Date().getFullYear()} Copyright by Witold Pietrzak

                        </MDBContainer>
                    </div>
                </MDBFooter>
                <Modal show={this.state.refreshError} onHide={this.hideModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('Error.Title')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{t(this.state.message)}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal.bind(this)}>{t('Button.Close')}</Button>
                    </Modal.Footer>
                </Modal>
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
