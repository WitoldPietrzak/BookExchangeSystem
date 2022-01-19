import axios from "axios";

export function makeSendChangePasswordMailRequest(loginOrEmail, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/password/reset/${loginOrEmail}`,{
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        that.setState({
            requestCompleted:true,
            button:'Form.SendPasswordResetButton'
        })
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    requestFailed:true,
                    button:'Form.SendPasswordResetButton'
                })
            }
        }
    })
}
