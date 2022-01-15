import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import './PasswordReset.css';
import Button from "react-bootstrap/Button";
import {makeSendChangePasswoerMailRequest} from "../../../Requests/mok/SendChangePasswordMailRequest";
import {Alert, Spinner} from "react-bootstrap";

class PasswordResetNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            loginOrMail: '',
            button: t('Form.SendPasswordResetButton'),
            errors: {},
            response: '',
            errorCode: '',
            requestCompleted: false,
            requestFailed: false
        }
    }

    handleSubmit() {
        const {t} = this.props;
        const errors = {};
        if (this.state.loginOrMail.length < 1) {
            errors.login = t('Form.EmptyFieldError');
        }

        this.setState({
            errors: errors,
            requestCompleted: false,
            requestFailed: false
        })

        if (errors.login !== undefined) {
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

        makeSendChangePasswoerMailRequest(this.state.loginOrMail, this);

    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={this.state.requestCompleted ? 'success' : 'danger'}
                       show={this.state.requestFailed || this.state.requestCompleted} className='m-3'>
                    {this.state.requestFailed ? this.state.errorCode : ''}
                    <br/>
                    {this.state.requestFailed ? t(this.state.response) : t('request_sent_message')}
                </Alert>
                <div className="LoginOrMail">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Group size="lg" controlId="loginOrMail">
                            <Form.Label className="required">{t('Form.loginOrMail')}</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.loginOrMail}
                                onChange={(e) => {
                                    this.setState({
                                        loginOrMail: e.target.value
                                    });
                                }}
                                isInvalid={!!this.state.errors.login}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.login}
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

const PasswordResetTr = withTranslation()(PasswordResetNoTr);

export default function PasswordReset() {
    return (
        <PasswordResetTr/>
    )
}