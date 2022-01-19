import axios from "axios";

export function makeActivateUserRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/activate/${token}`, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        that.setState({
            response:response.data.message,
            requestCompleted:true
        })
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    errorCode:response.response.status.toString(10),
                    response:response.response.data.message,
                    requestFailed:true
                })
            }
        }
    })
}
