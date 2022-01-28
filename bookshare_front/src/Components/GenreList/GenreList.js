import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Offcanvas, Pagination, Table} from "react-bootstrap";
import Cookies from "js-cookie";
import RefreshIcon from '../../Resources/refresh.png';
import Form from "react-bootstrap/Form";
import Icon from '../../Resources/pin.svg';
import Map from '../../Resources/map.png';
import {makeGenreListRequest} from "../../Requests/moks/GenreListRequest";

class GenreListNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            genres: [],
            requestError: false,
            message: '',
            sortBy: 'genreCodeUp',
            active:0,
            display:15

        };
    }

    componentDidMount() {
        this.makeRequest();
    }


    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeGenreListRequest(token, this);
    }

    reloadTable() {
        this.makeRequest();
    }

    renderRow(row) {
        return (
            <tr className={'accountRow'} onClick={() => {
                window.location.hash = `#/genres/${row.id}`;
                window.location.reload();
            }}>
                <td>{row.nameCode}</td>
                <td>{Object.keys(row.name).toString()}</td>
                <td>{row.usageCount}</td>
            </tr>)
    }

    renderRows() {
        const rows = this.state.genres;
        if (this.state.sortBy === "genreCodeUp") {
            rows.sort((a, b) => {
                return a.nameCode.toString().toUpperCase() > b.nameCode.toString().toUpperCase() ? 1 : (b.nameCode.toString().toUpperCase() > a.nameCode.toString().toUpperCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "genreCodeDown") {
            rows.sort((a, b) => {
                return a.nameCode.toString().toUpperCase() < b.nameCode.toString().toUpperCase() ? 1 : (b.nameCode.toString().toUpperCase() < a.nameCode.toString().toUpperCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "genreKeysUp") {
            rows.sort((a, b) => {
                return Object.keys(a.name).length > Object.keys(b.name).length ? 1 : (Object.keys(b.name).length > Object.keys(a.name).length ? -1 : 0)

            });
        }
        if (this.state.sortBy === "genreKeysDown") {
            rows.sort((a, b) => {
                return Object.keys(a.name).length < Object.keys(b.name).length ? 1 : (Object.keys(b.name).length < Object.keys(a.name).length ? -1 : 0)

            });
        }

            if (this.state.sortBy === "usageCountUp") {
                rows.sort((a, b) => {
                    return a.usageCount > b.usageCount ? 1 : (b.usageCount > a.usageCount ? -1 : 0)

                });
            }
            if (this.state.sortBy === "usageCountDown") {
                rows.sort((a, b) => {
                    return a.usageCount < b.usageCount ? 1 : (b.usageCount < a.usageCount ? -1 : 0)

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
                        <Pagination.Next disabled={((this.state.active + 1)  * this.state.display) >= this.state.genres.length} onClick={()=>this.setState({
                            active: this.state.active+1
                        })}/>
                        <div className={'ms-3 mt-1'}>{t(`Form.PaginationInfo`,{from:`${this.state.active * this.state.display + 1}`,to:`${Math.min(this.state.genres.length,(this.state.active + 1) * this.state.display)}`,of: `${this.state.genres.length}`})}</div>
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
                            <option value={'genreCodeUp'}>{t('Form.genreCodeUp')}</option>
                            <option value={'genreCodeDown'}>{t('Form.genreCodeDown')}</option>
                            <option value={'genreKeysUp'}>{t('Form.genreKeysUp')}</option>
                            <option value={'genreKeysDown'}>{t('Form.genreKeysDown')}</option>
                            <option value={'usageCountUp'}>{t('Form.usageCountUp')}</option>
                            <option value={'usageCountDown'}>{t('Form.usageCountDown')}</option>

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
                        <th>{t('Genre.code')}</th>
                        <th>{t('Genre.keys')}</th>
                        <th>{t('Genre.usageCount')}</th>
                        </thead>
                        <tbody>
                        {this.state.genres ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
            </Fragment>
        );
    }

}

const GenreListTr = withTranslation()(GenreListNoTr);

export default function GenreList() {
    return (<GenreListTr/>)
}