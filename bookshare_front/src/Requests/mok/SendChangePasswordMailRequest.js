import axios from "axios";

export function makeSendChangePasswoerMailRequest(loginOrEmail, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/password/reset/${loginOrEmail}`,{
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        that.setState({
            response:that.props.t(response.data.message),
            requestCompleted:true
        })
    }).catch((response) => {
        if (response.response) {
            if (response.response) {
                that.setState({
                    errorCode:response.response.status.toString(10),
                    response:that.props.t(response.response.data.message),
                    requestFailed:true
                })
            }
        }
    })
}
