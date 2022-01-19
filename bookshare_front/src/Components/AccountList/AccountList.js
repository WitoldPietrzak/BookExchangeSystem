import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Offcanvas, Table} from "react-bootstrap";
import {makeAccountListRequest, makeFilteredAccountListRequest} from "../../Requests/mok/AccountListRequest";
import Cookies from "js-cookie";
import './AccountList.css';
import RefreshIcon from '../../Resources/refresh.png';
import {TextField} from "@material-ui/core";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";

class AccountListNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            requestError: false,
            message: '',
            showFilter: false,
            filterLogin: '',
            filterEmail: '',
            doFilter: false,
            filterErrors: {},
            button: 'Form.Filter'

        };
    }

    showFilter() {
        this.setState({
            showFilter: true
        });
    }

    hideFilter() {
        this.setState({
            showFilter: false
        });
    }

    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        this.state.doFilter ? makeFilteredAccountListRequest(token, this.state.filterLogin, this.state.filterEmail, this) : makeAccountListRequest(token, this)
    }

    componentDidMount() {
        this.makeRequest();
    }

    reloadTable() {
        this.makeRequest();
    }

    renderRow(row) {
        return (
            <tr className={'accountRow'} onClick={() => {
                window.location.hash = `#/accounts/${row.id}`;
                window.location.reload();
            }}>
                <td>{row.login}</td>
                <td>{row.email}</td>
            </tr>)
    }

    renderRows() {
        console.log(this.state.accounts)
        return this.state.accounts.map(row => this.renderRow(row));

    }

    handleFilter() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if (this.state.filterLogin || this.state.filterEmail) {
            this.setState({
                doFilter: true
            });
            makeFilteredAccountListRequest(token, this.state.filterLogin, this.state.filterEmail, this);
        }
        this.hideFilter();

    }

    displayFilterInfo() {
        const {t} = this.props;
        return (<Fragment>
            <div>{t('Filter.ActiveFilters')}:</div>
            <div className={'activeFilters mt-0 mb-0 m-5'}>
                {this.state.filterLogin ? <Button variant={'outline-dark'}>{t('Form.login')}={this.state.filterLogin}</Button> : ''}
                {this.state.filterEmail ? <Button variant={'outline-dark'}>{t('Form.email')}={this.state.filterEmail}</Button> : ''}
            </div>
        </Fragment>);
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={'danger'} show={this.state.requestError}
                       className={' mt-0 mb-3 m-5'}>{t(this.state.message)}</Alert>
                {this.state.doFilter ? this.displayFilterInfo() : ''}
                <div className={'usersButtons'}>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'}
                            onClick={this.reloadTable.bind(this)}>
                        <img src={RefreshIcon} width={20} height={20}/>
                    </Button>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'} onClick={this.showFilter.bind(this)}>
                        {t('Accounts.FilterButton')}
                    </Button>
                </div>
                <div className={'mt-3 mb-3 m-5 accounts'}>
                    <Table striped hover>
                        <thead>
                        <th>{t('Form.login')}</th>
                        <th>{t('Form.email')}</th>
                        </thead>
                        <tbody>
                        {this.state.accounts ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
                <Offcanvas show={this.state.showFilter} onHide={this.hideFilter.bind(this)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{t('Filter.Title')}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={this.handleFilter.bind(this)}>
                            <Form.Group size="lg" controlId="login">
                                <Form.Label className="required">{t('Form.login')}</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="text"
                                    value={this.state.filterLogin}
                                    onChange={(e) => {
                                        this.setState({
                                            filterLogin: e.target.value
                                        });
                                    }}
                                    isInvalid={!!this.state.filterErrors.login}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {t(this.state.filterErrors.login)}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="lg" controlId="email">
                                <Form.Label className="required">{t('Form.email')}</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="text"
                                    value={this.state.filterEmail}
                                    onChange={(e) => {
                                        this.setState({
                                            filterEmail: e.target.value
                                        });
                                    }}
                                    isInvalid={!!this.state.filterErrors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {t(this.state.filterErrors.email)}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                                {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                            </Button>
                            <Button variant='outline-dark' size="md" type="button" onClick={() => {
                                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                                this.setState({
                                    filterLogin: '',
                                    filterEmail: '',
                                    doFilter: false
                                });
                                makeAccountListRequest(token, this);
                                this.hideFilter();

                            }} className='m-3' disabled={false}>
                                {t('Form.ClearFilter')}
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
            </Fragment>
        );
    }

}

const AccountListTr = withTranslation()(AccountListNoTr);

export default function AccountList() {
    return (<AccountListTr/>)
}