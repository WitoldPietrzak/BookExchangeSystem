import React from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import {Breadcrumbs} from "@material-ui/core";


function BreadCrumbs() {
    return (
        <Breadcrumbs aria-label="breadcrumb" className="text-muted">
            <HeaderView/>
        </Breadcrumbs>
    )
}

function HeaderView() {
    const str = useLocation().pathname.substring(1).split('/');
    let rows = [];
    const history = useNavigate();
    for (let i = 0; i < str.length; i++) {
        let url_str = [];
        for (let j = 0; j <= i; j++) {
            url_str.push("/");
            url_str.push(str[j]);
        }
        let joined_str = url_str.join("");
        const handleOnClick = () => history.push(joined_str);
        rows.push(
            <span key = {str[i]}>
                {" "} / {" "}
                <Link to={joined_str} href="#" onClick={handleOnClick}>
                    {str[i]}
                </Link>
            </span>
        )
    }
    return <span>{rows}</span>
}

export default BreadCrumbs;