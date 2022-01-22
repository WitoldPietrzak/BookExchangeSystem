import React from "react";
import Nav from "react-bootstrap/Nav";
import {withTranslation} from "react-i18next";
import {Link} from "react-router-dom";

class GuestNavbarNoTr extends React.Component {

    render() {
        const {t} = this.props;
        return(
        <Nav activeKey={window.location.pathname}>
            <Nav.Link as={Link} to="/register">{t("Navbar.register")}</Nav.Link>
            <Nav.Link as={Link} to="/login">{t("Navbar.login")}</Nav.Link>
        </Nav>);
    }
}

const GuestNavbarTr = withTranslation()(GuestNavbarNoTr);

export default function GuestNavbar() {
    return (
        <GuestNavbarTr/>
    )
}