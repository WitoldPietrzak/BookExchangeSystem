import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Alert, Col, Modal, Row} from "react-bootstrap";
import Cookies from "js-cookie";
import './BookCopyAdd.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {makeBookListRequest} from "../../Requests/moks/BookListRequest";
import {LangCodes} from "../../Utils/LangCodes";
import {CoverTypes} from "../../Utils/CoverTypes";
import {makeAddBookCopyRequest} from "../../Requests/moks/AddBookCopyRequest";
import InputAdornment from "@mui/material/InputAdornment";
import BookAdd from "../BookAdd/BookAdd";
import {makeAuthorListRequest} from "../../Requests/moks/AuthorListRequest";


class BookCopyAddNoTr extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            selectedBook: '',
            selectedLanguage: '',
            selectedCoverType: '',
            id: '',
            errors: {},
            button: 'Form.CreateBookCopyButton',
            response: '',
            errorCode: '',
            requestFailed: false,
            showSuccessModal: false,
            releaseYear: '',
            bookModal:false
        };
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeBookListRequest(token, this);
    }

    showSuccessModal() {
        this.setState({
            showSuccessModal: true
        })
    }

    hideSuccessModal() {
        this.setState({
            showSuccessModal: false
        })
    }
    showBookModal(){
        this.setState({
            bookModal:true
        })
    }
    hideBookModal(){
        this.setState({
            bookModal:false
        })

        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        setTimeout(()=>{
            makeAuthorListRequest(token, this);
        },1000);
    }


    handleSubmit(event) {
        event.preventDefault();
        const errors = this.checkForErrors();
        this.setState(
            {
                errors: errors
            }
        );
        if (Object.keys(errors).length > 0) {
            return;
        }


        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAddBookCopyRequest(token, this.state.selectedBook, this.state.selectedLanguage, this.state.selectedCoverType, this);
    }


    checkForErrors() {

        const errors = {}

        if (this.state.selectedBook === '') {
            errors.book = "Form.EmptyFieldError";
        }
        if (this.state.selectedLanguage === '') {
            errors.language = "Form.EmptyFieldError";
        }
        if (this.state.selectedCoverType === '') {
            errors.coverType = "Form.EmptyFieldError";
        }

        return errors;
    };

    render() {
        const {t} = this.props
        return (
            <Fragment>
                <Alert variant='danger' show={this.state.requestFailed}>
                    {this.state.errorCode}
                    <br/>
                    {t(this.state.response)}
                </Alert>
                <div className="BookCopyAdd">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Autocomplete className={'m-3'}
                                      onChange={((event, newValue) => {
                                          this.setState({
                                              selectedBook: newValue===null?null:newValue.id
                                          })
                                      })}
                                      options={this.state.books}
                                      getOptionLabel={(option) => {
                                          return option.title;
                                      }}
                                      renderInput={(params) => (
                                          <TextField error={this.state.errors.book}
                                                     helperText={this.state.errors.book ? t(`${this.state.errors.book}`) : ''}
                                                     {...params}
                                                     variant="standard"
                                                     label={t('Book.book')}
                                                     InputProps={{
                                                         ...params.InputProps,
                                                         startAdornment:<InputAdornment position={'start'}><Button onClick={this.showBookModal.bind(this)} variant={'outline-dark'} size={'sm'}>+</Button></InputAdornment>
                                                     }}
                                          />
                                      )}
                        />
                        <Autocomplete className={'m-3'}
                                      onChange={((event, newValue) => {
                                          this.setState({
                                              selectedLanguage: newValue===null?newValue:newValue.code
                                          })
                                      })}
                                      options={LangCodes}
                                      getOptionLabel={(option) => {
                                          return option.native;
                                      }}
                                      renderInput={(params) => (
                                          <TextField error={this.state.errors.language}
                                                     helperText={this.state.errors.language ? t(`${this.state.errors.language}`) : ''}
                                                     {...params}
                                                     variant="standard"
                                                     label={t('Book.language')}
                                          />
                                      )}
                        />
                        <Autocomplete className={'m-3'}
                                      onChange={((event, newValue) => {
                                          this.setState({
                                              selectedCoverType: newValue
                                          })
                                      })}
                                      options={CoverTypes}
                                      getOptionLabel={(option) => {
                                          return t(option);
                                      }}
                                      renderInput={(params) => (
                                          <TextField error={this.state.errors.coverType}
                                                     helperText={this.state.errors.coverType ? t(`${this.state.errors.coverType}`) : ''}
                                                     {...params}
                                                     variant="standard"
                                                     label={t('Book.coverType')}
                                          />
                                      )}
                        />
                        <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                            {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                        </Button>
                    </Form>
                </div>

                <Modal show={this.state.showSuccessModal} onHide={this.hideSuccessModal.bind(this)} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Form.Success')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t('Form.BookCopyCreatedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'outline-dark'} href={`/?#/books/copies/${this.state.id}`}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal   show={this.state.bookModal} onHide={this.hideBookModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('Navbar.books.add')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col><BookAdd/></Col>
                        </Row>

                    </Modal.Body>
                </Modal>
            </Fragment>
        )
    }
}


const BookCopyAddTr = withTranslation()(BookCopyAddNoTr)
export default function BookCopyAdd() {
    return (
        <BookCopyAddTr/>
    )
}