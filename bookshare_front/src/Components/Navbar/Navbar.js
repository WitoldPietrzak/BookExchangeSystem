import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {isAdmin, isLogged, isModerator, isUser} from "../../Routes/Router";
import GuestNavbar from "./Guest/GuestNavbar";
import LoggedInNavbar from "./LoggedIn/LoggedInNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import {ButtonGroup, Container, Dropdown, NavDropdown, ToggleButton} from "react-bootstrap";
import {default as OrgNavbar} from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";
import UserNavbar from "./User/UserNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import ModeratorNavbar from "./Moderator/ModeratorNavbar";
import Nav from "react-bootstrap/Nav";
import Cookies from "js-cookie";
import './Navbar.css'
import Language from "./Language/Language";

class NavbarNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.setState({
            language: Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME)
        })
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
                        <Language/>
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