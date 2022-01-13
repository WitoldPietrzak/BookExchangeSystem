import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

export function makeRegisterRequest(login, password, email, that) {

    axios.post(process.env.REACT_APP_BACKEND_URL + "/user/register", {
        login: login,
        email: email,
        password: password,
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
                    button: that.props.t('Form.registerButton'),
                    errorCode:response.response.status.toString(10),
                    response:that.props.t(response.response.data.message),
                    requestFailed:true
                })
            }
        }
    })
}
