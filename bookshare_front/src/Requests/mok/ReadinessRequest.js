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
        if(that.state.connection === false){
            that.setState({
                refreshError:true,
                message:'Info.ConnectionBack',
                connection:true
            });

        }
    }).catch((response) => {
        if(that.state.connection === true){
            that.setState({
                refreshError:true,
                message:'Error.Readiness',
                connection:false
            });
        }
    })
}
