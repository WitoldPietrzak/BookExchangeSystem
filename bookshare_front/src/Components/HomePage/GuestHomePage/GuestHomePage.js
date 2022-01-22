import React from "react";
import {withTranslation} from "react-i18next";


class GuestHomePageNoTr extends React.Component {

    render() {
        const {t} = this.props;
        return(
            <div>
                Hello World
            </div>
        )
    }

}

const GuestHomePageTr = withTranslation()(GuestHomePageNoTr);

export default function GuestHomePage() {
    return (
        <GuestHomePageTr/>
    )
}