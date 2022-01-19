import axios from "axios";

export function addAccessLevel(token, userId, role, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/role/add`, {
        userId: userId,
        roleName: role,
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {

        const roles = that.state.roles;
        roles.push(role);
        that.setState({
            roles:roles
        })

    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                roleResponse: response.response.data.message,
                roleRequestFailed: true,
            })
        }
    })
}

export function revokeAccessLevel(token, userId, role, that) {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/role/revoke`, {
        userId: userId,
        roleName: role,
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {

        const roles = that.state.roles;
        roles.splice(roles.indexOf(role),1);
        that.setState({
            roles:roles,
            roleResponse: response.data.message,
            roleRequestFailed: false,
        })
    }).catch((response) => {
        if (response.response) {
            that.setState({
                errorCode: response.response.status.toString(10),
                roleResponse: response.response.data.message,
                roleRequestFailed: true,
            })
        }
    })
}