import axios from "axios";
import Cookies from 'js-cookie';

export function makeAddBookRequest(token, title, author,genres,releaseDate, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/book/add`, {
        title:title,
        author:author,
        genres:genres,
        releaseDate:releaseDate
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
                    errorCode: response.response.status.toString(10),
                    response: response.response.data.message,
                    requestFailed: true
                })
            }
        }
    })
}
