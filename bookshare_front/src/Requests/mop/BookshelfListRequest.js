import axios from "axios";

export function makeBookshelfListRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/shelf/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            shelves: response.data.bookshelves

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}

export function makeFilteredBookshelfListRequest(token, longitude, latitude,distance,bookCount, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shelf/all`, {
        longitude:longitude,
        latitude:latitude,
        distance:distance,
        bookCount:bookCount
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            shelves: response.data.bookshelves

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}