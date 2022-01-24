import axios from "axios";

export function makeBookRequest(token, id, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/book/info/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            book: response.data

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError: true,
                requestFailed: true,
                response: response.response.data.message
            })
        }
    })
}