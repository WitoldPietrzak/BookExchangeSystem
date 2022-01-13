export default function findDefaultRole(roles) {
    if (roles.includes(process.env.REACT_APP_FRONT_ROLE_ADMIN)) {
        return process.env.REACT_APP_FRONT_ROLE_ADMIN;
    } else if (roles.includes(process.env.REACT_APP_FRONT_ROLE_MODERATOR)) {
        return process.env.REACT_APP_FRONT_ROLE_MODERATOR;
    } else if (roles.includes(process.env.REACT_APP_FRONT_ROLE_USER)) {
        return process.env.REACT_APP_FRONT_ROLE_USER;
    }
    return process.env.REACT_APP_FRONT_ROLE_GUEST
}
