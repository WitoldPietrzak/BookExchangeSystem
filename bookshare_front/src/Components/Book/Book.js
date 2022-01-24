import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import './Book.css'
import RefreshIcon from '../../Resources/refresh.png';
import {useParams} from "react-router-dom";
import {makeBookRequest} from "../../Requests/moks/BookRequest";
import i18n from "i18next";
import {isModerator} from "../../Routes/Router";
import {makeDeleteBookRequest} from "../../Requests/moks/DeleteBookRequest";

class BookNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.tempLocation = {lng: 0, lat: 0}
        this.id = this.props.params.id;
        this.state = {
            book: {},
            response: '',
            requestFailed: false,
            showDeleteSuccessModal: false,
            showModifyModal: false,
            showDeleteConfirm: false
        }
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeBookRequest(token, this.id, this);
    }

    reloadUserInfo() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeBookRequest(token, this.id, this);
    }


    removeBook() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeDeleteBookRequest(token, this.state.book.id, this.state.book.version,this);
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

    renderBookCopiesInfo() {
        const {t} = this.props;
        return (
            <div className="m-5 mb-3 BookshelfBookList">
                <Row className={'Title'}>
                    <Col>{t('Bookshelf.BookList')} </Col></Row>
                <Row className={'InfoHeader'}>
                    <Col>{t('Book.coverType')}</Col>
                    <Col>{t('Book.language')}</Col>
                    <Col>{t('Book.availability')}</Col>
                </Row>
                {this.state.book.copies.map(book => this.renderBookCopyInfo(book))}
            </div>
        )
    }

    renderBookCopyInfo(row) {
        const {t} = this.props;
        return (
            <Row className={'BookshelfBookListRow'} onClick={() => {
                window.location.hash = `#/bookCopy/${row.id}`;
                window.location.reload();
            }}>
                <Col>{t(row.coverType)}</Col>
                <Col>{row.language}</Col>
                <Col>{row.available?t('Form.Yes'):t('Form.No')}</Col>
            </Row>
        )

    }


    renderBookInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <Row className={'Title'}>
                    <Col>{t('UserInfo.Header')} </Col></Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.title')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{this.state.book.title}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.author')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{this.state.book.author.name} {this.state.book.author.surname}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.releaseDate')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.book.releaseDate}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.genres')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.book.genres.map(genre => {
                        return `${genre.name[i18n.language] ? genre.name[i18n.language] : genre.nameCode}`
                    }).toString()}</Col>

                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Book.copyCount')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.book.copies.length}</Col>
                </Row>
            </div>
        )
    }

    renderOptionBar() {
        const {t} = this.props;
        return (
            <div className={"OptionsPanel mb-5 me-5 "}>
                {isModerator()?<Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                         size={'md'}>{t('Book.Delete')}</Button>:''}
                {isModerator()?<Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                         size={'md'}>{t('Book.Modify')}</Button>:''}
                <Button className={'m-1 mt-0 mb-0 me-0'} variant={'outline-dark'} size={'sm'}
                        onClick={this.reloadUserInfo.bind(this)}>
                    <img alt={''} src={RefreshIcon} width={25} height={25}/>
                </Button>
            </div>)
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
                    <Col className={'w-75'}>
                        {this.state.book.author ? this.renderBookInfo() : ''}
                    </Col>
                </Row>
                <Row className={'mb-3'}>
                    <Col>
                        {this.state.book.author && this.state.book.copies.length ? this.renderBookCopiesInfo():''}
                    </Col>
                </Row>
                <Modal show={this.state.showDeleteConfirm} onHide={this.hideDelete.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.DeleteConfirm')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('Modal.DeleteBookText')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.removeBook.bind(this)}
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
                        <t>{t('Form.BookDeletedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" href={`/?#/books/`}> {t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.response === 'Book_not_exist'} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Error.Title')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t(this.state.response)}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" href={`/?#/books/`}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

const BookTr = withTranslation()(BookNoTr);


export default function Book() {
    const params = useParams();
    return (
        <BookTr params={params}/>
    )


}