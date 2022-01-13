import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import './Register.css';
import {Alert, Spinner} from "react-bootstrap";
import {makeRegisterRequest} from "../../Requests/mok/RegisterAccountRequest";


class RegisterNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            login: '',
            email:'',
            password: '',
            passwordConfirm: '',
            errors: {},
            button: t('Form.registerButton'),
            response: '',
            errorCode: '',
            requestFailed: false
        };
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
            errors.login = "Login format error";
        }
        // if (!passwordRegex.test(this.state.login)) {
        //     errors.password = "Password format error";
        // }
        if (!emailRegex.test(this.state.email)) {
            errors.email = "Email format error";
        }
        if (this.state.login.length < 3) {
            errors.login = "Login too short";
        }
        if (this.state.login.length < 1) {
            errors.login = "Field cannot be left empty";
        }
        if (this.state.email.length < 3) {
            errors.email = "Email too short";
        }
        if (this.state.email.length < 1) {
            errors.email = "Field cannot be left empty";
        }
        if (this.state.password.length < 8) {
            errors.password = "Password too short";
        }
        if (this.state.password.length < 1) {
            errors.password = "Field cannot be left empty";
        }
        if (this.state.passwordConfirm !== this.state.password) {
            errors.passwordConfirm = "Passwords dont match";
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
                            {this.state.button}
                        </Button>
                    </Form>
                </div>

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