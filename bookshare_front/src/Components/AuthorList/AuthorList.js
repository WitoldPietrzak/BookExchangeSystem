import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Offcanvas, Pagination, Table} from "react-bootstrap";
import Cookies from "js-cookie";
import RefreshIcon from '../../Resources/refresh.png';
import Form from "react-bootstrap/Form";
import Icon from '../../Resources/pin.svg';
import Map from '../../Resources/map.png';
import {makeAuthorListRequest} from "../../Requests/moks/AuthorListRequest";
import {makeDeleteAuthorRequest} from "../../Requests/moks/DeleteAuthorRequest";

class AuthorListNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authors: [],
            requestError: false,
            message: '',
            sortBy: 'authorSurnameUp',
            active:0,
            display:15

        };
    }

    componentDidMount() {
        this.makeRequest();
    }


    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAuthorListRequest(token, this);
    }

    reloadTable() {
        this.makeRequest();
    }

    deleteAuthor(id,version){
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeDeleteAuthorRequest(token,id,version, this);
        setTimeout(()=>{this.reloadTable()},200)
    }

    renderRow(row) {
        const  {t} = this.props;
        return (
            <tr>
                <td>{row.name}</td>
                <td>{row.surname}</td>
                <td>{row.booksCount}</td>
                <td><Button onClick={()=>{this.deleteAuthor(row.id,row.version)}} variant={'outline-dark'} size={'sm'}>{t('Book.Delete')}</Button></td>
            </tr>)
    }

    renderRows() {
        const rows = this.state.authors;
        if (this.state.sortBy === "authorNameUp") {
            rows.sort((a, b) => {
                return a.name.toString().toUpperCase() > b.name.toString().toUpperCase() ? 1 : (b.name.toString().toUpperCase() > a.name.toString().toUpperCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorNameDown") {
            rows.sort((a, b) => {
                return a.name.toString().toUpperCase() < b.name.toString().toUpperCase() ? 1 : (b.name.toString().toUpperCase() < a.name.toString().toUpperCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorSurnameUp") {
            rows.sort((a, b) => {
                return a.surname.toString().toUpperCase() > b.surname.toString().toUpperCase() ? 1 : (b.surname.toString().toUpperCase() > a.surname.toString().toUpperCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "authorSurnameDown") {
            rows.sort((a, b) => {
                return a.surname.toString().toUpperCase() < b.surname.toString().toUpperCase() ? 1 : (b.surname.toString().toUpperCase() < a.surname.toString().toUpperCase() ? -1 : 0)

            });
        }

        if (this.state.sortBy === "booksCountUp") {
            rows.sort((a, b) => {
                return a.booksCount > b.booksCount ? 1 : (b.booksCount > a.booksCount ? -1 : 0)

            });
        }
        if (this.state.sortBy === "booksCountDown") {
            rows.sort((a, b) => {
                return a.booksCount < b.booksCount ? 1 : (b.booksCount < a.booksCount ? -1 : 0)

            });

        }
        return rows.map((row,index) => {
            return (index>= (this.state.active * this.state.display)&&index< (this.state.active + 1) * this.state.display)?this.renderRow(row):''
        });

    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={'danger'} show={this.state.requestError}
                       className={' mt-0 mb-3 m-5'}>{t(this.state.message)}</Alert>
                <div className={'usersButtons'}>
                    <div className={'m-3 sortDiv'}>                <Pagination className={'ms-5'}>
                        <Pagination.Prev disabled={this.state.active===0} onClick={()=>this.setState({
                            active: this.state.active-1
                        })}/>
                        <Pagination.Next disabled={((this.state.active + 1)  * this.state.display) >= this.state.authors.length} onClick={()=>this.setState({
                            active: this.state.active+1
                        })}/>
                        <div className={'ms-3 mt-1'}>{t(`Form.PaginationInfo`,{from:`${this.state.active * this.state.display + 1}`,to:`${Math.min(this.state.authors.length,(this.state.active + 1) * this.state.display)}`,of: `${this.state.authors.length}`})}</div>
                    </Pagination> </div>
                    <div className={'m-3 sortDiv'}>
                        <Form.Label>{t('Form.displaySize')}</Form.Label>
                        <Form.Select defaultValue={this.state.sortBy} onChange={(e) => {
                            this.setState({
                                display: e.target.value,
                                active:0
                            });
                        }}>
                            <option value={15}>{t('15')}</option>
                            <option value={30}>{t('30')}</option>
                            <option value={50}>{t('50')}</option>
                            <option value={100}>{t('100')}</option>
                        </Form.Select>
                    </div>
                    <div className={'m-3 sortDiv'}>
                        <Form.Label>{t('Form.sortBy')}</Form.Label>
                        <Form.Select defaultValue={this.state.sortBy} onChange={(e) => {
                            this.setState({
                                sortBy: e.target.value
                            });
                        }}>
                            <option value={'authorNameUp'}>{t('Form.authorNameUp')}</option>
                            <option value={'authorNameDown'}>{t('Form.authorNameDown')}</option>
                            <option value={'authorSurnameUp'}>{t('Form.authorSurnameUp')}</option>
                            <option value={'authorSurnameDown'}>{t('Form.authorSurnameDown')}</option>
                            <option value={'booksCountUp'}>{t('Form.booksCountUp')}</option>
                            <option value={'booksCountDown'}>{t('Form.booksCountDown')}</option>

                        </Form.Select>
                    </div>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'}
                            onClick={this.reloadTable.bind(this)}>
                        <img src={RefreshIcon} alt={''} width={20} height={20}/>
                    </Button>
                </div>
                <div className={'mt-3 mb-3 m-5 accounts'}>
                    <Table striped hover>
                        <thead>
                        <th>{t('Author.name')}</th>
                        <th>{t('Author.surname')}</th>
                        <th>{t('Author.booksCount')}</th>
                        <th>{t('Author.options')}</th>
                        </thead>
                        <tbody>
                        {this.state.authors ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
            </Fragment>
        );
    }

}

const AuthorListTr = withTranslation()(AuthorListNoTr);

export default function AuthorList() {
    return (<AuthorListTr/>)
}