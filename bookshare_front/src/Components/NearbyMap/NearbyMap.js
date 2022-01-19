import React from "react";
import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import {withTranslation} from "react-i18next";
import './NearbyMap.css';

class NearbyMapNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {lat: 0.0, lng: 0.0}
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loc => {
                this.setState({
                    location: {lat: loc.coords.latitude, lng: loc.coords.longitude}
                })
            })
        }
    }

    render() {
        const {t} = this.props;
        return (
            <Map google={this.props.google} zoom={17} center={this.state.location} className='GoogleMap'
                 style={{width: 'auto', height: '600px', position: 'relative'}}>
            </Map>
        )
    }
}


const NearbyMapTr = withTranslation()(NearbyMapNoTr);
const NearbyMapWrapped = GoogleApiWrapper({
    apiKey: ('AIzaSyA7TpSBdp1X6FwTJGovDXhJHNflaq6_9og')
})(NearbyMapTr);

export default function NearbyMap() {
    return (
        <NearbyMapWrapped/>
    )
}



