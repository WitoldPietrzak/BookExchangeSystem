import React from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";


class LoggedInHomePageNoTr extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {t} = this.props;
        const username = Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME);
        return (
            <div>
                Hello {username}
            </div>
        )
    }

}

const LoggedInHomePageTr = withTranslation()(LoggedInHomePageNoTr);

export default function () {
    return (
        <LoggedInHomePageTr/>
    )
}