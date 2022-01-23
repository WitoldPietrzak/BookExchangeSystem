import axios from "axios";

export function makeAuthorListRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/author/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            authors: response.data.authors

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError:true
            })
        }
    })
}