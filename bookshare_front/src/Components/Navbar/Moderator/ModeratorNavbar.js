import React from "react";
import Nav from "react-bootstrap/Nav";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

function Admin() {
    const {t} = useTranslation();
    return (
        <Nav activeKey={window.location.hash}>
            <Nav.Link as={Link} to="/shelves">{t("Navbar.bookshelves")}</Nav.Link>
            <Nav.Link as={Link} to="/genres">{t("Navbar.genres")}</Nav.Link>
            <Nav.Link as={Link} to="/book">{t("Navbar.books")}</Nav.Link>
        </Nav>
    );
}


export default Admin;
