import {useTranslation} from "react-i18next";
import {Fragment} from "react";
import {isLogged} from "../../Routes/Router";
import LoggedInHomePage from "./LoggedInHomePage/LoggedInHomePage";
import GuestHomePage from "./GuestHomePage/GuestHomePage";

export default function HomePage() {
    const {t} = useTranslation();
    return (
        <Fragment>
            {renderHomePage()}
        </Fragment>
    )
}

function renderHomePage() {
    return isLogged() ? <LoggedInHomePage/> : <GuestHomePage/>
}