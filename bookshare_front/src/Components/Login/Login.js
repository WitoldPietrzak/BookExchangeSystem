import React, {Fragment} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import './Login.css';
import {makeLoginRequest} from "../../Requests/mok/LoginRequest";
import {Alert, Spinner} from "react-bootstrap";


class LoginNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            login: '',
            password: '',
            email: '',
            errors: {},
            button: t('Form.loginButton'),
            response: '',
            errorCode: '',
            requestFailed: false
        };
    }

    checkForErrors() {

        const loginRegex = new RegExp(/^[a-z0-9]+$/i);
        const errors = {}

        if (!loginRegex.test(this.state.login)) {
            errors.login = "Login format error";
        }

        if (this.state.login.length < 1) {
            errors.login = "Field cannot be left empty";
        }

        if (this.state.password.length < 1) {
            errors.password = "Field cannot be left empty";

        }
        return errors;
    };

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
        makeLoginRequest(this.state.login, this.state.password, this);
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
                <div className="Login">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Group size="lg" controlId="login">
                            <Form.Label className="required">{t('Form.login')}</Form.Label>
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
                            <Form.Label className="required">{t('Form.password')}</Form.Label>
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
                        <Link size="md" to="/reset-password">
                            {t("Form.forgotPasswordButton")}
                        </Link>
                        <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                            {this.state.button}
                        </Button>

                    </Form>
                </div>

            </Fragment>
        )
    }
}


const LoginTr = withTranslation()(LoginNoTr)
export default function Login() {
    return (
        <LoginTr/>
    )
}