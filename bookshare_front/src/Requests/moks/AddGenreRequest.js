import axios from "axios";
import Cookies from 'js-cookie';

export function makeAddGenreRequest(token, nameCode, names, that) {
    const namesToSend = {};
    names.forEach((name) => {
        namesToSend[`${name.key}`] = name.value
    })

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/genre/add`, {
        nameCode: nameCode,
        names: namesToSend,
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            showSuccessModal: true,
            id:response.data.id
        })
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
