import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";
import {render} from "react-dom";
import {Modal, Button} from "react-bootstrap";
import {useState} from "react";

export function makeLoginRequest(login, password, that) {

    const querystring = require('querystring');
    axios.post(process.env.REACT_APP_BACKEND_URL + "/login", querystring.stringify({
        login: login,
        password: password
    }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((response) => {
        Cookies.set(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME, response.data.access_token, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        Cookies.set(process.env.REACT_APP_FRONT_ROLES_COOKIE_NAME, JSON.stringify(response.data.access_levels), {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        Cookies.set(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME, login, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        Cookies.set(process.env.REACT_APP_APP_LANGUAGE_COOKIE_NAME, response.language, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        if (Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`) === undefined
            || Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`) == null
            || Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`) === process.env.REACT_APP_FRONT_ROLE_GUEST
            || !response.data.access_levels.some(e => e === Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`))) {
            Cookies.set(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`, findDefaultRole(response.data.access_levels), {
                expires: jwtCookieExpirationTime,
                secure: true,
                sameSite: 'none'
            });
        }
        // localStorage.setItem(process.env.REACT_APP_JWT_REFRESH_TOKEN_STORAGE_NAME, response.data.refreshJwtToken.token);
        window.location.hash = "#/home";
        window.location.reload();
    })

        .catch((response) => {
        if (response.response) {
            that.setState({
                button: that.props.t('Form.loginButton'),
                errorCode:response.response.status.toString(10),
                response:that.props.t(response.response.data.message),
                requestFailed:true
            })
        }
    })
}
