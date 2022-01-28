import {useTranslation} from "react-i18next";
import {Fragment} from "react";
import {isLogged, isUser} from "../../Routes/Router";
import LoggedInHomePage from "./LoggedInHomePage/LoggedInHomePage";
import GuestHomePage from "./GuestHomePage/GuestHomePage";
import UserHomePage from "./User/UserHomePage";
import './Homepage.css';

export default function HomePage() {
    const {t} = useTranslation();
    return (
        <Fragment>
            <div className={'Homepage'}>
            {renderHomePage()}
            </div>
        </Fragment>
    )
}

function renderHomePage() {
    if(isLogged()){
        return <UserHomePage/>;
    }
}