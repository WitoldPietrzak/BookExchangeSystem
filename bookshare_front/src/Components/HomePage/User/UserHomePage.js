import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Tab, Tabs} from "react-bootstrap";
import './UserHomePage.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import QuickSearchBook from "../../QuickSearchBook/QuickSearchBook";
import QuickSearchBookshelf from "../../QuickSearchBookshelf/QuickSearchBookshelf";
import NearbyMap from "../../NearbyMap/NearbyMap";

class UserHomePageNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <div className="Tabs">
                    <Tabs>
                        <Tab title={t('Home.BookMapTab')} eventKey={'jeden'}>
                            <div className='Map m-auto mt-5 mb-5'>
                                <QuickSearchBook/>
                            </div>
                        </Tab>
                        <Tab title={t('Home.BookshelfMapTab')} eventKey={'dwa'}>
                            <div className='Map m-auto mt-5 mb-5'>
                                <QuickSearchBookshelf/>
                            </div>
                        </Tab>
                        <Tab title={t('Home.NearbyTab')} eventKey={'trzy'}>
                            <div className='Map m-auto mt-5 mb-5'>
                                {/*<iframe*/}
                                {/*    width="800"*/}
                                {/*    height="450"*/}
                                {/*    loading="lazy"*/}
                                {/*    allowFullScreen*/}
                                {/*    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA7TpSBdp1X6FwTJGovDXhJHNflaq6_9og&q=Space+Needle,Seattle+WA">*/}
                                {/*</iframe>*/}
                                <NearbyMap/>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </Fragment>
        )
    }
}

const UserHomePageTr = withTranslation()(UserHomePageNoTr);

export default function UserHomePage() {
    return (
        <UserHomePageTr/>
    )
}