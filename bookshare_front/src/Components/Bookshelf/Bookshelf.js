import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import { Button, Col, Form, Row} from "react-bootstrap";
import './Bookshelf.css'
import RefreshIcon from '../../Resources/refresh.png';
import {useParams} from "react-router-dom";
import {makeBookshelfInfoRequest} from "../../Requests/mop/BookshelfInfoRequest";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";

class BookshelfNoTr extends React.Component {
    constructor(props) {
        super(props);
        const {t} = this.props;
        this.id = this.props.params.id;
        this.state = {
            id: '',
            location:'',
            bookshelfLocation:{},
            creationDateTime: '',
            books:[],
            version: '',
            response: '',
            requestFailed: false,
            locationGeocode:''
        }
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeBookshelfInfoRequest(token, this.id, this);
    }

    reloadUserInfo() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeBookshelfInfoRequest(token, this.id, this);
    }

    renderUserInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <div className={'Refresh'}>
                    <Button variant={'outline-dark'} size={'sm'} onClick={this.reloadUserInfo.bind(this)}>
                        <img src={RefreshIcon} width={25} height={25}/>
                    </Button>
                </div>
                <Row className={'Title'}>
                    <Col>{t('UserInfo.Header')} </Col></Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.location')}:</Col>
                    <Col className={'InfoRightColumn'}>{(this.state.locationGeocode && this.state.locationGeocode.results && this.state.locationGeocode.results.length >=1)?this.state.locationGeocode.results[0].formatted_address:''}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.creationDate')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.creationDateTime}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.bookCount')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.books.length}</Col>
                </Row>
            </div>
        )
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Row>
                    <Col>
                        {this.renderUserInfo()}
                    </Col>
                    <Col>
                        <div className={'d-grid gap-2 mt-0 mb-0 m-5'}>
                            <Map onClick={this.onMapClicked} google={this.props.google} zoom={17} center={this.state.bookshelfLocation}
                                 className='GoogleMap'
                                 style={{width: 'auto', height: '600px', position: 'relative'}}>
                                <Marker
                                    position={this.state.bookshelfLocation}
                                />
                            </Map>
                        </div>

                    </Col>
                </Row>
            </Fragment>
        );
    }
}

const BookshelfTr = withTranslation()(BookshelfNoTr);
const BookshelfWrapped = GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(BookshelfTr);


export default function Bookshelf() {
    const params = useParams();
    return (
        <BookshelfWrapped params={params}/>
    )


}