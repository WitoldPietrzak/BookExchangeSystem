import axios from "axios";
import {makeGeocodingRequest} from "../api/GoogleGeocodingRequest";

export function makeBookshelfInfoRequest(token, id, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/shelf/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            id: response.data.id,
            bookshelfLocation: {lat: response.data.latitude, lng: response.data.longitude},
            distance: null,
            version: response.data.version,
            books: response.data.books

        });
        makeGeocodingRequest(response.data.longitude, response.data.latitude, that);
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

export function makeBookshelfInfoWithDistanceRequest(token, id, long, lat, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shelf/${id}`, {
        latitude: lat,
        longitude: long
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            id: response.data.id,
            bookshelfLocation: {lat: response.data.latitude, lng: response.data.longitude},
            distance: response.data.distance,
            version: response.data.version,
            books: response.data.books

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