import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Register.css';
import {Alert, Modal, Spinner} from "react-bootstrap";
import {makeRegisterRequest} from "../../Requests/mok/RegisterAccountRequest";


class RegisterNoTr extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            email:'',
            password: '',
            passwordConfirm: '',
            errors: {},
            button: 'Form.registerButton',
            response: '',
            errorCode: '',
            requestFailed: false,
            showSuccessModal:false
        };
    }

    hideSuccessModal(){
        this.setState({
            showSuccessModal:true
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
        this.setState({
            button: <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        })
        makeRegisterRequest(this.state.login, this.state.password, this.state.email, this);
    }

    checkForErrors() {

        const loginRegex = new RegExp(/^[a-z0-9]+$/i);
        const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        const errors = {}

        if (!loginRegex.test(this.state.login)) {
            errors.login = "Form.FormatError";
        }
        if (!passwordRegex.test(this.state.password)) {
            errors.password = "Password format error";
        }
        if (!emailRegex.test(this.state.email)) {
            errors.email = "Form.EmailFormatError";
        }
        if (this.state.login.length < 3) {
            errors.login = "Form.LoginTooShortError";
        }
        if (this.state.login.length < 1) {
            errors.login = "Form.EmptyFieldError";
        }
        if (this.state.email.length < 3) {
            errors.email = "Form.EmailTooShortError";
        }
        if (this.state.email.length < 1) {
            errors.email = "Form.EmptyFieldError";
        }
        if (this.state.password.length < 8) {
            errors.password = "Form.PasswordTooShortError";
        }
        if (this.state.password.length < 1) {
            errors.password = "Form.EmptyFieldError";
        }
        if (this.state.passwordConfirm !== this.state.password) {
            errors.passwordConfirm = "Form.PasswordsNotMatchError";
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
                <div className="Register">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label className="required">{t('Form.email')}*</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.email}
                                onChange={(e) => {
                                    this.setState({
                                        email: e.target.value
                                    });
                                }}
                                isInvalid={!!this.state.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.email)}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group size="lg" controlId="login">
                            <Form.Label className="required">{t('Form.login')}*</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.login}
                                onChange={(e) => {
                                    this.setState({
                                        login: e.target.value
                                    });
                                }}
                                isInvalid={!!this.state.errors.login}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.login)}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label className="required">{t('Form.password')}*</Form.Label>
                            <Form.Control
                                autoFocus
                                type="password"
                                value={this.state.password}
                                onChange={(e) => {
                                    this.setState({
                                        password: e.target.value
                                    });
                                }}
                                isInvalid={!!this.state.errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.password)}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group size="lg" controlId="passwordConfirm">
                            <Form.Label className="required">{t('Form.passwordConfirm')}*</Form.Label>
                            <Form.Control
                                autoFocus
                                type="password"
                                value={this.state.passwordConfirm}
                                onChange={(e) => {
                                    this.setState({
                                        passwordConfirm: e.target.value
                                    });
                                }}
                                isInvalid={!!this.state.errors.passwordConfirm}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.passwordConfirm)}
                            </Form.Control.Feedback>
                        </Form.Group>
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
                        <t>{t('Form.AccountCreatedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'outline-dark'} href={`/?#/login`}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}


const RegisterTr = withTranslation()(RegisterNoTr)
export default function Register() {
    return (
        <RegisterTr/>
    )
}