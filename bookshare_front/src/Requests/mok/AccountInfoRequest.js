import axios from "axios";

export function makeOwnAccountInfoRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/info`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            id: response.data.id,
            login: response.data.login,
            email: response.data.email,
            language: response.data.language,
            activated: response.data.activated,
            disabled: response.data.disabled,
            roles:response.data.roles,
            lastSuccessfulLoginAttemptDateTime: response.data.lastSuccessfulLoginAttemptDateTime,
            creationDateTime: response.data.creationDateTime

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

export function makeAnyAccountInfoRequest(token, id, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/info/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            id: response.data.id,
            login: response.data.login,
            email: response.data.email,
            language: response.data.language,
            activated: response.data.activated,
            disabled: response.data.disabled,
            roles:response.data.roles,
            lastSuccessfulLoginAttemptDateTime: response.data.lastSuccessfulLoginAttemptDateTime,
            creationDateTime: response.data.creationDateTime,
            modificationDateTime:response.data.modificationDateTime,
            lastSuccessfulLoginIp:response.data.lastSuccessfulLoginIp,
            lastUnsuccessfulLoginAttemptDateTime:response.data.lastUnsuccessfulLoginAttemptDateTime,
            lastUnsuccessfulLoginIp:response.data.lastUnsuccessfulLoginIp

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
