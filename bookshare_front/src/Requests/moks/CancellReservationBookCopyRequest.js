import axios from "axios";

export function makeCancelReservationBookCopyRequest(token, id, version, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/copy/reservation/cancel`, {
        bookCopyId: id,
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
