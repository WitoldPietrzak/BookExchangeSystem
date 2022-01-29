import axios from "axios";

export function makeModifyBookCopyRequest(token, id, book, language, coverType, version, that, onComplete) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/copy/modify`, {
        id:id,
        bookId: book,
        language: language,
        coverType: coverType,
        version:version
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        onComplete();
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
