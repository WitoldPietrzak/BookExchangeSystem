import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import './Bookshelf.css'
import RefreshIcon from '../../Resources/refresh.png';
import {useParams} from "react-router-dom";
import {makeBookshelfInfoRequest} from "../../Requests/mop/BookshelfInfoRequest";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import {isModerator} from "../../Routes/Router";
import {makeMoveShelfRequest} from "../../Requests/mop/MoveShelfRequest";
import MapPicker from "react-google-map-picker";
import {makeRemoveShelfRequest} from "../../Requests/mop/RemoveShelfRequest";

class BookshelfNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.tempLocation={lng:0,lat:0}
        this.id = this.props.params.id;
        this.state = {
            id: '',
            location: '',
            bookshelfLocation: {},
            creationDateTime: '',
            books: [],
            version: '',
            response: '',
            requestFailed: false,
            locationGeocode: '',
            showModal: false,
            showDeleteConfirm: false
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

    moveBookshelf(lat, lng) {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        this.hideModal();
        makeMoveShelfRequest(token, this.state.id, lng, lat, this.state.version, this);
        this.reloadUserInfo();
    }

    removeBookshelf() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeRemoveShelfRequest(token, this.state.id, this.state.version, this);
        this.hideDelete();
    }


    showModal() {
        this.setState({
            showModal: true

        });
    }

    hideModal() {
        this.setState({
            showModal: false

        });
    }


    showDelete() {
        this.setState({
            showDeleteConfirm: true

        });
    }

    hideDelete() {
        this.setState({
            showDeleteConfirm: false

        });
    }

    renderBookshelfInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <Row className={'Title'}>
                    <Col>{t('UserInfo.Header')} </Col></Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.location')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{(this.state.locationGeocode && this.state.locationGeocode.results && this.state.locationGeocode.results.length >= 1) ? this.state.locationGeocode.results[0].formatted_address : ''}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.bookCount')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.books.length}</Col>
                </Row>
            </div>
        )
    }

    renderBooksInfo() {
        const {t} = this.props;
        return (
            <div className="m-5 mb-3 BookshelfBookList">
                <Row className={'Title'}>
                    <Col>{t('Bookshelf.BookList')} </Col></Row>
                <Row className={'InfoHeader'}>
                    <Col xs={7}>{t('Book.title')}</Col>
                    <Col>{t('Book.author')}</Col>
                    <Col>{t('Book.coverType')}</Col>
                    <Col>{t('Book.language')}</Col>
                </Row>
                {this.state.books.map(book => this.renderBookInfo(book))}
            </div>
        )
    }

    renderBookInfo(row) {
        const {t} = this.props;
        return (
            <Row className={'BookshelfBookListRow'} onClick={() => {
                window.location.hash = `#/bookCopy/${row.id}`;
                window.location.reload();
            }}>
                <Col xs={7}>{row.title}</Col>
                <Col>{row.author.name} {row.author.surname}</Col>
                <Col>{t(row.coverType)}</Col>
                <Col>{row.language}</Col>
            </Row>
        )

    }

    renderOptionBar() {
        const {t} = this.props;
        return (
            <div className={"OptionsPanel mb-5 me-5 "}>
                {isModerator() ?
                    <Button onClick={this.showModal.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}
                    >{t('Bookshelf.Move')}</Button> : ''}
                {isModerator() ?
                    <Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}
                    >{t('Bookshelf.Remove')}</Button> : ''}
                <Button className={'m-1 mt-0 mb-0'} variant={'outline-dark'} size={'md'}
                >{t('Bookshelf.AddBookCopy')}</Button>
                <Button className={'m-1 mt-0 mb-0 me-0'} variant={'outline-dark'} size={'sm'}
                        onClick={this.reloadUserInfo.bind(this)}>
                    <img alt={''} src={RefreshIcon} width={25} height={25}/>
                </Button>
            </div>)
    }

    render() {
        console.log(this.state.bookshelfLocation)
        console.log(this.state.bookshelfLocation.lng)
        console.log(this.state.bookshelfLocation.lat)
        const {t} = this.props;
        return (
            <Fragment>
                <Row>
                    <Col>
                        <Alert show={this.state.requestFailed}
                               className={'m-3'}
                               variant={'danger'}>{t(this.state.response)}</Alert>
                        <div className={'d-grid gap-2 mt-4 mb-0 m-5'}>
                        </div>
                    </Col>

                </Row>
                {this.renderOptionBar()}
                <Row>
                    <Col>
                        {this.renderBookshelfInfo()}
                    </Col>
                    <Col>
                        <div className={'d-grid gap-2 mt-0 mb-0 m-5 Map InfoFrame'}>
                            <Map google={this.props.google} zoom={17}
                                 center={typeof this.state.bookshelfLocation.lat ==='number' && typeof this.state.bookshelfLocation.lng ==='number'? this.state.bookshelfLocation:this.tempLocation}
                                 className='GoogleMap'
                                 style={{width: 'auto', height: '200px', position: 'relative'}}>
                                <Marker
                                    position={typeof this.state.bookshelfLocation.lat ==='number' && typeof this.state.bookshelfLocation.lng ==='number'? this.state.bookshelfLocation:this.tempLocation}
                                />
                            </Map>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.renderBooksInfo()}
                    </Col>
                </Row>
                <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.PickLocation')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MapPicker apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                   defaultLocation={this.state.bookshelfLocation}
                                   zoom={10}
                                   onChangeLocation={this.moveBookshelf.bind(this)}
                        />
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showDeleteConfirm} onHide={this.hideDelete.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.DeleteConfirm')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('Modal.DeleteBookshelfText')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.removeBookshelf.bind(this)}
                                variant="outline-dark">{t('Form.Yes')}</Button>
                        <Button onClick={this.hideDelete.bind(this)} variant="outline-dark">{t('Form.No')}</Button>
                    </Modal.Footer>
                </Modal>
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