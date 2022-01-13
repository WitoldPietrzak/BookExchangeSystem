import React from "react";
import {withTranslation} from "react-i18next";


class GuestHomePageNoTr extends React.Component {
    constructor(props) {
        super(props);
    }

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

export default function () {
    return (
        <GuestHomePageTr/>
    )
}