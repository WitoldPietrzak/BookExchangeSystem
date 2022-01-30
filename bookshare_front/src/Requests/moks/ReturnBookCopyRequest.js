import axios from "axios";

export function makeReturnBookCopyRequest(token, id,bookshelfId, version, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/copy/return`, {
        bookCopyId: id,
        bookshelfId:bookshelfId,
        version: version
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
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
