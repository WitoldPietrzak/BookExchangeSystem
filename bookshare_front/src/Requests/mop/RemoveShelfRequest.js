import axios from "axios";
import {makeGeocodingRequest} from "../api/GoogleGeocodingRequest";

export function makeRemoveShelfRequest(token, id,version, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shelf/remove`, {
        id: id,
        version:version
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        window.location.hash = "#/shelves";
        window.location.reload();
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