import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {makeActivateUserRequest} from "../../Requests/mok/ActivateUserRequest";

class ActivationNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.token = this.props.token;
        this.state = {
            response: '',
            errorCode: '',
            requestCompleted: false,
            requestFailed: false
        }
        this.sendActivationRequest();
    }

    sendActivationRequest() {
        makeActivateUserRequest(this.state.token, this);

    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={this.state.requestFailed ? 'danger' : 'success'}
                       show={this.state.requestCompleted || this.state.requestFailed} className='m-3'>
                    {this.state.requestFailed ? this.state.errorCode : ''}
                    <br/>
                    {t(this.state.response)}
                </Alert>
                {/*<div className={this.state.requestCompleted ? 'visually-hidden' : ''}>{t('Activation.prompt')} </div>*/}
                {/*<Button type='button' variant='outlined' className='m-3'*/}
                {/*        onClick={this.sendActivationRequest.bind(this)}>*/}
                {/*    Button*/}
                {/*</Button>*/}

            </Fragment>
        )
    }
}

const ActivationTr = withTranslation()(ActivationNoTr);

export default function Activation() {
    return (
        <ActivationTr/>
    )
}