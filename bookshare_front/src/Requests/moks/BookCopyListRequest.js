import axios from "axios";

export function makeBookCopyListRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/copy/get/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            copies: response.data.copies

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}

export function makeFilteredBookCopyListRequest(token, book, title, author, genres, releasedBefore, releasedAfter, language, coverType, availability, lat, lng, distance, that) {
    if (releasedBefore === "") {
        releasedBefore = null;
    }
    if (releasedAfter === "") {
        releasedAfter = null;
    }
    if (title === "") {
        title = null;
    }
    if (genres === [] || genres.length === 0) {
        genres = null;
    }
    if (author === "") {
        author = null;
    }
    if (book === "") {
        book = null;
    }
    if (language === "") {
        language = null;
    }
    if (coverType === "") {
        coverType = null;
    }
    if (availability === "") {
        availability = null;
    }
    if (lat === "") {
        lat = null;
    }
    if (lng === "") {
        lng = null;
    }
    if (distance === "") {
        distance = null;
    }
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/copy/get/all`, {
        book: book,
        title: title,
        author: author,
        genres: genres,
        releasedBefore: releasedAfter,
        releasedAfter: releasedAfter,
        language: language,
        coverType: coverType,
        availability: availability,
        lat: lat,
        lng: lng,
        distance: distance
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            copies: response.data.copies

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}