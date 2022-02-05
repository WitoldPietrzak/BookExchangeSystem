import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {Form, Button, Alert, Spinner} from 'react-bootstrap';
import './PasswordResetForm.css';
import {
    makeChangePasswordRequest,
    makeVerifyPasswordTokenRequest
} from "../../../Requests/mok/ChangePasswordTokenRequest";

class PasswordResetFormNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.token = this.props.params.token;
        this.state = ({
            password: '',
            passwordConfirm: '',
            button: 'Form.ChangePasswordButton',
            errors: {},
            initialRequestFailed: false,
            requestFailed: false,
            requestCompleted: false
        });

        makeVerifyPasswordTokenRequest(this.token, this);
    }

    handleSubmit() {
        const errors = {};
        const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

        if (!passwordRegex.test(this.state.password)) {
            errors.password = "Form.PasswordFormatError";
        }


        if (this.state.password.length < 8) {
            errors.password = 'Form.PasswordTooShortError';
        }
        if (this.state.password.length < 1) {
            errors.password = 'Form.EmptyFieldError';
        }
        if (this.state.passwordConfirm.length < 1) {
            errors.passwordConfirm = 'Form.EmptyFieldError';
        }
        if (this.state.password !== this.state.passwordConfirm) {
            errors.passwordConfirm = 'Form.PasswordsDontMatchError';
        }

        this.setState({
            errors: errors,
            requestCompleted: false,
            requestFailed: false
        })

        if (errors.password !== undefined || errors.passwordConfirm !== undefined) {
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


        makeChangePasswordRequest(this.token, this.state.password, this.state.passwordConfirm, this);
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={this.state.requestCompleted ? 'success' : 'danger'}
                       show={this.state.requestFailed || this.state.requestCompleted || this.state.initialRequestFailed}
                       className='m-3'>
                    {this.state.requestFailed || this.state.initialRequestFailed ? this.state.errorCode : ''}
                    <br/>
                    {this.state.response}
                </Alert>
                <div className="Form" id={this.state.initialRequestFailed ? 'hiddenForm' : ''}>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
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
                        <Form.Group size="lg" controlId="passwordConfirm">
                            <Form.Label className="required">{t('Form.passwordConfirm')}</Form.Label>
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
            </Fragment>
        );
    }
}

const PasswordResetFormTr = withTranslation()(PasswordResetFormNoTr);

export default function PasswordResetForm() {
    const params = useParams();
    return (
        <PasswordResetFormTr params={params}/>
    )
}