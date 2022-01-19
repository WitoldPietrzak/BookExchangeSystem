import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import {ButtonGroup, ToggleButton} from "react-bootstrap";
import Cookies from "js-cookie";
import {jwtCookieExpirationTime} from "../../../Views/MainView";
import i18n from "i18next";
import {isLogged} from "../../../Routes/Router";
import {makeSendChangePasswordMailRequest} from "../../../Requests/mok/SendChangePasswordMailRequest";
import {makeChangeLanguageRequest} from "../../../Requests/mok/ChangeLanguageRequest";

class LanguageNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME)
        }
    }

    changeLanguage(lang) {
        this.setState({
            language:lang
        })
        Cookies.set(process.env.REACT_APP_LANGUAGE_COOKIE_NAME, lang, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        i18n.changeLanguage(lang);
        if (isLogged()) {
            makeChangeLanguageRequest(Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME),lang, this);
        }
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <ButtonGroup>
                    <ToggleButton key={0} id={'PL'} value={'PL'} type={'radio'} size='sm' variant={'outline-dark'}
                                  checked={this.state.language === 'PL'}
                                  onChange={(e) => this.changeLanguage(e.currentTarget.value)}>PL</ToggleButton>
                    <ToggleButton key={1} id={'EN'} value={'EN'} type={'radio'} size='sm' variant={'outline-dark'}
                                  checked={this.state.language === 'EN'}
                                  onChange={(e) => this.changeLanguage(e.currentTarget.value)}>EN</ToggleButton>
                </ButtonGroup>
            </Fragment>
        );
    }

}


const LanguageTr = withTranslation()(LanguageNoTr);

export default function Language() {
    return (
        <LanguageTr/>
    )
}
