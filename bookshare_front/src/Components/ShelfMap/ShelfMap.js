import React, {Fragment} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker, Circle} from 'google-maps-react';
import {withTranslation} from "react-i18next";
import {makeBookshelfListRequest, makeFilteredBookshelfListRequest} from "../../Requests/mop/BookshelfListRequest";
import Cookies from "js-cookie";
import Icon from '../../Resources/pin.svg';
import Bookshelf from "../Bookshelf/Bookshelf";
import {Link, Navigate} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";
import {makeCreateShelfRequest} from "../../Requests/mop/CreateShelfRequest";
import {isModerator} from "../../Routes/Router";

class ShelfMapNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {lat: 51.75, lng: 19.59},
            shelves: [],
            activeMarker: {},
            selectedPlace: {},
            showCreationModal:false,
            creationCoords:{lat:0,lng:0}
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: {lat: loc.coords.latitude, lng: loc.coords.longitude}
                })
                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                // makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, this.state.distance / 1000, this.state.bookCount, this);
                makeBookshelfListRequest(token,this);
            })
        }
    }


    onMapClicked(a,b,coords){
            console.log(coords.latLng.lat())
        console.log(coords.latLng.lng())
        this.setState({
            creationCoords:{lat:coords.latLng.lat(),lng:coords.latLng.lng()},
            showCreationModal:true
        })

    };

    showCreationModal(){
        this.setState({
            showCreationModal:true
        })
    }
    hideCreationModal(){
        this.setState({
            showCreationModal:false
        })
    }

    createBookshelf(){
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeCreateShelfRequest(token, this.state.creationCoords,this);
        this.hideCreationModal();
        setTimeout(()=>{makeBookshelfListRequest(token,this);},200);

    }


    renderMarker(shelf) {
        return (
            <Marker
                id={shelf.id}
                position={{lat: shelf.latitude, lng: shelf.longitude}}
                onClick={()=>{
                    window.location.hash = `#/shelves/${shelf.id}`;
                    window.location.reload();

                }}
            />
        )
    }

    renderMarkers() {
        return this.state.shelves ? this.state.shelves.map(shelf => this.renderMarker(shelf)) : '';
    }

    render() {
        const {t} = this.props;
        const {google} = this.props;
        return (
            <Fragment>
                <h1 className={'mv-3'}>{t('ShelfMap.title')}</h1>
                <Map onClick={isModerator()?this.onMapClicked.bind(this):''} google={this.props.google} zoom={6} center={this.state.location}
                     className='GoogleMap'
                     style={{width: 'auto', height: '600px', position: 'relative'}}>
                    {this.renderMarkers()}
                    <Marker
                        titles={'123'}
                        name={'My location'}
                        position={{lat: this.state.location.lat, lng: this.state.location.lng}}
                        icon={{
                            url: Icon,
                            anchor: new google.maps.Point(15, 20),
                            scaledSize: new google.maps.Size(32, 32)
                        }}
                    />
                    <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                        <div>
                            {<Bookshelf google={this.props.google} />}
                        </div>
                    </InfoWindow>
                </Map>
                <Modal show={this.state.showCreationModal} onHide={this.hideCreationModal.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Form.CreateBookshelfButton')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h>{t('Modal.CreationConfirm')}</h>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.createBookshelf.bind(this)} variant={'outline-dark'}>{t('Form.Yes')}</Button>
                        <Button onClick={this.hideCreationModal.bind(this)} variant={'outline-dark'}>{t('Form.No')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}


const ShelfMapTr = withTranslation()(ShelfMapNoTr);
const ShelfMapWrapped = GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(ShelfMapTr);

export default function ShelfMap() {
    return (
        <ShelfMapWrapped/>
    )
}



