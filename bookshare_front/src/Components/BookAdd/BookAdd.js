import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Alert, Modal} from "react-bootstrap";
import Cookies from "js-cookie";
import './BookAdd.css';
import {makeAuthorListRequest} from "../../Requests/moks/AuthorListRequest";
import {makeGenreListRequest} from "../../Requests/moks/GenreListRequest";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import i18n from "i18next";
import {makeAddBookRequest} from "../../Requests/moks/AddBookRequest";
import InputAdornment from '@mui/material/InputAdornment';
import GenreAdd from "../GenreAdd/GenreAdd";
import {Row,Col} from 'react-bootstrap';
import {isModerator} from "../../Routes/Router";
import AuthorAdd from "../AuthorAdd/AuthorAdd";


class BookAddNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.genreAdd=isModerator()?<InputAdornment position={'start'}><Button onClick={this.showGenreModal.bind(this)} variant={'outline-dark'} size={'sm'}>+</Button></InputAdornment>:null;
        this.state = {
            authors: [],
            genres: [],
            selectedGenres: [],
            selectedAuthor: '',
            id: '',
            title: '',
            errors: {},
            button: 'Form.CreateBookButton',
            response: '',
            errorCode: '',
            requestFailed: false,
            showSuccessModal: false,
            releaseYear: '',
            genreModal:false,
            authorModal:false
        };
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAuthorListRequest(token, this);
        makeGenreListRequest(token, this);
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
    showGenreModal(){
        this.setState({
            genreModal: true
        })
    }
    hideGenreModal(){
        this.setState({
            genreModal: false
        })
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        setTimeout(()=>{
            makeGenreListRequest(token, this);
        },1000)

    }
    showAuthorModal(){
        this.setState({
            authorModal: true
        })
    }
    hideAuthorModal(){
        this.setState({
            authorModal: false
        })
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        setTimeout(()=>{
            makeAuthorListRequest(token, this);
        },1000)
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
        makeAddBookRequest(token, this.state.title, this.state.selectedAuthor.id, this.state.selectedGenres.map(genre=>genre.id), this.state.releaseYear,this);
    }


    checkForErrors() {

        const errors = {}

        if (this.state.title.length < 1) {
            errors.title = "Form.EmptyFieldError";
        }
        if (this.state.selectedAuthor === '') {
            errors.author = "Form.EmptyFieldError";
        }
        if (this.state.selectedGenres.length < 1) {
            errors.genres = "Form.EmptyFieldError";
        }
        if (this.state.releaseYear.length < 1) {
            errors.releaseYear = "Form.EmptyFieldError";
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
                <div className="BookAdd">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <TextField error={this.state.errors.title}
                                   helperText={this.state.errors.title ? t(`${this.state.errors.title}`) : ''}
                                   className={'m-3'}
                                   variant={'standard'}
                                   value={this.state.title}
                                   label={t('Book.title')}
                                   onChange={(event) => {
                                       this.setState({
                                           title: event.target.value
                                       })
                                   }}/>
                        <Autocomplete className={'m-3'}
                                      onChange={((event, newValue) => {
                                          this.setState({
                                              selectedAuthor: newValue
                                          })
                                      })}
                                      options={this.state.authors}
                                      getOptionLabel={(option) => {
                                          return `${option.name} ${option.surname} `
                                      }}
                                      renderInput={(params) => (
                                          <TextField error={this.state.errors.author}
                                                     helperText={this.state.errors.author ? t(`${this.state.errors.author}`) : ''}
                                                     {...params}
                                                     variant="standard"
                                                     label={t('Book.author')}
                                                     InputProps={{
                                                         ...params.InputProps,
                                                     startAdornment:<InputAdornment position={'start'}><Button onClick={this.showAuthorModal.bind(this)} variant={'outline-dark'} size={'sm'}>+</Button></InputAdornment>
                                                     }}
                                          />
                                      )}
                        />
                        <Autocomplete
                            className={'m-3'}
                            multiple
                            filterSelectedOptions
                            onChange={((event, newValue) => {
                                this.setState({
                                    selectedGenres: newValue
                                })
                            })}
                            options={this.state.genres}
                            getOptionLabel={(option) => {
                                return option.name[i18n.language] ? option.name[i18n.language] : option.nameCode
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={this.state.errors.genres}
                                    helperText={this.state.errors.genres ? t(`${this.state.errors.genres}`) : ''}
                                    {...params}
                                    variant="standard"
                                    label={t('Book.genres')}
                                    InputProps={{
                                        ...params.InputProps,
                                     startAdornment:this.genreAdd
                                    }}
                                />
                            )}
                        />
                        <TextField error={this.state.errors.releaseYear}
                                   helperText={this.state.errors.releaseYear ? t(`${this.state.errors.releaseYear}`) : ''}
                                   className={'m-3'}
                                   type={'number'}
                                   variant={'standard'}
                                   value={this.state.releaseYear}
                                   label={t('Book.releaseDate')}
                                   onChange={(event) => {
                                       this.setState({
                                           releaseYear: event.target.value
                                       })
                                   }}/>
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
                        <t>{t('Form.BookCreatedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'outline-dark'} href={`/?#/books/${this.state.id}`}>{t('Form.See')}</Button>
                        <Button variant={'outline-dark'} onClick={this.hideSuccessModal.bind(this)}>{t('Form.Stay')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal   show={this.state.genreModal} onHide={this.hideGenreModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('Navbar.genres.add')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col><GenreAdd/></Col>
                        </Row>

                    </Modal.Body>
                </Modal>
                <Modal   show={this.state.authorModal} onHide={this.hideAuthorModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('Navbar.author.add')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col><AuthorAdd/></Col>
                        </Row>

                    </Modal.Body>
                </Modal>
            </Fragment>
        )
    }
}


const BookAddTr = withTranslation()(BookAddNoTr)
export default function BookAdd() {
    return (
        <BookAddTr/>
    )
}