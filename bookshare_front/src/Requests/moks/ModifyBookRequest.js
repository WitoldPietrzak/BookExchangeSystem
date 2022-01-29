import axios from "axios";
import Cookies from 'js-cookie';

export function makeModifyBookRequest(token,id, title, author,genres,releaseDate,version, that,onComplete) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/book/modify`, {
        id:id,
        title:title,
        author:author,
        genres:genres,
        releaseDate:releaseDate,
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
