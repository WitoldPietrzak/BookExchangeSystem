import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

export function makeRefreshTokenRequest(that) {

    axios.post(process.env.REACT_APP_BACKEND_URL + "/user/refresh",{
        token: Cookies.get(process.env.REACT_APP_FRONT_REFRESH_TOKEN_COOKIE_NAME),
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME)}`
        }
    }).then((response) => {
        Cookies.set(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME, response.data.accessToken, {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        Cookies.set(process.env.REACT_APP_FRONT_ROLES_COOKIE_NAME, JSON.stringify(response.data.roles), {
            expires: jwtCookieExpirationTime,
            secure: true,
            sameSite: 'none'
        });
        Cookies.set(process.env.REACT_APP_FRONT_REFRESH_TOKEN_COOKIE_NAME, response.data.refreshToken, {
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
        // window.location.reload();
    })

        .catch((response) => {
            if (response.response) {
                Cookies.remove(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                Cookies.remove(process.env.REACT_APP_FRONT_ROLES_COOKIE_NAME);
                Cookies.remove(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME);
                Cookies.remove(process.env.REACT_APP_FRONT_REFRESH_TOKEN_COOKIE_NAME);
                window.location.hash = "#/home";
                window.location.reload();
            }
        })
}
