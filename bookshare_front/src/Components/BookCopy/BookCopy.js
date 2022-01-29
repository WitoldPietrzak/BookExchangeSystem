import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import './BookCopy.css'
import RefreshIcon from '../../Resources/refresh.png';
import {useParams} from "react-router-dom";
import i18n from "i18next";
import {isLogged, isModerator, isUser} from "../../Routes/Router";
import {makeBookCopyRequest, makeGuestBookCopyRequest} from "../../Requests/moks/BookCopyRequest";
import {makeDeleteBookCopyRequest} from "../../Requests/moks/DeleteBookCopyRequest";
import {makeBookshelfListRequest} from "../../Requests/mop/BookshelfListRequest";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Form from "react-bootstrap/Form";
import {makeGeocodingRequestWithVariableName} from "../../Requests/api/GoogleGeocodingRequest";
import axios from "axios";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";
import Icon from "../../Resources/pin.svg";
import Bookshelf from "../Bookshelf/Bookshelf";
import {makeMoveShelfRequest} from "../../Requests/mop/MoveShelfRequest";
import {makeMoveBookCopyRequest} from "../../Requests/moks/MoveCopyRequest";
import HorizontalTimeline from "react-horizontal-timeline";
import BookModify from "../BookModify/BookModify";
import BookCopyModify from "../BookCopyModify/BookCopyModify";


class BookCopyNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.link = encodeURIComponent(window.location.href);
        this.id = this.props.params.id;
        this.state = {
            bookCopy: '',
            shelves: [],
            response: '',
            requestFailed: false,
            showDeleteSuccessModal: false,
            showModifyModal: false,
            showDeleteConfirm: false,
            locationGeocode: null,
            showQR: false,
            showMove: false,
            showMoveConfirm: false,
            selectedBookshelf: null,
            moveSuccess: false,
            curIdx: 0,
            prevIdx: -1
        }
    }

    componentDidMount() {
        this.reloadUserInfo();
    }


    reloadUserInfo() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        isLogged() ? makeBookCopyRequest(token, this.id, this) : makeGuestBookCopyRequest(this.id, this);
        if (isLogged()) {
            makeBookshelfListRequest(token, this);
        }

    }


    removeBookCopy() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeDeleteBookCopyRequest(token, this.state.bookCopy.id, this.state.bookCopy.version, this);
        this.hideDelete();
    }

    hideDeleteSuccessModal() {
        this.setState({
                showDeleteSuccessModal: false
            }
        )
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

    showQR() {
        this.setState({
                showQR: true
            }
        )
    }

    hideQR() {
        this.setState({
                showQR: false
            }
        )
    }

    showMove() {
        this.setState({
                showMove: true
            }
        )
    }

    hideMove() {
        this.setState({
                showMove: false,
            }
        )
    }

    showMoveSuccess() {
        this.setState({
                moveSuccess: true
            }
        )
    }

    hideMoveSuccess() {
        this.setState({
                moveSuccess: false,
            }
        )
        this.reloadUserInfo();
    }

    hideMoveCanceled() {
        this.setState({
                showMove: false,
                selectedBookshelf: null,
            }
        )
    }

    hideMoveConfirmCanceled() {
        this.setState({
                showMoveConfirm: false,
                selectedBookshelf: null,
            }
        )
    }

    showMoveConfirm() {
        this.setState({
                showMoveConfirm: true
            }
        )
    }

    hideMoveConfirm() {
        this.setState({
                showMoveConfirm: false
            }
        )
    }


    showModify() {
        this.setState({
            showModifyModal: true

        });
    }

    hideModify() {
        this.setState({
            showModifyModal: false

        });
    }

    completeModify(){
        this.hideModify();
        this.reloadUserInfo();
    }

    moveCopy() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeMoveBookCopyRequest(token, this.id, this.state.selectedBookshelf, this.state.bookCopy.version, this);
        this.hideMoveConfirm();
    }

    renderBookCopyInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <Row className={'Title'}>
                    <Col>{t('UserInfo.Header')} </Col></Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.title')}:</Col>
                    <Col onClick={() => {
                        window.location.hash = `#/books/${this.state.bookCopy.book.id}`;
                        window.location.reload();
                    }} className={'InfoRightColumnWithLink'}>{this.state.bookCopy.book.title}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.author')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{this.state.bookCopy.book.author.name} {this.state.bookCopy.book.author.surname}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.releaseDate')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.bookCopy.book.releaseDate}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.genres')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.bookCopy.book.genres.map(genre => {
                        return `${genre.name[i18n.language] ? genre.name[i18n.language] : genre.nameCode}`
                    }).toString()}</Col>

                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.coverType')}:</Col>
                    <Col className={'InfoRightColumn'}>{t(this.state.bookCopy.coverType)}</Col>

                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.availability')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{t((this.state.bookCopy.bookshelf.id !== null && (this.state.bookCopy.reservedUsername === null || this.state.bookCopy.reservedUsername === Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME))) ? 'Form.Yes' : 'Form.No')}</Col>

                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.Reservation')}:</Col>
                    <Col className={'InfoRightColumn'}>{t(this.state.bookCopy.reservedUntil)}</Col>

                </Row>

                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.location')}:</Col>
                    <Col
                        className={this.state.bookCopy.bookshelf.id === null ? 'InfoRightColumn' : 'InfoRightColumnWithLink'}>
                        {this.state.bookCopy.bookshelf.id ?
                            ((this.state.locationGeocode && this.state.locationGeocode.results && this.state.locationGeocode.results.length >= 1) ?
                                this.state.locationGeocode.results[0].formatted_address :
                                `${this.state.bookCopy.bookshelf.latitude} ${this.state.bookCopy.bookshelf.longitude}`) : t('Form.LocationUnavailable')}</Col>
                </Row>
            </div>
        )
    }

    renderOptionBar() {
        const {t} = this.props;
        return (
            <div className={"OptionsPanel mb-5 me-5 "}>
                <Button onClick={this.showQR.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                        size={'md'}>{t('BookCopy.GenerateQR')}</Button>
                {isModerator() ?
                    <Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}>{t('BookCopy.Delete')}</Button> : ''}
                {isModerator()?
                    <Button onClick={!this.state.showModifyModal?this.showModify.bind(this):this.hideModify.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                                       size={'md'}>{t('Book.Modify')}</Button>:''}
                {isUser() && this.state.bookCopy.reservedUsername === null && this.state.bookCopy.ownerUsername === null && this.state.bookCopy.bookshelf.id !== null ?
                    <Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}>{t('BookCopy.makeReservation')}</Button> : ''}
                {(this.state.bookCopy.reservedUsername === Cookies.get(process.env.REACT_APP_FRONT_LOGIN_COOKIE_NAME) || (this.state.bookCopy.reservedUsername !== null && isModerator())) ?
                    <Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}>{t('BookCopy.cancelReservation')}</Button> : ''}
                {isUser() && this.state.bookCopy.reservedUsername === null && this.state.bookCopy.ownerUsername === null && this.state.bookCopy.bookshelf.id !== null ?
                    <Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}>{t('BookCopy.Take')}</Button> : ''}
                {isModerator() && this.state.bookCopy.reservedUsername === null && this.state.bookCopy.ownerUsername === null && this.state.bookCopy.bookshelf.id !== null ?
                    <Button onClick={this.showMove.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                            size={'md'}>{t('BookCopy.Move')}</Button> : ''}
                <Button className={'m-1 mt-0 mb-0 me-0'} variant={'outline-dark'} size={'sm'}
                        onClick={this.reloadUserInfo.bind(this)}>
                    <img alt={''} src={RefreshIcon} width={25} height={25}/>
                </Button>
            </div>)
    }

    renderStoryText(story){
        const {t} = this.props;
        if(story===undefined){
            return;
        }
        if(story.action==="CREATED"){
            return `Copy has been added do our base by ${story.user}`
        }
        if(story.action==="MOVED"){
            return `Copy was moved from one shelf to other by ${story.user}`
        }
        if(story.action==="PUT"){
            return `Copy was put to shelf by ${story.user}`
        }
        if(story.action==="TAKEN"){
            return `Copy was taken from shelf by ${story.user}`
        }
    }

    render() {
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
                <Row className={'mb-3'}>
                    <Col>
                        <div style={{
                            width: "80%",
                            height: "100px",
                            margin: "0 auto",
                            marginTop: "20px",
                            fontSize: "15px"
                        }}>
                            {this.state.bookCopy.story !== undefined ?
                                <Fragment>                                    <div className="text-center">
                                    {this.renderStoryText(this.state.bookCopy.story[this.state.curIdx])}
                                </div><HorizontalTimeline
                                    styles={{
                                        foreground: "#1A79AD",
                                        outline: "#dfdfdf"
                                    }}
                                    index={this.state.curIdx}
                                    indexClick={index => {
                                        const curIdx = this.state.curIdx;
                                        this.setState({curIdx: index, prevIdx: curIdx});
                                    }}
                                    values={this.state.bookCopy.story.map(x => x.date)}
                                />
                                </Fragment> : ''}
                        </div>
                    </Col>
                    <Col className={'w-75'}>
                        {this.state.book!==''&&this.state.showModifyModal?<BookCopyModify bookCopy={this.state.bookCopy} onComplete={this.completeModify.bind(this)}/>:''}
                        {this.state.bookCopy.book ? this.renderBookCopyInfo() : ''}
                    </Col>
                </Row>
                <Modal show={this.state.showDeleteConfirm} onHide={this.hideDelete.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.DeleteConfirm')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('Modal.DeleteBookCopyText')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.removeBookCopy.bind(this)}
                                variant="outline-dark">{t('Form.Yes')}</Button>
                        <Button onClick={this.hideDelete.bind(this)} variant="outline-dark">{t('Form.No')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDeleteSuccessModal} onHide={this.hideDeleteSuccessModal.bind(this)}
                       backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Form.Success')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t('Form.BookCopyDeletedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" href={`/?#/books/copies/`}> {t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.response === 'book_copy_not_found'} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Error.Title')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t(this.state.response)}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" href={`/?#/books/copies`}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showQR} onHide={this.hideQR.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('QR.Title')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col></Col>
                            <Col><img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250?qzone=70&data=${this.link}#\/books\/copies\/${this.id}`}
                                alt={''}/></Col>
                            <Col></Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideQR.bind(this)} variant="outline-dark">{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showMove} onHide={this.hideMove.bind(this)} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Copy.MoveCopyTitle')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col></Col>
                            <Autocomplete className={'m-3'}
                                          onChange={((event, newValue) => {
                                              this.setState({
                                                  selectedBookshelf: newValue.id
                                              })
                                          })}
                                          options={this.state.shelves}
                                          getOptionLabel={(option) => {
                                              return option.id
                                          }}
                                          renderInput={(params) => (
                                              <TextField
                                                  {...params}
                                                  variant="standard"
                                                  label={t('Form.Bookshelf')}
                                              />
                                          )}
                            />
                            <Col></Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={this.state.selectedBookshelf === null} onClick={e => {
                            this.hideMove();
                            this.showMoveConfirm();
                        }} variant="outline-dark">{t('Form.OK')}</Button>
                        <Button onClick={this.hideMoveCanceled.bind(this)}
                                variant="outline-dark">{t('Form.Cancel')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showMoveConfirm} onHide={this.hideMoveConfirmCanceled.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Copy.MoveCopyTitle')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col></Col>
                            <h>{t('Copy.MoveConfirmMessage')}</h>
                            <Col></Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.moveCopy.bind(this)} variant="outline-dark">{t('Form.Yes')}</Button>
                        <Button onClick={this.hideMoveConfirmCanceled.bind(this)}
                                variant="outline-dark">{t('Form.Cancel')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.moveSuccess} onHide={this.hideMoveSuccess.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Copy.MoveCopyTitle')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col></Col>
                            <h>{t('Copy.MoveSuccessMessage')}</h>
                            <Col></Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideMoveSuccess.bind(this)} variant="outline-dark">{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

const BookCopyTr = withTranslation()(BookCopyNoTr);


export default function BookCopy() {
    const params = useParams();
    return (
        <BookCopyTr params={params}/>
    )


}