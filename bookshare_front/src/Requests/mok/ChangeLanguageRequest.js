import axios from "axios";

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
                })
            }
        }
    })
}
