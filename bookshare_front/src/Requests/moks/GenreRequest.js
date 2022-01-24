import axios from "axios";

export function makeGenreRequest(token,id, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/genre/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            genre: response.data

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError:true,
                requestFailed:true,
                response:response.response.data.message
            })
        }
    })
}