import axios from "axios";

export function makeMoveBookCopyRequest(token, id, shelfId, version, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/copy/move`, {
        id: id, bookshelfId:shelfId,version: version}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({moveSuccess: true});
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError: true,
                requestFailed:true,
                response:response.response.data.message
            })
        }
    })
}