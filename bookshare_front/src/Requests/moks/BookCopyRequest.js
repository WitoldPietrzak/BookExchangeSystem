import axios from "axios";
import {makeGeocodingRequest} from "../api/GoogleGeocodingRequest";

export function makeBookCopyRequest(token, id, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/copy/get/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            bookCopy: response.data

        });
        if(response.data.bookshelf.id !== null){
            makeGeocodingRequest(response.data.bookshelf.longitude,response.data.bookshelf.latitude,that);
        }
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError: true,
                requestFailed: true,
                response: response.response.data.message
            })
        }
    })
}

export function makeGuestBookCopyRequest(id, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/copy/get/${id}`, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        that.setState({
            bookCopy: response.data

        });
        if(response.data.bookshelf.id !== null){
            makeGeocodingRequest(response.data.bookshelf.longitude,response.data.bookshelf.latitude,that);
        }
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                requestError: true,
                requestFailed: true,
                response: response.response.data.message
            })
        }
    })
}