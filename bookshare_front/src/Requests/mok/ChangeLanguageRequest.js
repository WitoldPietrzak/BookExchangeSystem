import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

export function makeChangeLanguageRequest(token, lang, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/language`, {
        language: lang
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    // button:'Form.registerButton',
                    // errorCode:response.response.status.toString(10),
                    // response:response.response.data.message,
                    // requestFailed:true
                })
            }
        }
    })
}
