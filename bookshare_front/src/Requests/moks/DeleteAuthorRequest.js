import axios from "axios";

export function makeDeleteAuthorRequest(token, id, version, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/author/delete`, {id: id, version: version}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({showDeleteSuccessModal: true});
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError: true,
                requestFailed:true,
                message:response.response.data.message
            });
        }
    })
}