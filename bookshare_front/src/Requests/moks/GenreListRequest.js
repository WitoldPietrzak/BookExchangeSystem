import axios from "axios";

export function makeGenreListRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/genre/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            genres: response.data.genres,
            active:0

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError:true,
                response: response.response.data.message,
                message: response.response.data.message,
                requestFailed: true
            })
        }
    })
}