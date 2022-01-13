import React from "react";
import Nav from "react-bootstrap/Nav";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

function Admin() {
    const {t} = useTranslation();
    document.title = t("Site.name");
    return (
        <Nav activeKey={window.location.hash}>
            <Nav.Link as={Link} to="/accounts">{t("Navbar.accounts")}</Nav.Link>
            <Nav.Link as={Link} to="/logs">{t("Navbar.logs")}</Nav.Link>
        </Nav>
    );
}


export default Admin;
