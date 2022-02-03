import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Offcanvas, Table, Pagination} from "react-bootstrap";
import Cookies from "js-cookie";
import './Logs.css';
import RefreshIcon from '../../Resources/refresh.png';
import Form from "react-bootstrap/Form";
import {makeFilteredLogsRequest, makeLogsRequest} from "../../Requests/mok/LogsRequest";
import TextField from "@mui/material/TextField";

class LogsNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            requestError: false,
            message: '',
            showFilter: false,
            filterLevel: null,
            filterAfter: null,
            filterBefore: null,
            doFilter: false,
            filterErrors: {},
            button: 'Form.Filter',
            sortBy: 'eventDateDown',
            showLog: false,
            log: {},
            active:0,
            display:15

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

    showLog() {
        this.setState({
            showLog: true
        });
    }

    hideLog() {
        this.setState({
            showLog: false
        });
    }

    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        this.state.doFilter ? makeFilteredLogsRequest(token, this.state.filterLevel, this.state.filterAfter, this.state.filterBefore, this) : makeLogsRequest(token, this)
    }

    componentDidMount() {
        this.makeRequest();
    }

    reloadTable() {
        this.makeRequest();
        this.setState({
            active:0
        })
    }

    renderRow(row) {
        return (
            <tr className={`logRow ${row.level}`} onClick={() => {
                this.setState({
                    log: row,
                });
                this.showLog();
            }
            }>
                <td>{row.eventDate}</td>
                <td>{row.level}</td>
                <td>{(row.message && row.message.length > 100) ? `${row.message.substring(0, 97)}...` : row.message} </td>
            </tr>)
    }

    renderRows() {
        const rows = this.state.logs;
        if (this.state.sortBy === "eventDateUp") {
            rows.sort((a, b) => {
                return a.eventDate.toUpperCase() > b.eventDate.toUpperCase() ? 1 : (b.eventDate.toUpperCase() > a.eventDate.toUpperCase() ? -1 : 0)

            });
        }
        if (this.state.sortBy === "eventDateDown") {
            rows.sort((a, b) => {
                return a.eventDate.toUpperCase() > b.eventDate.toUpperCase() ? -1 : (b.eventDate.toUpperCase() > a.eventDate.toUpperCase() ? 1 : 0)

            });
        }

        return rows.map((row,index) => {
            return (index>= (this.state.active * this.state.display)&&index< (this.state.active + 1) * this.state.display)?this.renderRow(row):''
        });

    }

    handleFilter() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if (this.state.filterLevel || this.state.filterBefore || this.state.filterAfter) {
            this.setState({
                doFilter: true,
                active:0
            });
            makeFilteredLogsRequest(token, this.state.filterLevel, this.state.filterAfter, this.state.filterBefore, this);
        }
        this.hideFilter();

    }

    displayFilterInfo() {
        const {t} = this.props;
        return (<Fragment>
            <div>{t('Filter.ActiveFilters')}:</div>
            <div className={'activeFilters mt-0 mb-0 m-5'}>
                {this.state.filterLevel ?
                    <Button variant={'outline-dark'}>{t('Form.level')}={this.state.filterLevel}</Button> : ''}
                {this.state.filterAfter ?
                    <Button variant={'outline-dark'}>{t('Form.dateAfter')}={this.state.filterAfter}</Button> : ''}
                {this.state.filterBefore ?
                    <Button variant={'outline-dark'}>{t('Form.dateBefore')}={this.state.filterBefore}</Button> : ''}
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
                <div className={'logsButtons'}>
                    <div className={'m-3 sortDiv'}>                <Pagination className={'ms-5'}>
                        <Pagination.Prev disabled={this.state.active===0} onClick={()=>this.setState({
                            active: this.state.active-1
                        })}/>
                        <Pagination.Next disabled={((this.state.active + 1)  * this.state.display) >= this.state.logs.length} onClick={()=>this.setState({
                            active: this.state.active+1
                        })}/>
                        <div className={'ms-3 mt-1'}>{t(`Form.PaginationInfo`,{from:`${this.state.active * this.state.display + 1}`,to:`${Math.min(this.state.logs.length,(this.state.active + 1) * this.state.display)}`,of: `${this.state.logs.length}`})}</div>
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
                            <option value={'eventDateUp'}>{t('Form.oldestDate')}</option>
                            <option value={'eventDateDown'}>{t('Form.newestDate')}</option>
                        </Form.Select>
                    </div>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'}
                            onClick={this.reloadTable.bind(this)}>
                        <img src={RefreshIcon} width={20} height={20}/>
                    </Button>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'} onClick={this.showFilter.bind(this)}>
                        {t('Logs.FilterButton')}
                    </Button>
                </div>

                <div className={'mt-3 mb-3 m-5 logs'}>
                    <Table striped hover>
                        <thead>
                        <th>{t('Form.date')}</th>
                        <th>{t('Form.level')}</th>
                        <th>{t('Form.message')}</th>
                        </thead>
                        <tbody>
                        {this.state.logs ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
                <Offcanvas show={this.state.showFilter} onHide={this.hideFilter.bind(this)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{t('Filter.Title')}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={this.handleFilter.bind(this)}>
                            <Form.Group size="lg" controlId="level">
                                <Form.Label className="required">{t('Form.level')}</Form.Label>
                                <Form.Select defaultValue={this.state.filterLevel} onChange={(e) => {
                                    this.setState({
                                        filterLevel: e.target.value
                                    });
                                }}>
                                    <option value={'TRACE'}>TRACE</option>
                                    <option value={'DEBUG'}>DEBUG</option>
                                    <option value={'INFO'}>INFO</option>
                                    <option value={'WARN'}>WARN</option>
                                    <option value={'ERROR'}>ERROR</option>
                                    <option value={'FATAL'}>FATAL</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Label className="required mt-3">{t('Form.dateBefore')}</Form.Label>
                            <br/>
                            <TextField
                                className={'m-3'}
                                type={'datetime-local'}
                                variant={'standard'}
                                onChange={event => {this.setState({
                                    filterBefore:event.target.value
                                })}}
                            />
                            <br/>
                            <Form.Label className="required mt-3">{t('Form.dateAfter')}</Form.Label>
                            <br/>
                            <TextField
                                className={'m-3'}
                                type={'datetime-local'}
                                variant={'standard'}
                                onChange={event => {this.setState({
                                    filterAfter:event.target.value
                                })}}
                            />
                            <br/>
                            <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                                {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                            </Button>
                            <Button variant='outline-dark' size="md" type="button" onClick={() => {
                                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                                this.setState({
                                    filterLevel: '',
                                    filterAfter: '',
                                    filterBefore: '',
                                    doFilter: false
                                });
                                makeLogsRequest(token, this);
                                this.hideFilter();

                            }} className='m-3' disabled={false}>
                                {t('Form.ClearFilter')}
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
                <Offcanvas show={this.state.showLog} onHide={this.hideLog.bind(this)} placement={'top'}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{t('Log.Title')}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className={'logInfo m-3 p-3'}>
                            <div className={'dataDiv'}>
                                {t('Form.date')}: {this.state.log.eventDate}
                            </div>
                            <div className={'loggerDiv'}>
                                {t('Form.logger')}: {this.state.log.logger}
                            </div>
                            <div className={'levelDiv'}>
                                {t('Form.level')}: {this.state.log.level}
                            </div>
                            <div className={'messageDiv'}>
                                {t('Form.message')}: {this.state.log.message}
                            </div>
                            <div className={'exceptionDiv'}>
                                {t('Form.exception')}: {this.state.log.exception}
                            </div>
                        </div>


                    </Offcanvas.Body>
                </Offcanvas>
            </Fragment>
        );
    }

}

const LogsTr = withTranslation()(LogsNoTr);

export default function Logs() {
    return (<LogsTr/>)
}