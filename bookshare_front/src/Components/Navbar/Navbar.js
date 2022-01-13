import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {isAdmin, isLogged, isModerator, isUser} from "../../Routes/Router";
import GuestNavbar from "./Guest/GuestNavbar";
import LoggedInNavbar from "./LoggedIn/LoggedInNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, DropdownButton, NavDropdown, Row} from "react-bootstrap";
import './Navbar.css'
import {default as OrgNavbar} from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";
import UserNavbar from "./User/UserNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import ModeratorNavbar from "./Moderator/ModeratorNavbar";
import Nav from "react-bootstrap/Nav";
import Cookies from "js-cookie";

class NavbarNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.setState({
            language: Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME)
        })
    }

    languageSwitch() {
        const {t} = this.props;
        return (
            <Fragment>
                <NavDropdown title={this.state.language}>
                    <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}} as={Link}
                              to="/account">{t("Edit My Account")}</Nav.Link>
                    <NavDropdown.Divider/>
                    <Nav.Link onClick={this.logOut} style={{color: "rgb(127, 127, 127)"}}
                              className="navStyle">{t("Navbar.logout")}</Nav.Link>
                </NavDropdown>
            </Fragment>
        )
    }

    render() {
        const {t} = this.props;
        return (
            <OrgNavbar expand="lg" className=" nav-bar shadow-box-example" id="navbarDiv">
                <Container fluid>
                    <OrgNavbar.Brand as={Link} to="/">{t('Home')}</OrgNavbar.Brand>
                    <OrgNavbar.Toggle aria-controls="basic-navbar-nav"/>
                    <OrgNavbar.Collapse className="justify-content-end">
                        {createNavbar()}
                    </OrgNavbar.Collapse>
                </Container>
            </OrgNavbar>
        );
    }

}


const NavbarTr = withTranslation()(NavbarNoTr);

export default function Navbar() {
    return (
        <NavbarTr/>
    )
}

function createNavbar() {
    if (!isLogged()) {
        return <GuestNavbar/>;
    }
    let navbar = <div/>;
    if (isUser()) {
        navbar = <UserNavbar/>;
    } else if (isAdmin()) {
        navbar = <AdminNavbar/>;
    } else if (isModerator()) {
        navbar = <ModeratorNavbar/>;
    }
    return <Fragment>
        {navbar}
        <LoggedInNavbar/>
    </Fragment>;
}