import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

export function makeOwnAccountInfoRequest(token, that) {

    axios.get(process.env.REACT_APP_BACKEND_URL + "/user/info", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            id: response.data.id,
            login: response.data.login,
            email: response.data.email,
            language: response.data.language,
            activated: response.data.activated,
            disabled: response.data.disabled,
            roles:response.data.roles,
            lastSuccessfulLoginAttemptDateTime: response.data.lastSuccessfulLoginAttemptDateTime,
            creationDateTime: response.data.creationDateTime

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                response: response.response.data.message,
                requestFailed: true
            })
        }
    })
}

export function makeAnyAccountInfoRequest(token, id, that) {

    axios.post(process.env.REACT_APP_BACKEND_URL + "/user/register", {
        language: Cookies.get(process.env.REACT_APP_LANGUAGE_COOKIE_NAME)
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        window.location.hash = "#/home";
        window.location.reload();
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    button: 'Form.registerButton',
                    errorCode: response.response.status.toString(10),
                    response: response.response.data.message,
                    requestFailed: true
                })
            }
        }
    })
}
