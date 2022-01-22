import React from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker, Circle} from 'google-maps-react';
import {withTranslation} from "react-i18next";
import './NearbyMap.css';
import {makeFilteredBookshelfListRequest} from "../../Requests/mop/BookshelfListRequest";
import Cookies from "js-cookie";
import Icon from '../../Resources/pin.svg';

class NearbyMapNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {lat: 0.0, lng: 0.0},
            shelves: [],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: {lat: loc.coords.latitude, lng: loc.coords.longitude}
                })
                const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
                makeFilteredBookshelfListRequest(token, this.state.location.lng, this.state.location.lat, 3,0, this);
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
                titles={'123'}
                name={shelf.distance.toString().substring(0, 5)}
                position={{lat: shelf.latitude, lng: shelf.longitude}}
                onClick={this.onMarkerClick}
            />
        )
    }

    renderCircle(){
        return(
                <Circle
                radius={3000}
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
            <Map onClick={this.onMapClicked} google={this.props.google} zoom={13} center={this.state.location}
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
                        anchor: new google.maps.Point(15,20),
                        scaledSize: new google.maps.Size(32,32)
                    }}
                />
                {this.renderCircle()}
                <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                    <div>
                        {this.state.selectedPlace.name}
                    </div>
                </InfoWindow>
            </Map>
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



