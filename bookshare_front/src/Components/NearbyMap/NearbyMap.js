import React, {Fragment} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker, Circle} from 'google-maps-react';
import {withTranslation} from "react-i18next";
import './NearbyMap.css';
import {makeFilteredBookshelfListRequest} from "../../Requests/mop/BookshelfListRequest";
import Cookies from "js-cookie";
import Icon from '../../Resources/pin.svg';
import {Slider, Switch} from "@mui/material";
import Bookshelf from "../Bookshelf/Bookshelf";
import BookshelfAdd from "../BookshelfAdd/BookshelfAdd";

class NearbyMapNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {lat: 51.75, lng: 19.59},
            shelves: [],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            distance: 3000,
            bookCount:0
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: {lat: loc.coords.latitude, lng: loc.coords.longitude}
                })
                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, this.state.distance / 1000, this.state.bookCount, this);
            })
        }
    }


    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    renderMarker(shelf) {
        return (
            <Marker
                id={shelf.id}
                name={shelf.distance.toString().substring(0, 5)}
                position={{lat: shelf.latitude, lng: shelf.longitude}}
                onClick={()=>{
                    window.location.hash = `#/shelves/${shelf.id}`;
                    window.location.reload();

                }}
            />
        )
    }

    renderCircle() {
        return (
            <Circle
                radius={this.state.distance}
                center={this.state.location}
                strokeColor='transparent'
                strokeOpacity={0}
                strokeWeight={5}
                fillColor='blue'
                fillOpacity={0.15}
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
                {t('Nearby.MinimalBooksValue')}
                <br/>
                <Slider aria-label="Always visible"
                        max={4}
                        min={0}
                        value={this.state.bookCount}
                        valueLabelDisplay={'on'}
                        onChange={e => {
                            this.setState({
                                bookCount: e.target.value
                            })
                            const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                            makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, this.state.distance / 1000, e.target.value, this);
                        }
                        }/>
                <br/>
                {t('Form.distance')} [m]
                <Slider aria-label="Always visible"
                        max={10000}
                        min={0}
                        value={this.state.distance}
                        valueLabelDisplay={'on'}
                        onChange={e => {
                            this.setState({
                                distance: e.target.value
                            })
                            const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                            makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, e.target.value / 1000, this.state.bookCount, this);
                        }
                        }/>
                <Map onClick={this.onMapClicked} google={this.props.google} zoom={12} center={this.state.location}
                     className='GoogleMap'
                     style={{width: 'auto', height: '600px', position: 'relative'}}>
                    {this.renderMarkers()}
                    <Marker
                        titles={'123'}
                        name={'My location'}
                        position={{lat: this.state.location.lat, lng: this.state.location.lng}}
                        onClick={this.onMarkerClick}
                        icon={{
                            url: Icon,
                            anchor: new google.maps.Point(15, 20),
                            scaledSize: new google.maps.Size(32, 32)
                        }}
                    />
                    {this.renderCircle()}
                    <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                        <div>
                            {<Bookshelf google={this.props.google} />}
                        </div>
                    </InfoWindow>
                </Map>
            </Fragment>
        )
    }
}


const NearbyMapTr = withTranslation()(NearbyMapNoTr);
const NearbyMapWrapped = GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(NearbyMapTr);

export default function NearbyMap() {
    return (
        <NearbyMapWrapped/>
    )
}



