import React from "react";
import Nav from "react-bootstrap/Nav";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

function Admin() {
    const {t} = useTranslation();
    return (
        <Nav activeKey={window.location.hash}>
            <Nav.Link as={Link} to="/shelves">{t("Navbar.bookshelves")}</Nav.Link>
            <Nav.Link as={Link} to="/books">{t("Navbar.books")}</Nav.Link>
        </Nav>
    );
}


export default Admin;
