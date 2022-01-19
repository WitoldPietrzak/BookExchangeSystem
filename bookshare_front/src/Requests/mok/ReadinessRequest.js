import axios from "axios";
import Cookies from 'js-cookie';
import {jwtCookieExpirationTime} from '../../Views/MainView';
import findDefaultRole from "../../Utils/DefaultRoleFinder";

export function checkReadiness(that) {

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/ready`, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
    }).catch((response) => {
        that.setState({
            refreshError:true,
            message:'Error.Readiness',
            checkForReadiness: false
        });
        clearInterval(that.readinessId);
    })
}
