import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Accordion, Alert, Button, Col, Form, Row} from "react-bootstrap";
import './OwnAccountEdit.css'
import {isAdmin} from "../../Routes/Router";
import {Checkbox} from "@material-ui/core";
import {makeOwnAccountInfoRequest} from "../../Requests/mok/AccountInfoRequest";
import RefreshIcon from '../../Resources/refresh.png';
import {makeChangePasswordRequest} from "../../Requests/mok/ChangePasswordRequest";
import {addAccessLevel, revokeAccessLevel} from "../../Requests/mok/ChangeAccessLevelRequest";

class OwnAccountEditNoTr extends React.Component {
    constructor(props) {
        super(props);
        const {t} = this.props;
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
            password: '',
            passwordConfirm: '',
            passwordRequestCompleted: false,
            passwordRequestFailed: false,
            passwordResponse: '',
            passwordErrors: {},
            passwordButton: t('Form.ChangePasswordButton'),
            roleRequestFailed: false,
            roleResponse: '',
        }
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeOwnAccountInfoRequest(token, this);
    }

    handlePasswordFormSubmit() {
        const errors = {};
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
        if (this.state.oldPassword.length < 1) {
            errors.oldPassword = 'Form.EmptyFieldError';
        }
        this.setState({
            passwordErrors: errors,
        })

        if (errors.password !== undefined || errors.passwordConfirm !== undefined) {
            return;
        }
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeChangePasswordRequest(token, this.state.oldPassword, this.state.password, this.state.passwordConfirm, this);

    }

    reloadUserInfo() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeOwnAccountInfoRequest(token, this)
    }

    changeRoleStatus(checked, role){
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if(checked){
         addAccessLevel(token, this.state.id,role,this);
        }
        else {
        revokeAccessLevel(token,this.state.id,role,this);
        }


    }

    accessLevelChange() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert className='mt-3 mb-3 m-5' show={this.state.roleRequestFailed} variant={'danger'}>{t(this.state.roleResponse)}</Alert>
                <div className={'AccessLevelChange mt-3 mb-3'}>
                    <Row className={'mt-2 mb-3 Title'}>
                        <Col>{t('Account.ChangeAccessLevels')}</Col>
                    </Row>
                    <Row>
                        <Col>
                            <Checkbox onChange={event =>{this.changeRoleStatus(event.target.checked, event.target.value)} } value={'ROLE_USER'} checked={this.state.roles.includes("ROLE_USER")}/>
                            {t('ROLE_USER')}
                        </Col>
                        <Col>
                            <Checkbox onChange={event =>{this.changeRoleStatus(event.target.checked, event.target.value)} } value={'ROLE_MODERATOR'} checked={this.state.roles.includes("ROLE_MODERATOR")}/>
                            {t('ROLE_MODERATOR')}
                        </Col>
                        <Col>
                            <Checkbox onChange={event =>{this.changeRoleStatus(event.target.checked, event.target.value)} } value={'ROLE_ADMIN'} disabled={true} checked={this.state.roles.includes("ROLE_ADMIN")}/>
                            {t('ROLE_ADMIN')}
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }

    passwordChange() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert show={this.state.passwordRequestCompleted || this.state.passwordRequestFailed}
                       className={'mt-0 m-3'}
                       variant={this.state.passwordRequestCompleted ? 'success' : 'danger'}>{t(this.state.passwordResponse)}</Alert>
                <Accordion className={' mt-0 mb-0 m-3 PasswordAccordion'} flush>
                    <Accordion.Item className={'PasswordAccordion'} eventKey={0} flush>
                        <Accordion.Header flush
                                          className={'PasswordAccordion'}>{t('Account.PasswordChangeAccordion')}</Accordion.Header>
                        <Accordion.Body flush className={'PasswordAccordion'}>
                            <div className="Password">
                                <Form onSubmit={this.handlePasswordFormSubmit.bind(this)}>
                                    <Form.Group size="lg" controlId="oldPassword">
                                        <Row className={'m-1'}>
                                            <Col><Form.Label
                                                className="required">{t('Form.oldPassword')}</Form.Label></Col>
                                            <Col><Form.Control
                                                autoFocus
                                                type="password"
                                                value={this.state.oldPassword}
                                                onChange={(e) => {
                                                    this.setState({
                                                        oldPassword: e.target.value
                                                    });
                                                }}
                                                isInvalid={!!this.state.passwordErrors.oldPassword}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {t(this.state.passwordErrors.oldPassword)}
                                                </Form.Control.Feedback></Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group size="lg" controlId="password">
                                        <Row className={'m-1'}>
                                            <Col><Form.Label
                                                className="required">{t('Form.password')}</Form.Label></Col>
                                            <Col><Form.Control
                                                autoFocus
                                                type="password"
                                                value={this.state.password}
                                                onChange={(e) => {
                                                    this.setState({
                                                        password: e.target.value
                                                    });
                                                }}
                                                isInvalid={!!this.state.passwordErrors.password}
                                            /><Form.Control.Feedback type="invalid">
                                                {t(this.state.passwordErrors.password)}
                                            </Form.Control.Feedback></Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group size="lg" controlId="passwordConfirm">
                                        <Row className={'m-1'}>
                                            <Col><Form.Label
                                                className="required">{t('Form.passwordConfirm')}</Form.Label></Col>
                                            <Col><Form.Control
                                                autoFocus
                                                type="password"
                                                value={this.state.passwordConfirm}
                                                onChange={(e) => {
                                                    this.setState({
                                                        passwordConfirm: e.target.value
                                                    });
                                                }}
                                                isInvalid={!!this.state.passwordErrors.passwordConfirm}
                                            />
                                                <Form.Control.Feedback type="invalid">
                                                    {t(this.state.passwordErrors.passwordConfirm)}
                                                </Form.Control.Feedback></Col>
                                        </Row>
                                    </Form.Group>
                                    <Button variant='outline-dark' size="md" type="submit" className='m-3'
                                            disabled={false}>
                                        {this.state.passwordButton}
                                    </Button>

                                </Form>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Fragment>
        )
    }

    renderUserInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <div className={'Refresh'}>
                    <Button variant={'outline-dark'} size={'sm'} onClick={this.reloadUserInfo.bind(this)}>
                        <img src={RefreshIcon} alt={''} width={25} height={25}/>
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
                    <Col className={'InfoLeftColumn'}>{t('Form.creationDate')}:</Col>
                    <Col className={'InfoRightColumn'}>{this.state.creationDateTime}</Col>
                </Row>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                <div className={'pt-5 pb-1'}>
                <Row>
                    <Col>
                        {this.renderUserInfo()}
                    </Col>
                    <Col>
                        {this.passwordChange()}
                    </Col>
                </Row>
                {isAdmin() ? this.accessLevelChange() : ''}
                </div>
            </Fragment>

        );
    }
}

const OneAccountEditTr = withTranslation()(OwnAccountEditNoTr);

export default function OwnAccountEdit() {
    return (
        <OneAccountEditTr/>
    )


}