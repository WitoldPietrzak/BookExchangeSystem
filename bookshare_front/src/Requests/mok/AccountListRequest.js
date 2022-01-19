import axios from "axios";

export function makeAccountListRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            accounts: response.data.users

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}

export function makeFilteredAccountListRequest(token, login, email, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/all/`, {
        login: login,
        email: email
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            accounts: response.data.users

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}