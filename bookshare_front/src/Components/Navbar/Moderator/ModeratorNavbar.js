import React, {Fragment} from "react";
import Nav from "react-bootstrap/Nav";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {NavDropdown} from "react-bootstrap";

function Moderator() {
    const {t} = useTranslation();
    return (
        <Nav activeKey={window.location.hash}>
            <NavDropdown title={t("Navbar.authors")} id={'xd'}>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/authors/add">{t("Navbar.authors.add")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/authors">{t("Navbar.authors.list")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.bookshelves")} id={'xd'}>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/shelves/add">{t("Navbar.bookshelves.add")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/shelves">{t("Navbar.bookshelves.list")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/shelves/map">{t("Navbar.bookshelves.map")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.genres")}>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/genres/add">{t("Navbar.genres.add")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/genres">{t("Navbar.genres.list")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.books")} id="navbarScrollingDropdown">
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books/add">{t("Navbar.books.add")}</Nav.Link>
                <NavDropdown.Divider/>
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books">{t("Navbar.books.list")}</Nav.Link>
            </NavDropdown>
            <NavDropdown title={t("Navbar.bookCopies")} id="navbarScrollingDropdown">
                <Nav.Link className="navStyle" style={{color: "rgb(127, 127, 127)"}}
                          href="/?#/books/copies">{t("Navbar.bookCopies.list")}</Nav.Link>
            </NavDropdown>
        </Nav>
    );
}


export default Moderator;
