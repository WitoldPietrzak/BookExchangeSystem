import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

export function makeChangePasswordRequest(token, newPassword, newPasswordConfirm, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/password/${token}`, {
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        that.setState({
            button:'Form.ChangePasswordButton',
            response: response.response.data.message,
            requestCompleted:true
        })
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    button:'Form.ChangePasswordButton',
                    errorCode: response.response.status.toString(10),
                    response: response.response.data.message,
                    requestFailed: true
                })
            }
        }
    })
}

export function makeVerifyPasswordTokenRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/password/${token}`, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        that.setState({
        })
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    errorCode: response.response.status.toString(10),
                    response: response.response.data.message,
                    initialRequestFailed: true
                })
            }
        }
    })
}
