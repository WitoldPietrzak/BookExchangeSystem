import {useTranslation} from "react-i18next";
import {Fragment} from "react";
import {isLogged, isUser} from "../../Routes/Router";
import LoggedInHomePage from "./LoggedInHomePage/LoggedInHomePage";
import GuestHomePage from "./GuestHomePage/GuestHomePage";
import UserHomePage from "./User/UserHomePage";

export default function HomePage() {
    const {t} = useTranslation();
    return (
        <Fragment>
            {renderHomePage()}
        </Fragment>
    )
}

function renderHomePage() {
    if(isUser()){
        return <UserHomePage/>;
    }
    return isLogged() ? <LoggedInHomePage/> : <GuestHomePage/>
}