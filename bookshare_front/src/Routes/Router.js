import Cookies from "js-cookie";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "../Components/Login/Login";
import HomePage from "../Components/HomePage/HomePage";
import Register from "../Components/Register/Register";
import Activation from "../Components/Activation/Activation";
import PasswordReset from "../Components/PasswordReset/PasswordReset";

let token = Cookies !== undefined ? Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME) : undefined;
const role = token ? Cookies.get(`${process.env.REACT_APP_ACTIVE_ROLE_COOKIE_NAME}_${Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME)}`) : undefined;

export function isLogged() {
    return token !== undefined && role !== undefined && role !== process.env.REACT_APP_FRONT_ROLE_GUEST;
}

export function isUser() {
    return isLogged() && role === process.env.REACT_APP_FRONT_ROLE_USER;
}

export function isModerator() {
    return isLogged() && role === process.env.REACT_APP_FRONT_ROLE_MODERATOR;
}

export function isAdmin() {
    return isLogged() && role === process.env.REACT_APP_FRONT_ROLE_ADMIN;
}

export default function Router() {

    return (
        <Routes>
            <Route exact path='/home' element={<HomePage/>}/>
            <Route exact path='/' element={<Navigate replace to='/home'/>}/>
            <Route exact path='/login' element={!isLogged() ? <Login/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/register' element={!isLogged() ? <Register/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/activate/:token' element={!isLogged() ? <Activation/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/reset-password' element={!isLogged() ? <PasswordReset/> : <Navigate replace to='/home'/>}/>
            <Route path='*' element={<Navigate replace to={'/home'}/>}/>
        </Routes>
    )
}