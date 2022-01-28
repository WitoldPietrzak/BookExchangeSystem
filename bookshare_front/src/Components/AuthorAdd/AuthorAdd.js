import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Alert, Modal} from "react-bootstrap";
import Cookies from "js-cookie";
import './AuthorAdd.css';
import TextField from '@mui/material/TextField';
import {makeAddAuthorRequest} from "../../Requests/moks/AddAuthorRequest";


class AuthorAddNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            errors: {},
            button: 'Form.CreateAuthorButton',
            response: '',
            errorCode: '',
            requestFailed: false,
            showSuccessModal: false,
            name:'',
            surname:''
        };
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
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
        makeAddAuthorRequest(token, this.state.name,this.state.surname,this);
    }


    checkForErrors() {

        const errors = {}

        if (this.state.name.length < 1) {
            errors.name = "Form.EmptyFieldError";
        }
        if (this.state.surname.length < 1) {
            errors.surname = "Form.EmptyFieldError";
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
                <div className="AuthorAdd">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <TextField error={this.state.errors.name}
                                   helperText={this.state.errors.name ? t(`${this.state.errors.name}`) : ''}
                                   className={'m-3'}
                                   variant={'standard'}
                                   value={this.state.name}
                                   label={t('Author.name')}
                                   onChange={(event) => {
                                       this.setState({
                                           name: event.target.value
                                       })
                                   }}/>
                        <TextField error={this.state.errors.surname}
                                   helperText={this.state.errors.surname ? t(`${this.state.errors.surname}`) : ''}
                                   className={'m-3'}
                                   type={'text'}
                                   variant={'standard'}
                                   value={this.state.surname}
                                   label={t('Author.surname')}
                                   onChange={(event) => {
                                       this.setState({
                                           surname: event.target.value
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
                        <t>{t('Form.AuthorCreatedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'outline-dark'} onClick={this.hideSuccessModal.bind(this)}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}


const AuthorAddTr = withTranslation()(AuthorAddNoTr)
export default function AuthorAdd() {
    return (
        <AuthorAddTr/>
    )
}