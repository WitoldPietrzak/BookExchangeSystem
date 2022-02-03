import Cookies from "js-cookie";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../Components/Login/Login";
import HomePage from "../Components/HomePage/HomePage";
import Register from "../Components/Register/Register";
import Activation from "../Components/Activation/Activation";
import PasswordResetRequest from "../Components/PasswordReset/Request/PasswordResetRequest";
import PasswordResetForm from "../Components/PasswordReset/Form/PasswordResetForm";
import OwnAccountEdit from "../Components/AccountEdit/OwnAccountEdit";
import Enable from "../Components/Enable/Enable";
import AccountList from "../Components/AccountList/AccountList";
import AdminAccountEdit from "../Components/AccountEdit/AdminAccountEdit";
import Logs from "../Components/Logs/Logs";
import BookshelfList from "../Components/BookshelfList/BookshelfList";
import Bookshelf from "../Components/Bookshelf/Bookshelf";
import BookshelfAdd from "../Components/BookshelfAdd/BookshelfAdd";
import GenreAdd from "../Components/GenreAdd/GenreAdd";
import GenreList from "../Components/GenreList/GenreList";
import BookAdd from "../Components/BookAdd/BookAdd";
import BookList from "../Components/BookList/BookList";
import Genre from "../Components/Genre/Genre";
import Book from "../Components/Book/Book";
import BookCopyAdd from "../Components/BookCopyAdd/BookCopyAdd";
import BookCopyList from "../Components/BookCopyList/BookCopyList";
import BookCopy from "../Components/BookCopy/BookCopy";
import AuthorAdd from "../Components/AuthorAdd/AuthorAdd";
import OwnedCopies from "../Components/OwnedCopies/OwnedCopies";
import ShelfMap from "../Components/ShelfMap/ShelfMap";
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
            <Route exact path='/home' element={isAdmin()?<Logs/>:isLogged() ? <HomePage/>:<Navigate replace to={'/login'}/>}/>
            <Route exact path='/' element={<Navigate replace to='/home'/>}/>
            <Route exact path='/login' element={!isLogged() ? <Login/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/logs' element={isAdmin() ? <Logs/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/register' element={!isLogged() ? <Register/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/activate/:token' element={!isLogged() ? <Activation/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/enable/:token' element={!isLogged() ? <Enable/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/reset-password' element={!isLogged() ? <PasswordResetRequest/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/reset-password/:token' element={!isLogged() ? <PasswordResetForm/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/account' element={isLogged() ? <OwnAccountEdit/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/accounts/:id' element={isAdmin() ? <AdminAccountEdit/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/accounts' element={isAdmin() ? <AccountList/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/shelves' element={isModerator() || isUser() ? <BookshelfList/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/shelves/:id' element={isModerator() || isUser() ? <Bookshelf/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/shelves/add' element={isModerator() ? <BookshelfAdd/> : <Navigate replace to='/home'/>}/>
                <Route exact path='/shelves/map' element={isModerator()|| isUser() ? <ShelfMap/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/genres/add' element={isModerator() ? <GenreAdd/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/genres/' element={isModerator() ? <GenreList/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/genres/:id' element={isModerator() ? <Genre/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books/:id' element={isModerator() || isUser() ? <Book/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books/add' element={isModerator() || isUser() ? <BookAdd/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books' element={isModerator() || isUser() ? <BookList/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books/copies/add' element={isModerator() || isUser() ? <BookCopyAdd/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books/copies/my' element={isUser() ? <OwnedCopies /> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books/copies/' element={isModerator() || isUser() ? <BookCopyList/> : <Navigate replace to='/home'/>}/>
            <Route exact path='/books/copies/:id' element= <BookCopy/> />
            <Route exact path='/authors/add' element={isModerator() || isUser() ? <AuthorAdd/> : <Navigate replace to='/home'/>}/>
            <Route path='*' element={<Navigate replace to={'/home'}/>}/>
        </Routes>
    )
}