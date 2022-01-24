import axios from "axios";

export function makeBookListRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/book/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            books: response.data.books

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}

export function makeFilteredBookListRequest(token, title, author, genres, releasedBefore, releasedAfter, copyCount, that) {
    if (releasedBefore === "") {
        releasedBefore = null;
    }
    if (releasedAfter === "") {
        releasedAfter = null;
    }
    if(copyCount === ""){
        copyCount = null;
    }
    if(title === ""){
        title = null;
    }
    if(genres ===[] || genres.length === 0) {
        genres = null;
    }
    if(author ===""){
        author = null;
    }
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/book/all`, {
        title: title,
        author: author,
        genres: genres,
        releasedBefore: releasedAfter,
        releasedAfter: releasedAfter,
        copyCount: copyCount
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            books: response.data.books

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}