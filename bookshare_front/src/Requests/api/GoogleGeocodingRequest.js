import axios from "axios";

export function makeGeocodingRequest(lng, lat, that) {

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        that.setState({
            locationGeocode: response.data,

        });
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