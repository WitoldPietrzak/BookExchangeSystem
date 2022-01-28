import React,{Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Col, Row} from "react-bootstrap";


class LoggedInHomePageNoTr extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {t} = this.props;
        const username = Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME);
        return (
            <Fragment>
                <div className={'LoggedInHomePage'}>
                <Row>
                    <Col></Col>
                    <Col>Hello {username}</Col>
                    <Col></Col>
                </Row>
                </div>
            </Fragment>
        )
    }

}

const LoggedInHomePageTr = withTranslation()(LoggedInHomePageNoTr);

export default function () {
    return (
        <LoggedInHomePageTr/>
    )
}