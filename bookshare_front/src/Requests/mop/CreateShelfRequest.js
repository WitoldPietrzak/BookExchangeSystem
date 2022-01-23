import axios from "axios";

export function makeCreateShelfRequest(token,location, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shelf/add`, {
        latitude: location.lat,
        longitude: location.lng,
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
            that.setState({
                errorCode: response.response.status.toString(10),
                response: response.response.data.message,
                requestFailed: true
            })
        }
    })
}