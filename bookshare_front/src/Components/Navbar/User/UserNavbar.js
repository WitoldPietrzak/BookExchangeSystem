import React from "react";
import Nav from "react-bootstrap/Nav";
import {useTranslation} from "react-i18next";
import {NavDropdown} from "react-bootstrap";

function User() {
    const {t} = useTranslation();
    return (
        <Nav activeKey={window.location.hash}>
            <NavDropdown title={t("Navbar.own")} id={'ownBooks'}>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books/copies/my">{t("Navbar.own")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.bookshelves")} id={'bookShelves'}>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/shelves">{t("Navbar.bookshelves.list")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/shelves/map">{t("Navbar.bookshelves.map")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.books")} id="navbarScrollingDropdown">
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/#/books/add">{t("Navbar.books.add")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books">{t("Navbar.books.list")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.bookCopies")} id="navbarScrollingDropdown">
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books/copies/add">{t("Navbar.bookCopy.add")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books/copies">{t("Navbar.bookCopies.list")}</Nav.Link>
            </NavDropdown>
        </Nav>
    );
}


export default User;
