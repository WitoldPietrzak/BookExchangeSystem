import {Button, Dropdown, DropdownButton, NavDropdown} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import React, {Fragment} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {jwtCookieExpirationTime} from "../../../Views/MainView";
import Navbar from "../Navbar";


function updateAccessLevel(access_level) {
    Cookies.set(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`, access_level, {
        expires: jwtCookieExpirationTime,
        secure: true,
        sameSite: 'none'
    });
    window.location.hash = "#/home";
    window.location.reload();
}

class LoggedInNavbarNoTr extends React.Component {
    constructor(props) {
        super(props);
    }

    generateAvailableRoles() {
        const {t} = this.props;
        const accessLevels = JSON.parse(Cookies.get(process.env.REACT_APP_FRONT_ROLES_COOKIE_NAME));
        const accessLevelLinks = [];
        for (let i in accessLevels) {
            accessLevelLinks.push(<Dropdown.Item
                style={{color: "rgb(127, 127, 127)"}}
                key={i}
                onClick={() => {
                    updateAccessLevel(accessLevels[i])
                }}> {t(accessLevels[i])}</Dropdown.Item>);
        }
        return accessLevelLinks;
    }

    logOut() {
        Cookies.remove(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        Cookies.remove(process.env.REACT_APP_FRONT_ROLES_COOKIE_NAME);
        Cookies.remove(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME);
        window.location.hash = "#/home";
        window.location.reload();
    }

    generateRoleButton() {
        const {t} = this.props;
        const accessLevels = JSON.parse(Cookies.get(process.env.REACT_APP_FRONT_ROLES_COOKIE_NAME));
        if (accessLevels.length > 1) {
            return (
                <DropdownButton variant="secondary btn-sm" style={{marginTop: "5px"}}
                                title={t(Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`))}>
                    {this.generateAvailableRoles()}
                </DropdownButton>
            )
        } else if (Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`) !== process.env.REACT_APP_FRONT_ROLE_USER) {
            return (
                <Button variant="secondary btn-sm" style={{marginTop: "5px"}}
                        title={t(Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`))}>

                </Button>
            )
        }
    }


    render() {
        const {
            t
        }

            = this.props;
        return (
            <Fragment>
                <NavDropdown title={t("Navbar.account")} id="navbarScrollingDropdown">
                    <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}} as={Link}
                              to="/account">{t("Edit My Account")}</Nav.Link>
                    <NavDropdown.Divider/>
                    <Nav.Link onClick={this.logOut} style={{color: "rgb(127, 127, 127)"}}
                              className="navStyle">{t("Navbar.logout")}</Nav.Link>
                </NavDropdown>
                <DropdownButton variant="secondary btn-sm" style={{marginTop: "5px", marginRight:"10px"}}
                                title={t(Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`))}>
                    {this.generateAvailableRoles()}
                </DropdownButton>
                <Nav.Item>
                     {Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}
                </Nav.Item>
            </Fragment>
        )
    }

}

const LoggedInNavbarTr = withTranslation()(LoggedInNavbarNoTr);
export default function LoggedInNavbar() {
    return (
        <LoggedInNavbarTr/>
    )
}

