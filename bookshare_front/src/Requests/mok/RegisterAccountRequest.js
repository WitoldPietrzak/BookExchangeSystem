import axios from "axios";
import Cookies from 'js-cookie';

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
                    button:'Form.registerButton',
                    errorCode:response.response.status.toString(10),
                    response:response.response.data.message,
                    requestFailed:true
                })
            }
        }
    })
}
