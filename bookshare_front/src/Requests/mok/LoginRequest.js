import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

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
        Cookies.set(process.env.REACT_APP_LANGUAGE_COOKIE_NAME, response.data.language.toUpperCase(), {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        Cookies.set(process.env.REACT_APP_FRONT_REFRESH_TOKEN_COOKIE_NAME, response.data.refresh_token, {
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
        window.location.hash = "#/home";
        window.location.reload();
    })

        .catch((response) => {
        if (response.response) {
            that.setState({
                button: 'Form.loginButton',
                errorCode:response.response.status.toString(10),
                response:response.response.data.message,
                requestFailed:true
            })
        }
    })
}
