import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert} from "react-bootstrap";
import {makeActivateUserRequest} from "../../Requests/mok/ActivateUserRequest";
import {useParams} from "react-router-dom";

class ActivationNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.token = this.props.params.token;
        this.state = {
            response: '',
            errorCode: '',
            requestCompleted: false,
            requestFailed: false
        }
    }

    componentDidMount() {
        this.sendActivationRequest();
    }

    sendActivationRequest() {
        makeActivateUserRequest(this.token, this);

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
            </Fragment>
        )
    }
}

const ActivationTr = withTranslation()(ActivationNoTr);

export default function Activation() {
    const params = useParams();
    return (
        <ActivationTr params={params}/>
    )
}