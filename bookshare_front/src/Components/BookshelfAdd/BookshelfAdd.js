import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Alert, Col, Modal, Row, Spinner} from "react-bootstrap";
import './BookshelfAdd.css';
import {makeAddGenreRequest} from "../../Requests/moks/AddGenreRequest";
import Cookies from "js-cookie";
import MapPicker from "react-google-map-picker";
import Icon from "../../Resources/pin.svg";
import Map from "../../Resources/map.png";
import {makeCreateShelfRequest} from "../../Requests/mop/CreateShelfRequest";


class BookshelfAddNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            id:'',
            location: {},
            errors: {},
            button: 'Form.CreateBookshelfButton',
            response: '',
            errorCode: '',
            requestFailed: false,
            locationAvailable: false,
            showModal: false,
            showSuccessModal: false
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
    }

    showModal() {
        this.setState({
            showModal: true
        })
    }

    hideModal() {
        this.setState({
            showModal: false
        })
    }

    showSuccessModal() {
        this.setState({
            showSuccessModal: true
        })
    }

    hideSuccessModal() {
        this.setState({
            showSuccessModal: false
        })
    }


    handleSubmit(event) {
        event.preventDefault();
        console.log("KLIK")
        const errors = this.checkForErrors();
        this.setState(
            {
                errors: errors
            }
        );
        if (Object.keys(errors).length > 0) {
            return;
        }


        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeCreateShelfRequest(token, this.state.location,this);
    }


    checkForErrors() {

        const errors = {}

        if (this.state.location.lat === undefined || this.state.location.lng === undefined) {
            errors
                .location = "Form.EmptyFieldError";
        }

        return errors;
    }
    ;

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

    getLocationFromMap(lat, lng) {
        this.setState({
            location: {lat: lat, lng: lng},
            showModal: false
        });
    }


    render() {
        const {t} = this.props
        return (
            <Fragment>
                <Alert variant='danger' show={this.state.requestFailed}>
                    {this.state.errorCode}
                    <br/>
                    {t(this.state.response)}
                </Alert>
                <div className="BookshelfAdd">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Group size="lg" controlId="genreCode">
                            <Form.Label>{t('Form.location')}</Form.Label>
                            <Form.Control
                                readOnly
                                type="text"
                                value={`${this.state.location.lng ? this.state.location.lng.toString().substring(0, 5) : ''} ${this.state.location.lat ? this.state.location.lat.toString().substring(0, 5) : ''}`}
                                isInvalid={!!this.state.errors.location}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.location)}
                            </Form.Control.Feedback>
                        </Form.Group>
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
                        <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                            {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                        </Button>
                    </Form>
                </div>

                <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.PickLocation')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MapPicker apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                   defaultLocation={this.state.location.lat ? this.state.location : {
                                       lat: 51.75,
                                       lng: 19.59
                                   }}
                                   zoom={this.state.location.lat ? 17 : 5}
                                   onChangeLocation={this.getLocationFromMap.bind(this)}
                        />
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showSuccessModal} onHide={this.hideSuccessModal.bind(this)} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Form.Success')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t('Form.BookshelfCreatedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button href={`/?#/shelves/${this.state.id}`}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}


const BookshelfAddTr = withTranslation()(BookshelfAddNoTr)
export default function BookshelfAdd() {
    return (
        <BookshelfAddTr/>
    )
}