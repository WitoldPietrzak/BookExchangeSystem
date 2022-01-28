import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Tab, Tabs} from "react-bootstrap";
import './UserHomePage.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import QuickSearchBook from "../../QuickSearchBook/QuickSearchBook";
import QuickSearchBookshelf from "../../QuickSearchBookshelf/QuickSearchBookshelf";
import NearbyMap from "../../NearbyMap/NearbyMap";

class UserHomePageNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <div className="Tabs pt-3 pb-3">
                            <div className='Map m-auto mt-5 mb-5'>
                                <NearbyMap/>
                            </div>
                </div>
            </Fragment>
        )
    }
}

const UserHomePageTr = withTranslation()(UserHomePageNoTr);

export default function UserHomePage() {
    return (
        <UserHomePageTr/>
    )
}