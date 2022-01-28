import axios from "axios";

export function makeAddBookCopyRequest(token, book, language, coverType, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/copy/add`, {
        bookId: book,
        language: language,
        coverType: coverType
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            showSuccessModal: true,
            id: response.data.id
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
