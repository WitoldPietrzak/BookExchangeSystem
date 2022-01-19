import axios from "axios";

export function makeChangePasswordRequest(token, oldPassword, newPassword, newPasswordMatch, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/password`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
        newPasswordMatch: newPasswordMatch
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            passwordRequestCompleted: true,
            passwordRequestFailed: false,
            passwordResponse: response.data.message

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                passwordResponse: response.response.data.message,
                passwordRequestFailed: true,
                passwordRequestCompleted: false,
            })
        }
    })
}