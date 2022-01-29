import axios from "axios";

export function makeModifyGenreRequest(token, id, names, version, that,onComplete) {
    const namesToSend = {};
    names.forEach((name) => {
        namesToSend[`${name.key}`] = name.value
    })

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/genre/modify`, {
        id: id,
        names: namesToSend,
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
            that.setState({
                errorCode: response.response.status.toString(10),
                response: response.response.data.message,
                requestFailed: true
            })
        }
    })
}
