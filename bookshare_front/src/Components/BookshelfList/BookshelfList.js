import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import {Alert, Button, Modal, Offcanvas, Table} from "react-bootstrap";
import Cookies from "js-cookie";
import './BookshelfList.css';
import RefreshIcon from '../../Resources/refresh.png';
import Form from "react-bootstrap/Form";
import {makeBookshelfListRequest, makeFilteredBookshelfListRequest} from "../../Requests/mop/BookshelfListRequest";
import Icon from '../../Resources/pin.svg';
import Map from '../../Resources/map.png';
import MapPicker from 'react-google-map-picker'

class BookshelfListNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shelves: [],
            requestError: false,
            message: '',
            showFilter: false,
            filterDistance: '',
            filterBookCount: '',
            doFilter: false,
            filterErrors: {},
            button: 'Form.Filter',
            sortBy: 'bookCountDown',
            location: '',
            locationAvailable: false,
            showModal: false

        };
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    locationAvailable: true
                })
            })
        } else {
            this.setState({
                locationAvailable: false
            });
        }
        this.makeRequest();
    }

    getLocationFromBrowser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: {lat: loc.coords.latitude, lng: loc.coords.longitude},
                    locationAvailable: true
                });
            })
        } else {
            this.setState({
                locationAvailable: false
            });
        }
    }
     getLocationFromMap (lat, lng){
        this.setState({
            location:{lat:lat, lng:lng},
            showModal:false
        });
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

    showModal() {
        this.setState({
            showModal: true
        });
    }

    hideModal() {
        this.setState({
            showModal: false
        });
    }

    makeRequest() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        this.state.doFilter ? makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, this.state.filterDistance, this.state.filterBookCount, this) : makeBookshelfListRequest(token, this)
    }

    reloadTable() {
        this.makeRequest();
    }

    renderRow(row) {
        const {t} = this.props;
        return (
            <tr className={'accountRow'} onClick={() => {
                window.location.hash = `#/shelves/${row.id}`;
                window.location.reload();
            }}>
                {/*<td>{row.longitude} {row.latitude}</td>*/}
                <td>{row.bookCount}</td>
                <td>{row.distance ? (row.distance > 1 ? `${row.distance.toFixed(1)} km` : `${row.distance.toFixed(3).substring(2, 5)} m`) : t('Bookshelf.noLocation')}</td>
            </tr>)
    }

    renderRows() {
        const rows = this.state.shelves;
        if (this.state.sortBy === "bookCountUp") {
            rows.sort((a, b) => {
                return a.bookCount > b.bookCount ? 1 : (b.bookCount > a.bookCount ? -1 : 0)

            });
        }
        if (this.state.sortBy === "bookCountDown") {
            rows.sort((a, b) => {
                return a.bookCount < b.bookCount ? 1 : (b.bookCount < a.bookCount ? -1 : 0)

            });
        }
        if (this.state.sortBy === "distanceUp") {
            rows.sort((a, b) => {
                return a.distance === undefined ? (b.distance === undefined ? 0 : -1) : (b.distance === undefined ? 1 : (a.distance < b.distance ? 1 : (b.distance < a.distance ? -1 : 0)))

            });
        }
        if (this.state.sortBy === "distanceDown") {
            rows.sort((a, b) => {
                return a.distance === undefined ? (b.distance === undefined ? 0 : -1) : (b.distance === undefined ? 1 : (a.distance < b.distance ? -1 : (b.distance < a.distance ? 1 : 0)))

            });
        }


        return rows.map(row => this.renderRow(row));

    }

    handleFilter() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if (this.state.filterDistance || this.state.filterBookCount || this.state.location) {
            this.setState({
                doFilter: true
            });
            makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, this.state.filterDistance, this.state.filterBookCount, this);
        }
        this.hideFilter();

    }

    displayFilterInfo() {
        const {t} = this.props;
        return (<Fragment>
            <div>{t('Filter.ActiveFilters')}:</div>
            <div className={'activeFilters mt-0 mb-0 m-5'}>
                {this.state.filterDistance ?
                    <Button variant={'outline-dark'}>{t('Form.distance')}={this.state.filterDistance}</Button> : ''}
                {this.state.filterBookCount ?
                    <Button variant={'outline-dark'}>{t('Form.bookCount')}={this.state.filterBookCount}</Button> : ''}
                {this.state.location ?
                    <Button
                        variant={'outline-dark'}>{t('Form.userLocation')}={`${this.state.location.lng ? this.state.location.lng.toString().substring(0, 5) : ''} ${this.state.location.lat ? this.state.location.lat.toString().substring(0, 5) : ''}`}</Button> : ''}
            </div>
        </Fragment>);
    }

    render() {
        console.log(this.state.shelves.length)
        const {t} = this.props;
        return (
            <Fragment>
                <Alert variant={'danger'} show={this.state.requestError}
                       className={' mt-0 mb-3 m-5'}>{t(this.state.message)}</Alert>
                {this.state.doFilter ? this.displayFilterInfo() : ''}
                <div className={'usersButtons'}>
                    <div className={'m-3 sortDiv'}>
                        <Form.Label>{t('Form.sortBy')}</Form.Label>
                        <Form.Select defaultValue={this.state.sortBy} onChange={(e) => {
                            this.setState({
                                sortBy: e.target.value
                            });
                        }}>
                            <option value={'bookCountUp'}>{t('Form.bookCountUp')}</option>
                            <option value={'bookCountDown'}>{t('Form.bookCountDown')}</option>
                            <option value={'distanceUp'}>{t('Form.distanceUp')}</option>
                            <option value={'distanceDown'}>{t('Form.distanceDown')}</option>

                        </Form.Select>
                    </div>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'}
                            onClick={this.reloadTable.bind(this)}>
                        <img src={RefreshIcon} alt={''} width={20} height={20}/>
                    </Button>
                    <Button className={'m-1'} variant={'outline-dark'} size={'md'} onClick={this.showFilter.bind(this)}>
                        {t('Form.FilterButton')}
                    </Button>
                </div>
                <div className={'mt-3 mb-3 m-5 accounts'}>
                    <Table striped hover>
                        <thead>
                        <th>{t('Form.bookCount')}</th>
                        <th>{t('Form.distance')}</th>
                        </thead>
                        <tbody>
                        {this.state.shelves ? this.renderRows() : ''}
                        </tbody>
                    </Table>
                </div>
                <Offcanvas show={this.state.showFilter} onHide={this.hideFilter.bind(this)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{t('Filter.Title')}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={this.handleFilter.bind(this)}>
                            <Form.Group size="lg" controlId="bookCount">
                                <Form.Label className="required">{t('Form.bookCount')}</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="number"
                                    value={this.state.filterBookCount}
                                    onChange={(e) => {
                                        this.setState({
                                            filterBookCount: e.target.value
                                        });
                                    }}
                                    isInvalid={!!this.state.filterErrors.bookCount}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {t(this.state.filterErrors.bookCount)}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="lg" controlId="userLocation">
                                <Form.Label className="required">{t('Form.userLocation')}</Form.Label>
                                <div>
                                    <Form.Control
                                        readOnly
                                        type="text"
                                        value={`${this.state.location.lng ? this.state.location.lng.toString().substring(0, 5) : ''} ${this.state.location.lat ? this.state.location.lat.toString().substring(0, 5) : ''}`}
                                    />
                                    <Button className={'mt-3 mb-0 m-1'}
                                            disabled={!this.state.locationAvailable}
                                            onClick={this.getLocationFromBrowser.bind(this)}
                                            variant={'outline-dark'}>{
                                        <img alt={''} className={'mt-0 mb-0 m-1'} src={Icon} height={25}
                                             width={25}/>}{t('Form.LocationButton')}
                                    </Button>
                                    <Button className={'mt-3 mb-0 m-1'}
                                            onClick={this.showModal.bind(this)}
                                            variant={'outline-dark'}>{
                                                <img alt={''} className={'mt-0 mb-0 m-1'} src={Map} height={25}
                                        width={25}/>}{t('Form.FromMapButton')}
                                    </Button>
                                </div>
                            </Form.Group>
                            <Form.Group size="lg" controlId="distance">
                                <Form.Label className="required">{t('Form.distance')}</Form.Label>
                                <Form.Range
                                    autoFocus
                                    min={0}
                                    max={20}
                                    value={this.state.filterDistance}
                                    onChange={(e) => {
                                        this.setState({
                                            filterDistance: e.target.value
                                        });
                                    }}/>
                                <Form.Control
                                    autoFocus
                                    type="number"
                                    value={this.state.filterDistance}
                                    onChange={(e) => {
                                        this.setState({
                                            filterDistance: e.target.value
                                        });
                                    }}
                                    isInvalid={!!this.state.filterErrors.distance}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {t(this.state.filterErrors.distance)}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                                {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                            </Button>
                            <Button variant='outline-dark' size="md" type="button" onClick={() => {
                                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                                this.setState({
                                    filterDistance: '',
                                    filterBookCount: '',
                                    location: '',
                                    doFilter: false
                                });
                                makeBookshelfListRequest(token, this);
                                this.hideFilter();

                            }} className='m-3' disabled={false}>
                                {t('Form.ClearFilter')}
                            </Button>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
                <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.PickLocation')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MapPicker apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                   defaultLocation={{lat: 51.71, lng: 19.44}}
                                   zoom={10}
                                   onChangeLocation={this.getLocationFromMap.bind(this)}
                        />
                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }

}

const BookshelfListTr = withTranslation()(BookshelfListNoTr);

export default function BookshelfList() {
    return (<BookshelfListTr/>)
}