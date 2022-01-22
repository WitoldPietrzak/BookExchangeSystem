import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Accordion, Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import './AdminAccountEdit.css'
import {isAdmin} from "../../Routes/Router";
import {Checkbox, Radio} from "@material-ui/core";
import {makeAnyAccountInfoRequest} from "../../Requests/mok/AccountInfoRequest";
import RefreshIcon from '../../Resources/refresh.png';
import {addAccessLevel, revokeAccessLevel} from "../../Requests/mok/ChangeAccessLevelRequest";
import {useParams} from "react-router-dom";
import {makeDisableAccountRequest, makeEnableAccountRequest} from "../../Requests/mok/EnableDisableUserRequest";

class AdminAccountEditNoTr extends React.Component {
    constructor(props) {
        super(props);
        const {t} = this.props;
        this.id = this.props.params.id;
        this.state = {
            id: '',
            login: '',
            email: '',
            language: '',
            activated: '',
            disabled: '',
            roles: [],
            lastSuccessfulLoginAttemptDateTime: '',
            creationDateTime: '',
            version: '',
            oldPassword: '',
            passwordButton: t('Form.ChangePasswordButton'),
            roleRequestFailed: false,
            roleResponse: '',
            response: '',
            requestFailed: false
        }
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAnyAccountInfoRequest(token, this.id, this);
    }

    reloadUserInfo() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAnyAccountInfoRequest(token, this.id, this)
    }

    changeRoleStatus(checked, role) {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if (checked) {
            addAccessLevel(token, this.state.id, role, this);
        } else {
            revokeAccessLevel(token, this.state.id, role, this);
        }


    }

    enableUser() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeEnableAccountRequest(token, this.id, this);
        this.reloadUserInfo();
    }

    disableUser() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeDisableAccountRequest(token, this.id, this);
        this.reloadUserInfo();
    }

    accessLevelChange() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert className='mt-3 mb-3 m-5' show={this.state.roleRequestFailed}
                       variant={'danger'}>{t(this.state.roleResponse)}</Alert>
                <div className={'AccessLevelChange mt-3 mb-3'}>
                    <Row className={'mt-2 mb-3 Title'}>
                        <Col>{t('Account.ChangeAccessLevels')}</Col>
                    </Row>
                    <Row>
                        <Col>
                            <Checkbox onChange={event => {
                                this.changeRoleStatus(event.target.checked, event.target.value)
                            }} value={'ROLE_USER'} checked={this.state.roles.includes("ROLE_USER")}/>
                            {t('ROLE_USER')}
                        </Col>
                        <Col>
                            <Checkbox onChange={event => {
                                this.changeRoleStatus(event.target.checked, event.target.value)
                            }} value={'ROLE_MODERATOR'} checked={this.state.roles.includes("ROLE_MODERATOR")}/>
                            {t('ROLE_MODERATOR')}
                        </Col>
                        <Col>
                            <Checkbox onChange={event => {
                                this.changeRoleStatus(event.target.checked, event.target.value)
                            }} value={'ROLE_ADMIN'} checked={this.state.roles.includes("ROLE_ADMIN")}/>
                            {t('ROLE_ADMIN')}
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    renderUserInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <div className={'Refresh'}>
                    <Button variant={'outline-dark'} size={'sm'} onClick={this.reloadUserInfo.bind(this)}>
                        <img src={RefreshIcon} width={25} height={25}/>
                    </Button>
                </div>
                <Row className={'Title'}>
                    <Col>{t('UserInfo.Header')} </Col></Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.login')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.login}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.email')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.email}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.language')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.language.toUpperCase()}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.userActivated')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.activated ? t('Form.Yes') : t('Form.No')}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.userDisabled')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.disabled ? t('Form.Yes') : t('Form.No')}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.lastSuccessfulLoginAttempt')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.lastSuccessfulLoginAttemptDateTime}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.lastSuccessfulLoginIp')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.lastSuccessfulLoginIp}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.lastUnsuccessfulLoginAttempt')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.lastUnsuccessfulLoginAttemptDateTime}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.lastUnsuccessfulLoginIp')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.lastUnsuccessfulLoginIp}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.creationDate')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.creationDateTime}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Form.modificationDate')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.modificationDateTime}</Col>
                </Row>
            </div>
        )
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Row>
                    <Col>
                        {this.renderUserInfo()}
                    </Col>
                    <Col>
                        <Alert show={this.state.requestFailed}
                               className={'mt-0 m-3'}
                               variant={'danger'}>{t(this.state.response)}</Alert>
                        <div className={'d-grid gap-2 mt-0 mb-0 m-5'}>
                            <Button disabled={this.state.disabled} variant={'outline-dark'} size={'md'}
                                    onClick={this.disableUser.bind(this)}>{t('Account.Disable')}</Button>
                            <Button disabled={!this.state.disabled} variant={'outline-dark'} size={'md'}
                                    onClick={this.enableUser.bind(this)}>{t('Account.Enable')}</Button>
                        </div>

                    </Col>
                </Row>
                {this.accessLevelChange()}
            </Fragment>
        );
    }
}

const AdminAccountEditTr = withTranslation()(AdminAccountEditNoTr);

export default function AdminAccountEdit() {
    const params = useParams();
    return (
        <AdminAccountEditTr params={params}/>
    )


}