import axios from "axios";

export function makeLogsRequest(token, that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/logs/all`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            logs: response.data.logs

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}

export function makeFilteredLogsRequest(token, level,after,before, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/logs/all/`, {
        level: level,
        after: after,
        before: before
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        that.setState({
            logs: response.data.logs

        });
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
            })
        }
    })
}