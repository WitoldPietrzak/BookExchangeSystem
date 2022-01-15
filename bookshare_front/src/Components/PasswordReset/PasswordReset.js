import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import './PasswordReset.css';
import Button from "react-bootstrap/Button";

class PasswordResetNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            loginOrMail:'',
            button:t('Form.SendPasswordResetButton'),
            errors:{}
        }
    }

    handleSubmit(){

    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
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
                                \
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

export default function PasswordReset(){
    return(
        <PasswordResetTr/>
    )
}