import axios from "axios";

export function makeMoveShelfRequest(token, id, lng, lat, version, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shelf/move`, {
        shelfId: id,
        lat: lat,
        lng: lng,
        version: version
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {

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